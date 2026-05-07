import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react-native';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroDusk, OrnamentStar } from '@/components/brand';
import { Eyebrow, Text } from '@/components/ui';
import { fontFamily, palette, radii, spacing, typography, useColors } from '@/lib/theme';
import { useJourneyDetail, type Quest } from '@/features/journeys/useJourneyDetail';
import { useQuestProgressStore } from '@/features/journeys/journeyStore';

type QuestItemData = Quest & { status: 'locked' | 'available' | 'completed' };

/**
 * Journey detail — gradient hero with the journey's signature wash + the
 * Arabic title set in Amiri, the English title and supporting copy in
 * Fraunces, then a stack of quest rows. Locked quests are dimmed with a
 * lock icon; completed quests get a teal check.
 */
export default function JourneyDetailScreen() {
  const { journeyId } = useLocalSearchParams<{ journeyId: string }>();
  const { data: journey, isLoading, isError } = useJourneyDetail(journeyId);
  const { colors } = useColors();

  const journeyProgress = useQuestProgressStore((s) => s.progress[journeyId]);
  const startJourney = useQuestProgressStore((s) => s.startJourney);

  // Idempotent — start the journey (unlocks day 1) when the detail loads.
  useEffect(() => {
    if (journey) {
      startJourney(
        journeyId,
        journey.quests.map((q) => q.id),
      );
    }
  }, [journey, journeyId, startJourney]);

  const handleQuestPress = useCallback(
    (quest: QuestItemData) => {
      if (quest.status === 'locked') return;
      router.push(`/(tabs)/reader/${journeyId}/${quest.id}`);
    },
    [journeyId],
  );

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <ActivityIndicator color={colors.brand} />
      </SafeAreaView>
    );
  }

  if (isError || !journey) {
    return (
      <SafeAreaView
        style={[styles.loadingContainer, { backgroundColor: colors.bg }]}
        edges={['top']}
      >
        <Text variant="h3">Journey not found</Text>
        <Text variant="caption" tone="muted" style={styles.errorText}>
          This journey couldn't be loaded.
        </Text>
        <Pressable onPress={handleBack} style={[styles.backLink, { borderColor: colors.border }]}>
          <Text variant="meta" tone="brand">
            ← Back to library
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const questsWithStatus: QuestItemData[] = journey.quests.map((q) => ({
    ...q,
    status: journeyProgress?.quests[q.id]?.status ?? 'locked',
  }));
  const completedCount = questsWithStatus.filter((q) => q.status === 'completed').length;

  const renderItem = ({ item }: { item: QuestItemData }) => (
    <QuestRow quest={item} onPress={handleQuestPress} totalQuests={journey.totalQuests} />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <FlashList
        data={questsWithStatus}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <JourneyHero
            title={journey.title}
            titleArabic={journey.titleArabic}
            description={journey.description}
            gradient={journey.coverGradient}
            completedCount={completedCount}
            totalQuests={journey.totalQuests}
            onBack={handleBack}
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

interface JourneyHeroProps {
  title: string;
  titleArabic: string;
  description: string;
  gradient: [string, string];
  completedCount: number;
  totalQuests: number;
  onBack: () => void;
}

function JourneyHero({
  title,
  titleArabic,
  description,
  completedCount,
  totalQuests,
  onBack,
}: JourneyHeroProps) {
  const { colors } = useColors();
  return (
    <View style={styles.hero}>
      <SafeAreaView edges={['top']}>
        <HeroDusk style={styles.heroSurface}>
          <Pressable
            onPress={onBack}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={10}
          >
            <ChevronLeft color="#FFFFFF" size={20} strokeWidth={1.75} />
          </Pressable>

          <View style={styles.heroOrnament}>
            <OrnamentStar size={32} color={palette.amber[300]} />
          </View>

          <View style={styles.heroBodyRow}>
            <Text
              style={styles.heroArabic}
              accessibilityLanguage="ar"
              color="rgba(255,255,255,0.94)"
            >
              {titleArabic}
            </Text>
          </View>
        </HeroDusk>
      </SafeAreaView>

      <View style={[styles.heroFoot, { backgroundColor: colors.bg }]}>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text variant="read" tone="muted" style={styles.heroDescription}>
          {description}
        </Text>

        <View style={styles.progressRow}>
          <View style={[styles.progressTrack, { backgroundColor: colors.bgMuted }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${totalQuests > 0 ? (completedCount / totalQuests) * 100 : 0}%`,
                  backgroundColor: colors.brand,
                },
              ]}
            />
          </View>
          <Text variant="mono" tone="brand" style={styles.progressLabel}>
            {completedCount}/{totalQuests} days
          </Text>
        </View>

        <Eyebrow style={styles.sectionLabel}>Your Journey</Eyebrow>
      </View>
    </View>
  );
}

interface QuestRowProps {
  quest: QuestItemData;
  totalQuests: number;
  onPress: (quest: QuestItemData) => void;
}

function QuestRow({ quest, totalQuests, onPress }: QuestRowProps) {
  const { colors, shadow } = useColors();
  const isLocked = quest.status === 'locked';
  const isCompleted = quest.status === 'completed';

  return (
    <Pressable
      onPress={() => onPress(quest)}
      disabled={isLocked}
      accessibilityRole="button"
      accessibilityLabel={`Day ${quest.day} of ${totalQuests}: ${quest.title}${
        isLocked ? ', locked' : ''
      }`}
      style={({ pressed }) => [
        styles.questRow,
        shadow.sm,
        {
          backgroundColor: colors.bgRaised,
          opacity: isLocked ? 0.55 : 1,
          transform: pressed && !isLocked ? [{ scale: 0.98 }] : undefined,
        },
      ]}
    >
      <View
        style={[
          styles.dayCircle,
          isCompleted
            ? { backgroundColor: 'rgba(20,184,166,0.18)', borderColor: colors.brand }
            : isLocked
              ? { backgroundColor: colors.bgMuted, borderColor: colors.border }
              : { backgroundColor: 'rgba(31,122,132,0.16)', borderColor: 'rgba(31,122,132,0.4)' },
        ]}
      >
        {isCompleted ? (
          <Text style={[styles.checkmark, { color: colors.brand }]}>✓</Text>
        ) : (
          <Text
            variant="meta"
            style={[styles.dayNumber, { color: isLocked ? colors.fgSubtle : colors.brandFg }]}
          >
            {quest.day}
          </Text>
        )}
      </View>

      <View style={styles.questInfo}>
        <Text variant="mono" tone="subtle" style={styles.questRef}>
          Day {quest.day} of {totalQuests}
        </Text>
        <Text style={styles.questTitle} numberOfLines={1}>
          {quest.title}
        </Text>
      </View>

      {isLocked ? (
        <Lock size={14} color={colors.fgSubtle} strokeWidth={1.75} />
      ) : (
        <ChevronRight size={18} color={colors.fgMuted} strokeWidth={1.75} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  errorText: { textAlign: 'center', marginTop: 4 },
  backLink: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  listContent: { paddingBottom: 120 },

  // Hero
  hero: { marginBottom: spacing[2] },
  heroSurface: {
    paddingBottom: spacing[8],
    paddingHorizontal: 20,
    paddingTop: spacing[2],
    minHeight: 240,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOrnament: {
    alignSelf: 'center',
    marginVertical: spacing[6],
  },
  heroBodyRow: {},
  heroArabic: {
    fontFamily: 'AmiriQuran',
    fontSize: 32,
    textAlign: 'right',
    writingDirection: 'rtl',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroFoot: {
    paddingHorizontal: 20,
    paddingTop: spacing[5],
    gap: spacing[2],
  },
  heroTitle: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.56,
    color: palette.ink[25],
  },
  heroDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: spacing[2],
  },
  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  progressLabel: { fontSize: 11 },
  sectionLabel: { marginTop: spacing[5], marginBottom: spacing[2] },

  // Quest rows
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 20,
    marginVertical: 6,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radii.lg,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    ...typography.meta,
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 14,
  },
  checkmark: {
    fontSize: 16,
    fontFamily: fontFamily.sansBold,
  },
  questInfo: { flex: 1, minWidth: 0, gap: 2 },
  questRef: { fontSize: 10 },
  questTitle: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: -0.34,
    color: palette.ink[25],
  },
});
