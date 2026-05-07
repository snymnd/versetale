import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroDusk, OrnamentStar } from '@/components/brand';
import { JourneyCard } from '@/components/ui/JourneyCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { Eyebrow, Text } from '@/components/ui';
import { fontFamily, palette, radii, spacing, typography, useColors } from '@/lib/theme';
import { useAuthStore } from '@/features/auth/authStore';
import { useQuestProgressStore } from '@/features/journeys/journeyStore';
import { useJourneys, type JourneySummary } from '@/features/journeys/useJourneys';
import { useJourneyDetail } from '@/features/journeys/useJourneyDetail';

const PERIOD_LABELS: Record<string, string> = {
  morning: 'Morning · Fajr',
  midday: 'Midday · Ẓuhr',
  afternoon: 'Afternoon · ʿAṣr',
  dusk: 'Dusk · Maghrib',
  night: 'Night · ʿIshāʾ',
};

function periodForHour(h: number): keyof typeof PERIOD_LABELS {
  if (h < 6) return 'night';
  if (h < 12) return 'morning';
  if (h < 14) return 'midday';
  if (h < 17) return 'afternoon';
  if (h < 20) return 'dusk';
  return 'night';
}

function todayPeriodLabel(): string {
  const now = new Date();
  const weekday = now.toLocaleDateString(undefined, { weekday: 'long' });
  const fullLabel = PERIOD_LABELS[periodForHour(now.getHours())] ?? '';
  const period = fullLabel.split(' · ')[1] ?? '';
  return period ? `${weekday} · ${period}` : weekday;
}

/**
 * Library — the primary tab. A dusk-gradient greeting hero with an
 * optional "Today's quest" CTA, then the user's in-progress journeys.
 */
