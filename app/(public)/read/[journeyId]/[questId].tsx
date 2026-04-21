import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BismillahHeader } from '@/components/reader/BismillahHeader';
import { MiniAudioPlayer } from '@/components/reader/MiniAudioPlayer';
import { TafsirBottomSheet } from '@/components/reader/TafsirBottomSheet';
import { VerseBlock } from '@/components/reader/VerseBlock';
import { SoftLoginBanner } from '@/components/ui/SoftLoginBanner';
import { COLORS } from '@/lib/constants';
import { useJourneyDetail } from '@/features/journeys/useJourneyDetail';
import { useQuestProgressStore } from '@/features/journeys/journeyStore';
import { useVersesByRange } from '@/features/reader/useVerses';
import type { Verse } from '@/features/reader/types';

type ListItem = { type: 'bismillah' } | { type: 'verse'; verse: Verse };

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
 * Public reader screen — full verse experience with audio.
 * No progress saving, no reflection prompt.
 * SoftLoginBanner is pinned above the audio player.
 */
export default function PublicReaderScreen() {
  const { journeyId, questId } = useLocalSearchParams<{ journeyId: string; questId: string }>();

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
    (verse: Verse) => {
      setCurrentVerse(verse.verseKey);
    },
    [setCurrentVerse],
  );

  const handleVerseLongPress = useCallback((verse: Verse) => {
    setTafsirVerseKey(verse.verseKey);
    setTafsirArabic(verse.textUthmani);
  }, []);

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
    <View style={styles.root}>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
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
          {/* Spacer to balance the back button */}
          <View style={styles.headerSpacer} />
        </View>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={COLORS.ACCENT} />
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Could not load verses.</Text>
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

      {/* Bottom bar — banner stacked above audio player */}
      <View style={styles.bottomBar}>
        <SoftLoginBanner />
        {verseKeys.length > 0 && (
          <MiniAudioPlayer
            verseKeys={verseKeys}
            audioMap={audioMap}
            reciterName="Mishary Rashid"
            containerStyle={styles.playerContained}
          />
        )}
      </View>

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
  },
  errorText: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
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
  headerSpacer: {
    width: 36,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
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
