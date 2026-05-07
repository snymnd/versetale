import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { Bookmark, ChevronLeft } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Eyebrow, Text } from '@/components/ui';
import { BismillahHeader } from '@/components/reader/BismillahHeader';
import { MiniAudioPlayer } from '@/components/reader/MiniAudioPlayer';
import { TafsirBottomSheet } from '@/components/reader/TafsirBottomSheet';
import { VerseBlock } from '@/components/reader/VerseBlock';
import { fontFamily, spacing, useColors } from '@/lib/theme';
import { useJourneyDetail } from '@/features/journeys/useJourneyDetail';
import { useQuestProgressStore } from '@/features/journeys/journeyStore';
import { useVersesByRange } from '@/features/reader/useVerses';
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
 * Reader — verse-by-verse view for one quest day. Sticky header sits over
 * the page with a hairline progress bar; long-press on a verse opens the
 * Tafsir sheet; the floating MiniAudioPlayer hovers above the tab bar.
 */
export default function ReaderScreen() {
  const { journeyId, questId } = useLocalSearchParams<{ journeyId: string; questId: string }>();
  const { colors } = useColors();

  const { data: journey, isLoading: journeyLoading } = useJourneyDetail(journeyId);
  const quest = journey?.quests.find((q) => q.id === questId);

  const range = useMemo(() => parseVerseRange(quest?.verseKeys ?? []), [quest?.verseKeys]);

  const reciterId = useQuestProgressStore((s) => s.reciterId);
  const currentVerseKey = useQuestProgressStore((s) => s.currentVerseKey);
  const setCurrentVerse = useQuestProgressStore((s) => s.setCurrentVerse);
  const setPlaying = useQuestProgressStore((s) => s.setPlaying);
  const markQuestComplete = useQuestProgressStore((s) => s.markQuestComplete);

  const {
    data: verses,
    isLoading: versesLoading,
    isError,
  } = useVersesByRange(range?.surah ?? 0, range?.from ?? 0, range?.to ?? 0, reciterId);

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
  const progressFraction = totalQuests > 0 ? questDay / totalQuests : 0;
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
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View
          style={[
            styles.header,
            { backgroundColor: colors.bg, borderBottomColor: colors.border },
          ]}
        >
          <Pressable
            onPress={handleBack}
            style={[styles.iconBtn, { backgroundColor: colors.bgSunken }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
          >
            <ChevronLeft color={colors.fgMuted} size={20} strokeWidth={1.75} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Eyebrow>
              Day {questDay} of {totalQuests}
            </Eyebrow>
            <Text style={[styles.headerTitle, { color: colors.fg }]} numberOfLines={1}>
              {quest?.title ?? '—'}
            </Text>
          </View>
          <Pressable
            style={[styles.iconBtn, { backgroundColor: colors.bgSunken }]}
            accessibilityRole="button"
            accessibilityLabel="Bookmark this quest"
            hitSlop={8}
          >
            <Bookmark color={colors.fgMuted} size={18} strokeWidth={1.75} />
          </Pressable>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.bgMuted }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressFraction * 100}%`, backgroundColor: colors.brand },
            ]}
          />
        </View>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.brand} />
            <Text variant="caption" tone="muted" style={styles.loadingText}>
              Loading verses…
            </Text>
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Text variant="h4">Couldn't load verses</Text>
            <Text variant="caption" tone="muted" style={styles.errorCaption}>
              Check your connection and try again.
            </Text>
            <Button variant="ghost" onPress={handleBack} style={styles.errorAction}>
              ← Back to journey
            </Button>
          </View>
        ) : listItems.length === 0 ? (
          <View style={styles.centered}>
            <Text variant="h4">No verses assigned</Text>
            <Text variant="caption" tone="muted" style={styles.errorCaption}>
              This quest doesn't have any verses yet. Check back soon.
            </Text>
            <Button variant="ghost" onPress={handleBack} style={styles.errorAction}>
              ← Back to journey
            </Button>
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
            ListFooterComponent={
              <View style={styles.completeRow}>
                <Button variant="primary" size="lg" fullWidth onPress={handleQuestComplete}>
                  Continue to reflection
                </Button>
              </View>
            }
          />
        )}
      </SafeAreaView>

      {/* Floating audio player — sits above bottom tab bar */}
      {verseKeys.length > 0 && (
        <MiniAudioPlayer
          verseKeys={verseKeys}
          audioMap={audioMap}
          reciterName="Mishary Rāshid al-ʿAfāsy"
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
  root: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: spacing[3],
    gap: 12,
    borderBottomWidth: 1,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  headerTitle: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.32,
  },
  progressTrack: {
    height: 3,
    marginHorizontal: 20,
    marginBottom: spacing[2],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%' },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 32,
  },
  loadingText: { marginTop: 8 },
  errorCaption: { textAlign: 'center' },
  errorAction: { marginTop: 8 },
  listContent: {
    paddingTop: spacing[3],
    paddingBottom: 180,
  },
  completeRow: {
    paddingHorizontal: 20,
    paddingTop: spacing[5],
    alignItems: 'stretch',
  },
});
