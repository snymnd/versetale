import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@/lib/constants';
import { useJourneyDetail } from '@/features/journeys/useJourneyDetail';
import { useVersesByRange } from '@/features/reader/useVerses';
import { useQuestProgressStore } from '@/features/journeys/journeyStore';
import { BismillahHeader } from '@/components/reader/BismillahHeader';
import { VerseBlock } from '@/components/reader/VerseBlock';
import { TafsirBottomSheet } from '@/components/reader/TafsirBottomSheet';
import { MiniAudioPlayer } from '@/components/reader/MiniAudioPlayer';
import type { Verse } from '@/features/reader/types';

type ListItem =
  | { type: 'bismillah' }
  | { type: 'verse'; verse: Verse };

/**
 * Derives the surah number and min/max verse numbers from a list of verse keys.
 * Assumes all verse keys belong to the same surah (e.g. ["12:4","12:5","12:6"]).
 */
function parseVerseRange(verseKeys: string[]): { surah: number; from: number; to: number } | null {
  if (verseKeys.length === 0) return null;
  const parsed = verseKeys.map((key) => {
    const parts = key.split(':').map(Number);
    return { surah: parts[0] as number, verse: parts[1] as number };
  });
  const surah = parsed[0]!.surah;
  const verses = parsed.map((p) => p.verse);
  return { surah, from: Math.min(...verses), to: Math.max(...verses) };
}

/**
 * Reader screen — scrollable verse list for one quest day.
 * Shows BismillahHeader on day 1.
 * Highlights the currently playing verse.
 * Long-press on a verse opens TafsirBottomSheet.
 * MiniAudioPlayer is rendered here so it sits above the tab bar within the reader stack.
 */
export default function ReaderScreen() {
  const { journeyId, questId } = useLocalSearchParams<{ journeyId: string; questId: string }>();

  const { data: journey, isLoading: journeyLoading } = useJourneyDetail(journeyId);
  const quest = journey?.quests.find((q) => q.id === questId);

  const range = useMemo(
    () => parseVerseRange(quest?.verseKeys ?? []),
    [quest?.verseKeys],
  );

  const reciterId = useQuestProgressStore((s) => s.reciterId);
  const currentVerseKey = useQuestProgressStore((s) => s.currentVerseKey);
  const setCurrentVerse = useQuestProgressStore((s) => s.setCurrentVerse);
  const setPlaying = useQuestProgressStore((s) => s.setPlaying);
  const markQuestComplete = useQuestProgressStore((s) => s.markQuestComplete);

  const {
    data: verses,
    isLoading: versesLoading,
    isError,
  } = useVersesByRange(
    range?.surah ?? 0,
    range?.from ?? 0,
    range?.to ?? 0,
    reciterId,
  );

  // Tafsir sheet state
  const [tafsirVerseKey, setTafsirVerseKey] = useState<string | null>(null);
  const [tafsirArabic, setTafsirArabic] = useState<string>('');

  const handleVersePress = useCallback(
    (verse: Verse) => {
      setCurrentVerse(verse.verseKey);
    },
    [setCurrentVerse],
  );

  const handleVerseLongPress = useCallback((verse: Verse) => {
    setTafsirVerseKey(verse.verseKey);
    setTafsirArabic(verse.textUthmani);
  }, []);

  const handleBack = useCallback(() => {
    // Reset audio state before leaving so playback stops immediately.
    // Always replace to journey detail — reader/journey/index are all Tabs.Screen
    // entries so router.back() skips past journey detail to the tab root.
    setCurrentVerse(null);
    setPlaying(false);
    router.replace(`/(tabs)/journey/${journeyId}`);
  }, [journeyId, setCurrentVerse, setPlaying]);

  const handleQuestComplete = useCallback(() => {
    markQuestComplete(journeyId, questId);
    router.replace(`/reflection/${journeyId}/${questId}`);
  }, [journeyId, questId, markQuestComplete]);

  // Build the audio map for the MiniAudioPlayer
  const audioMap = useMemo<Record<string, string | null>>(() => {
    if (!verses) return {};
    const map: Record<string, string | null> = {};
    for (const v of verses) {
      map[v.verseKey] = v.audioUrl;
    }
    return map;
  }, [verses]);

  const verseKeys = useMemo(() => verses?.map((v) => v.verseKey) ?? [], [verses]);

  // Build flat list items (inject bismillah header before first verse on day 1)
  const listItems: ListItem[] = useMemo(() => {
    const items: ListItem[] = [];
    if (quest?.day === 1) items.push({ type: 'bismillah' });
    for (const v of verses ?? []) {
      items.push({ type: 'verse', verse: v });
    }
    return items;
  }, [verses, quest?.day]);

  const totalQuests = journey?.quests.length ?? 0;
  const questDay = quest?.day ?? 1;

  const isLoading = journeyLoading || versesLoading;

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'bismillah') return <BismillahHeader />;
      return (
        <Pressable
          onLongPress={() => handleVerseLongPress(item.verse)}
          delayLongPress={500}
        >
          <VerseBlock
            verse={item.verse}
            isPlaying={currentVerseKey === item.verse.verseKey}
            onPress={() => handleVersePress(item.verse)}
          />
        </Pressable>
      );
    },
    [currentVerseKey, handleVersePress, handleVerseLongPress],
  );

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => handleBack()}
            style={styles.backBtn}
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>{'←'}</Text>
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{quest?.title ?? '—'}</Text>
            <Text style={styles.headerSubtitle}>
              Day {questDay} of {totalQuests}
            </Text>
          </View>
          <Pressable
            onPress={handleQuestComplete}
            style={styles.completeBtn}
            accessibilityLabel="Complete quest"
          >
            <Text style={styles.completeBtnText}>Done</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={COLORS.ACCENT} />
            <Text style={styles.loadingText}>Loading verses…</Text>
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Text style={styles.emptyIcon}>⚠️</Text>
            <Text style={styles.emptyTitle}>Couldn't load verses</Text>
            <Text style={styles.errorText}>Check your connection and try again.</Text>
            <Pressable onPress={() => handleBack()} style={styles.backLink}>
              <Text style={styles.backLinkText}>← Back to journey</Text>
            </Pressable>
          </View>
        ) : listItems.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyIcon}>📜</Text>
            <Text style={styles.emptyTitle}>No verses assigned</Text>
            <Text style={styles.errorText}>
              This quest doesn't have any verses yet. Check back soon.
            </Text>
            <Pressable onPress={() => handleBack()} style={styles.backLink}>
              <Text style={styles.backLinkText}>← Back to journey</Text>
            </Pressable>
          </View>
        ) : (
          <FlashList
            data={listItems}
            keyExtractor={(item, index) =>
              item.type === 'bismillah' ? 'bismillah' : item.verse.verseKey + index
            }
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </SafeAreaView>

      {/* Floating audio player — sits above bottom tab bar */}
      {verseKeys.length > 0 && (
        <MiniAudioPlayer
          verseKeys={verseKeys}
          audioMap={audioMap}
          reciterName="Mishary Rashid"
          onComplete={handleQuestComplete}
        />
      )}

      {/* Tafsir bottom sheet */}
      <TafsirBottomSheet
        verseKey={tafsirVerseKey}
        arabicText={tafsirArabic}
        onClose={() => setTafsirVerseKey(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.BG_DEEP,
  },
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 8,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  backLink: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
  },
  backLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.ACCENT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.CARD_BORDER,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 18,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  completeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(20,184,166,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(20,184,166,0.35)',
    borderRadius: 20,
  },
  completeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.ACCENT,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 120,
  },
});
