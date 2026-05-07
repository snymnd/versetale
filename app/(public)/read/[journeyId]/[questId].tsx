import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BismillahHeader } from '@/components/reader/BismillahHeader';
import { MiniAudioPlayer } from '@/components/reader/MiniAudioPlayer';
import { TafsirBottomSheet } from '@/components/reader/TafsirBottomSheet';
import { VerseBlock } from '@/components/reader/VerseBlock';
import { Eyebrow, Text } from '@/components/ui';
import { SoftLoginBanner } from '@/components/ui/SoftLoginBanner';
import { fontFamily, spacing, useColors } from '@/lib/theme';
import { useJourneyDetail } from '@/features/journeys/useJourneyDetail';
import { useQuestProgressStore } from '@/features/journeys/journeyStore';
import { useVersesByRange } from '@/features/reader/useVerses';
import type { Verse } from '@/features/reader/types';

type ListItem = { type: 'bismillah' } | { type: 'verse'; verse: Verse };

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
 * Public reader screen — full verse experience with audio. No progress
 * saving, no reflection prompt. SoftLoginBanner sits above the player.
 */
export default function PublicReaderScreen() {
  const { journeyId, questId } = useLocalSearchParams<{ journeyId: string; questId: string }>();
  const { colors } = useColors();

  const { data: journey, isLoading: journeyLoading } = useJourneyDetail(journeyId);
  const quest = journey?.quests.find((q) => q.id === questId);

  const range = useMemo(() => parseVerseRange(quest?.verseKeys ?? []), [quest?.verseKeys]);

  const reciterId = useQuestProgressStore((s) => s.reciterId);
  const currentVerseKey = useQuestProgressStore((s) => s.currentVerseKey);
  const setCurrentVerse = useQuestProgressStore((s) => s.setCurrentVerse);

  const {
    data: verses,
    isLoading: versesLoading,
    isError,
  } = useVersesByRange(range?.surah ?? 0, range?.from ?? 0, range?.to ?? 0, reciterId);

  const [tafsirVerseKey, setTafsirVerseKey] = useState<string | null>(null);
  const [tafsirArabic, setTafsirArabic] = useState<string>('');

  const handleVersePress = useCallback(
    (verse: Verse) => setCurrentVerse(verse.verseKey),
    [setCurrentVerse],
  );

  const handleVerseLongPress = useCallback((verse: Verse) => {
    setTafsirVerseKey(verse.verseKey);
    setTafsirArabic(verse.textUthmani);
  }, []);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace(`/(public)/journey/${journeyId}`);
  }, [journeyId]);

  const audioMap = useMemo<Record<string, string | null>>(() => {
    if (!verses) return {};
    const map: Record<string, string | null> = {};
    for (const v of verses) {
      map[v.verseKey] = v.audioUrl;
    }
    return map;
  }, [verses]);

  const verseKeys = useMemo(() => verses?.map((v) => v.verseKey) ?? [], [verses]);

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
        <Pressable onLongPress={() => handleVerseLongPress(item.verse)} delayLongPress={500}>
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
          <View style={styles.iconBtn} />
        </View>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.brand} />
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Text variant="caption" tone="muted">
              Could not load verses.
            </Text>
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

      <View style={styles.bottomBar}>
        <SoftLoginBanner />
        {verseKeys.length > 0 ? (
          <MiniAudioPlayer
            verseKeys={verseKeys}
            audioMap={audioMap}
            reciterName="Mishary Rāshid al-ʿAfāsy"
            containerStyle={styles.playerContained}
          />
        ) : null}
      </View>

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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  listContent: {
    paddingTop: spacing[3],
    paddingBottom: 180,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  playerContained: {
    position: 'relative',
    bottom: 'auto' as unknown as number,
    paddingBottom: 12,
  },
});
