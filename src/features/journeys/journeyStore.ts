import { create } from 'zustand';

export type QuestStatus = 'locked' | 'available' | 'completed';

interface QuestProgress {
  questId: string;
  status: QuestStatus;
  completedAt?: number; // unix ms
}

interface JourneyProgress {
  journeyId: string;
  startedAt: number; // unix ms
  quests: Record<string, QuestProgress>;
}

interface QuestProgressState {
  progress: Record<string, JourneyProgress>;

  // Audio / playback state (persists across screens via the floating MiniAudioPlayer)
  currentVerseKey: string | null;
  isPlaying: boolean;
  reciterId: number; // default 7 (Mishary Rashid al-Afasy)

  // Selectors
  getJourneyProgress: (journeyId: string) => JourneyProgress | undefined;
  getQuestStatus: (journeyId: string, questId: string) => QuestStatus;
  getCompletedCount: (journeyId: string) => number;

  // Mutations — quest progress
  startJourney: (journeyId: string, questIds: string[]) => void;
  completeQuest: (journeyId: string, questId: string) => void;
  markQuestComplete: (journeyId: string, questId: string) => void;
  resetJourney: (journeyId: string) => void;

  // Mutations — audio
  setCurrentVerse: (key: string) => void;
  setPlaying: (playing: boolean) => void;
  setReciterId: (id: number) => void;
}

export const useQuestProgressStore = create<QuestProgressState>((set, get) => ({
  progress: {},

  // Audio defaults
  currentVerseKey: null,
  isPlaying: false,
  reciterId: 7,

  // --- Selectors ---

  getJourneyProgress: (journeyId) => get().progress[journeyId],

  getQuestStatus: (journeyId, questId) => {
    const journey = get().progress[journeyId];
    return journey?.quests[questId]?.status ?? 'locked';
  },

  getCompletedCount: (journeyId) => {
    const journey = get().progress[journeyId];
    if (!journey) return 0;
    return Object.values(journey.quests).filter((q) => q.status === 'completed').length;
  },

  // --- Quest progress mutations ---

  startJourney: (journeyId, questIds) => {
    const existingJourney = get().progress[journeyId];
    if (existingJourney) return; // Already started

    const quests: Record<string, QuestProgress> = {};
    questIds.forEach((id, index) => {
      quests[id] = {
        questId: id,
        status: index === 0 ? 'available' : 'locked',
      };
    });

    set((state) => ({
      progress: {
        ...state.progress,
        [journeyId]: {
          journeyId,
          startedAt: Date.now(),
          quests,
        },
      },
    }));
  },

  completeQuest: (journeyId, questId) => {
    set((state) => {
      const journey = state.progress[journeyId];
      if (!journey) return state;

      const questKeys = Object.keys(journey.quests);
      const currentIndex = questKeys.indexOf(questId);
      const nextQuestId = currentIndex >= 0 ? questKeys[currentIndex + 1] : undefined;

      const updatedQuests: Record<string, QuestProgress> = {
        ...journey.quests,
        [questId]: {
          ...journey.quests[questId]!,
          status: 'completed',
          completedAt: Date.now(),
        },
      };

      // Unlock the next quest
      if (nextQuestId && updatedQuests[nextQuestId]) {
        updatedQuests[nextQuestId] = {
          ...updatedQuests[nextQuestId]!,
          status: 'available',
        };
      }

      return {
        progress: {
          ...state.progress,
          [journeyId]: {
            ...journey,
            quests: updatedQuests,
          },
        },
      };
    });
  },

  /** Alias for completeQuest — used from the reader/reflection screens */
  markQuestComplete: (journeyId, questId) => {
    get().completeQuest(journeyId, questId);
  },

  resetJourney: (journeyId) => {
    set((state) => {
      const { [journeyId]: _removed, ...rest } = state.progress;
      return { progress: rest };
    });
  },

  // --- Audio mutations ---

  setCurrentVerse: (key) => set({ currentVerseKey: key }),

  setPlaying: (playing) => set({ isPlaying: playing }),

  setReciterId: (id) => set({ reciterId: id }),
}));
