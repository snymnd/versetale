import { useQuery } from '@tanstack/react-query';

import { STALE_TIMES } from '@/lib/constants';

export interface Quest {
  id: string;
  day: number;
  title: string;
  titleArabic: string;
  narrative: string;
  verseKeys: string[]; // ["12:4","12:5","12:6"]
  reflection: string;
  completionPrompt: string;
}

export interface JourneyDetail {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  coverGradient: [string, string];
  totalQuests: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  quests: Quest[];
}

// Statically known journey IDs — extend as new journeys are added
const JOURNEY_LOADERS: Record<string, () => JourneyDetail> = {
  'yusuf-resilience': () =>
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../../../content/journeys/yusuf-resilience.json') as JourneyDetail,
};

function fetchJourneyDetail(journeyId: string): JourneyDetail {
  const loader = JOURNEY_LOADERS[journeyId];
  if (!loader) throw new Error(`Unknown journey: ${journeyId}`);
  return loader();
}

export function useJourneyDetail(journeyId: string) {
  return useQuery({
    queryKey: ['journey-detail', journeyId],
    queryFn: () => fetchJourneyDetail(journeyId),
    staleTime: STALE_TIMES.VERSE_CONTENT,
    enabled: Boolean(journeyId),
  });
}
