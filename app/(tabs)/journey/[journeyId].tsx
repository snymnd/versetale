import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@/lib/constants';
import { useJourneyDetail, type Quest } from '@/features/journeys/useJourneyDetail';
import { useQuestProgressStore } from '@/features/journeys/journeyStore';

type QuestItemData = Quest & { status: 'locked' | 'available' | 'completed' };

/**
 * Journey detail screen — hero cover + scrollable quest list.
 * Locked quests are visually dimmed with a lock indicator.
 * Completed quests show a teal checkmark.
 * Tapping an available quest navigates to the reader.
 */
export default function JourneyDetailScreen() {
  const { journeyId } = useLocalSearchParams<{ journeyId: string }>();
  const { data: journey, isLoading, isError } = useJourneyDetail(journeyId);

  const journeyProgress = useQuestProgressStore((s) => s.progress[journeyId]);
  const startJourney = useQuestProgressStore((s) => s.startJourney);

  // Start the journey (unlocks day 1) as soon as the detail loads — idempotent if already started
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <ActivityIndicator color={COLORS.ACCENT} />
      </SafeAreaView>
    );
  }

  if (isError || !journey) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <Text style={styles.emptyIcon}>📖</Text>
        <Text style={styles.errorTitle}>Journey not found</Text>
        <Text style={styles.errorText}>This journey couldn't be loaded.</Text>
        <Pressable
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace('/(tabs)');
          }}
          style={styles.backLink}
        >
          <Text style={styles.backLinkText}>← Back to library</Text>
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
    <QuestRow quest={item} onPress={handleQuestPress} />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

// --- Sub-components ---

interface JourneyHeroProps {
  title: string;
  titleArabic: string;
  description: string;
  gradient: [string, string];
  completedCount: number;
  totalQuests: number;
}

function JourneyHero({
  title,
  titleArabic,
  description,
  gradient,
  completedCount,
  totalQuests,
}: JourneyHeroProps) {
  return (
    <View style={styles.heroContainer}>
      {/* Back button */}
      <Pressable
        onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/(tabs)');
        }}
        style={styles.backBtn}
        accessibilityLabel="Go back"
      >
        <Text style={styles.backIcon}>{'←'}</Text>
      </Pressable>

      {/* Full-width gradient cover */}
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCover}>
        <View style={styles.heroGrainOverlay} />
        <Text style={styles.heroArabic} accessibilityLanguage="ar">
          {titleArabic}
        </Text>
      </LinearGradient>

      {/* Title block below gradient */}
      <View style={styles.heroBody}>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroDescription}>{description}</Text>

        {/* Progress bar */}
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${totalQuests > 0 ? (completedCount / totalQuests) * 100 : 0}%` },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {completedCount}/{totalQuests} days
          </Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Your Journey</Text>
    </View>
  );
}

interface QuestRowProps {
  quest: QuestItemData;
  onPress: (quest: QuestItemData) => void;
}

function QuestRow({ quest, onPress }: QuestRowProps) {
  const isLocked = quest.status === 'locked';
  const isCompleted = quest.status === 'completed';

  return (
    <Pressable
      onPress={() => onPress(quest)}
      disabled={isLocked}
      accessibilityRole="button"
      accessibilityLabel={`Day ${quest.day}: ${quest.title}${isLocked ? ', locked' : ''}`}
      style={({ pressed }) => [styles.questRow, pressed && !isLocked && styles.questRowPressed]}
    >
      {/* Day number circle */}
      <View style={[styles.dayCircle, isCompleted && styles.dayCircleCompleted, isLocked && styles.dayCircleLocked]}>
        {isCompleted ? (
          <Text style={styles.checkmark}>✓</Text>
        ) : (
          <Text style={[styles.dayNumber, isLocked && styles.dayNumberLocked]}>{quest.day}</Text>
        )}
      </View>

      {/* Quest info */}
      <View style={styles.questInfo}>
        <Text style={[styles.questTitle, isLocked && styles.questTitleLocked]} numberOfLines={1}>
          {quest.title}
        </Text>
        <Text style={[styles.questArabic, isLocked && styles.questArabicLocked]} numberOfLines={1}>
          {quest.titleArabic}
        </Text>
      </View>

      {/* Right indicator */}
      <Text style={[styles.chevron, isLocked && styles.chevronLocked]}>
        {isLocked ? '🔒' : '›'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DEEP,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.BG_DEEP,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
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
  listContent: {
    paddingBottom: 40,
  },

  // Hero
  heroContainer: {
    marginBottom: 8,
  },
  backBtn: {
    position: 'absolute',
    top: 12,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 20,
  },
  heroCover: {
    height: 220,
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroGrainOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  heroArabic: {
    fontFamily: 'AmiriQuran',
    fontSize: 32,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'right',
    writingDirection: 'rtl',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.6,
  },
  heroDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.ACCENT,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.ACCENT,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.TEXT_TERTIARY,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },

  // Quest rows
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
  },
  questRowPressed: {
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20,184,166,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(20,184,166,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleCompleted: {
    backgroundColor: 'rgba(20,184,166,0.25)',
    borderColor: COLORS.ACCENT,
  },
  dayCircleLocked: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.ACCENT,
  },
  dayNumberLocked: {
    color: COLORS.TEXT_TERTIARY,
  },
  checkmark: {
    fontSize: 16,
    color: COLORS.ACCENT,
    fontWeight: '700',
  },
  questInfo: {
    flex: 1,
    gap: 2,
  },
  questTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.2,
  },
  questTitleLocked: {
    color: COLORS.TEXT_TERTIARY,
  },
  questArabic: {
    fontFamily: 'AmiriQuran',
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  questArabicLocked: {
    color: 'rgba(148,163,184,0.4)',
  },
  chevron: {
    fontSize: 22,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '300',
  },
  chevronLocked: {
    fontSize: 14,
  },
});
