import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroDusk, OrnamentStar } from '@/components/brand';
import { Eyebrow, Text } from '@/components/ui';
import { SoftLoginBanner } from '@/components/ui/SoftLoginBanner';
import { fontFamily, palette, radii, spacing, useColors } from '@/lib/theme';
import { useJourneyDetail, type Quest } from '@/features/journeys/useJourneyDetail';

/**
 * Public journey detail — same hero treatment as the authenticated screen,
 * but no progress lock; every quest is tappable.
 */
export default function PublicJourneyDetailScreen() {
  const { journeyId } = useLocalSearchParams<{ journeyId: string }>();
  const { data: journey, isLoading, isError } = useJourneyDetail(journeyId);
  const { colors } = useColors();

  const handleQuestPress = useCallback(
    (questId: string) => {
      router.push(`/(public)/read/${journeyId}/${questId}`);
    },
    [journeyId],
  );

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(public)/journeys');
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.bg }]}>
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  if (isError || !journey) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.bg }]}>
        <Text variant="caption" tone="muted">
          Could not load journey.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Quest }) => (
    <QuestRow quest={item} onPress={handleQuestPress} totalQuests={journey.totalQuests} />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <SoftLoginBanner />

      <FlashList
        data={journey.quests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <JourneyHero
            title={journey.title}
            titleArabic={journey.titleArabic}
            description={journey.description}
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
  totalQuests: number;
  onBack: () => void;
}

function JourneyHero({ title, titleArabic, description, totalQuests, onBack }: JourneyHeroProps) {
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
          <Text style={styles.heroArabic} accessibilityLanguage="ar" color="rgba(255,255,255,0.94)">
            {titleArabic}
          </Text>
        </HeroDusk>
      </SafeAreaView>
      <View style={[styles.heroFoot, { backgroundColor: colors.bg }]}>
        <Text style={[styles.heroTitle, { color: colors.fg }]}>{title}</Text>
        <Text variant="read" tone="muted" style={styles.heroDescription}>
          {description}
        </Text>
        <Eyebrow style={styles.sectionLabel}>{totalQuests}-day journey</Eyebrow>
      </View>
    </View>
  );
}

interface QuestRowProps {
  quest: Quest;
  totalQuests: number;
  onPress: (questId: string) => void;
}

function QuestRow({ quest, totalQuests, onPress }: QuestRowProps) {
  const { colors, shadow } = useColors();
  return (
    <Pressable
      onPress={() => onPress(quest.id)}
      accessibilityRole="button"
      accessibilityLabel={`Day ${quest.day} of ${totalQuests}: ${quest.title}`}
      style={({ pressed }) => [
        styles.questRow,
        shadow.sm,
        {
          backgroundColor: colors.bgRaised,
          transform: pressed ? [{ scale: 0.98 }] : [],
        },
      ]}
    >
      <View
        style={[
          styles.dayCircle,
          { backgroundColor: 'rgba(31,122,132,0.16)', borderColor: 'rgba(31,122,132,0.4)' },
        ]}
      >
        <Text style={[styles.dayNumber, { color: colors.brandFg }]}>{quest.day}</Text>
      </View>
      <View style={styles.questInfo}>
        <Text variant="mono" tone="subtle" style={styles.questRef}>
          Day {quest.day} of {totalQuests}
        </Text>
        <Text style={[styles.questTitle, { color: colors.fg }]} numberOfLines={1}>
          {quest.title}
        </Text>
      </View>
      <ChevronRight size={18} color={colors.fgMuted} strokeWidth={1.75} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: { paddingBottom: 60 },

  // Hero
  hero: { marginBottom: spacing[2] },
  heroSurface: {
    paddingBottom: spacing[8],
    paddingHorizontal: 20,
    paddingTop: spacing[2],
    minHeight: 220,
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
  },
  heroDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionLabel: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },

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
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 14,
  },
  questInfo: { flex: 1, minWidth: 0, gap: 2 },
  questRef: { fontSize: 10 },
  questTitle: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: -0.34,
  },
});