export default function JourneyLibraryScreen() {
  const { data: journeys, isLoading, isError } = useJourneys();
  const user = useAuthStore((s) => s.user);
  const progressMap = useQuestProgressStore((s) => s.progress);

  const handleJourneyPress = useCallback((id: string) => {
    router.push(`/(tabs)/journey/${id}`);
  }, []);

  // Pick the most recently started journey to drive the Today CTA card.
  const activeProgress = useMemo(() => {
    const list = Object.values(progressMap);
    if (list.length === 0) return null;
    return list.sort((a, b) => b.startedAt - a.startedAt)[0]!;
  }, [progressMap]);

  const renderItem = useCallback(
    ({ item }: { item: JourneySummary }) => {
      const progress = progressMap[item.id];
      const completed = progress
        ? Object.values(progress.quests).filter((q) => q.status === 'completed').length
        : 0;
      const ratio = progress ? completed / item.totalQuests : undefined;
      const status = progress
        ? `Day ${Math.min(completed + 1, item.totalQuests)} of ${item.totalQuests}`
        : `${item.totalQuests} day journey`;
      return (
        <JourneyCard
          journey={item}
          onPress={handleJourneyPress}
          progress={ratio}
          statusLine={status}
          reference={`Sūrah ${item.titleArabic}`}
        />
      );
    },
    [handleJourneyPress, progressMap],
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      );
    }
    if (isError) {
      return (
        <View style={styles.emptyState}>
          <Text variant="h4">Something went wrong</Text>
          <Text variant="caption" tone="muted" style={styles.emptyCaption}>
            We couldn't load your journeys. Pull to refresh.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyState}>
        <Text variant="h4">No journeys yet</Text>
        <Text variant="caption" tone="muted" style={styles.emptyCaption}>
          New journeys are on their way.
        </Text>
      </View>
    );
  }, [isLoading, isError]);

  const greeting = `Welcome back${user?.name ? `, ${user.name.split(' ')[0]}` : ''}.`;
  const journeyCount = journeys?.length ?? 0;

  return (
    <View style={styles.container}>
      <FlashList
        data={journeys ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View>
            <SafeAreaView edges={['top']}>
              <HeroDusk style={styles.hero}>
                <View style={styles.heroContent}>
                  <View style={styles.heroTopRow}>
                    <Eyebrow style={styles.heroEyebrow}>{todayPeriodLabel()}</Eyebrow>
                  </View>
                  <Text variant="h2" style={styles.heroTitle} color={palette.ink[0]}>
                    {greeting}
                  </Text>
                  <Text
                    variant="read"
                    style={styles.heroSubtitle}
                    color="rgba(236,239,242,0.78)"
                  >
                    {activeProgress
                      ? "Pick up where you left off — your story is waiting."
                      : "Choose a story to begin. Ten minutes a day, one narrative arc at a time."}
                  </Text>

                  {activeProgress ? (
                    <TodayCard journeyId={activeProgress.journeyId} />
                  ) : null}
                </View>
              </HeroDusk>
            </SafeAreaView>

            <View style={styles.sectionHead}>
              <Text variant="h3" style={styles.sectionTitle}>
                Your journeys
              </Text>
              {journeyCount > 0 ? (
                <Eyebrow>{journeyCount} active</Eyebrow>
              ) : null}
            </View>
          </View>
        }
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

interface TodayCardProps {
  journeyId: string;
}

/**
 * "Today's quest" CTA — glassy frosted card overlaid on the dusk hero.
 * Reads progress to compute the next available quest day and verse range.
 */
function TodayCard({ journeyId }: TodayCardProps) {
  const { data: journey } = useJourneyDetail(journeyId);
  const progress = useQuestProgressStore((s) => s.progress[journeyId]);

  const handleResume = useCallback(() => {
    if (!journey || !progress) return;
    const next = journey.quests.find((q) => progress.quests[q.id]?.status === 'available');
    if (next) router.push(`/(tabs)/reader/${journeyId}/${next.id}`);
    else router.push(`/(tabs)/journey/${journeyId}`);
  }, [journey, progress, journeyId]);

  if (!journey || !progress) return null;
  const nextQuest = journey.quests.find((q) => progress.quests[q.id]?.status === 'available');
  if (!nextQuest) return null;

  const verseRange =
    nextQuest.verseKeys.length > 0
      ? `${nextQuest.verseKeys[0]}–${nextQuest.verseKeys[nextQuest.verseKeys.length - 1]?.split(':')[1] ?? ''}`
      : '';

  return (
    <Pressable
      onPress={handleResume}
      accessibilityRole="button"
      accessibilityLabel={`Continue today's quest: ${nextQuest.title}`}
      style={styles.todayCard}
    >
      <View style={styles.todayOrnament}>
        <OrnamentStar size={32} color={palette.amber[300]} />
      </View>
      <View style={styles.todayBody}>
        <Eyebrow color="rgba(255,255,255,0.65)">Day {nextQuest.day} of {journey.totalQuests}</Eyebrow>
        <Text style={styles.todayTitle} color={palette.ink[0]}>
          {nextQuest.title}
        </Text>
        <Text variant="mono" style={styles.todayMeta} color="rgba(255,255,255,0.65)">
          {verseRange} · {nextQuest.verseKeys.length} verses
        </Text>
      </View>
      <View style={styles.todayArrow}>
        <ArrowRight color="#FFFFFF" size={18} strokeWidth={2} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.ink[950],
  },
  hero: {
    paddingBottom: spacing[8],
  },
  heroContent: {
    paddingHorizontal: 20,
    paddingTop: spacing[6],
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  heroEyebrow: {
    color: 'rgba(255,255,255,0.7)',
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
    marginBottom: spacing[2],
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
    marginBottom: spacing[5],
  },
  todayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderRadius: radii.xl - 4,
    padding: spacing[4],
  },
  todayOrnament: {
    width: 36,
    alignItems: 'center',
  },
  todayBody: {
    flex: 1,
    gap: 2,
  },
  todayTitle: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.36,
    marginTop: 2,
  },
  todayMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  todayArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: spacing[6],
    paddingBottom: spacing[3],
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.44,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyCaption: {
    textAlign: 'center',
  },
});
