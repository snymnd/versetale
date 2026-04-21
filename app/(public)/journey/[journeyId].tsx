import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { SoftLoginBanner } from '@/components/ui/SoftLoginBanner';
import { COLORS } from '@/lib/constants';
import { useJourneyDetail, type Quest } from '@/features/journeys/useJourneyDetail';

/**
 * Public journey detail screen — hero cover + scrollable quest list.
 * No auth guard, no progress tracking.
 * All quests are available to tap (no locked state for public visitors).
 */
export default function PublicJourneyDetailScreen() {
  const { journeyId } = useLocalSearchParams<{ journeyId: string }>();
  const { data: journey, isLoading, isError } = useJourneyDetail(journeyId);

  const handleQuestPress = useCallback(
    (questId: string) => {
      router.push(`/(public)/read/${journeyId}/${questId}`);
    },
    [journeyId],
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.ACCENT} />
      </View>
    );
  }

  if (isError || !journey) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Could not load journey.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Quest }) => (
    <QuestRow quest={item} onPress={handleQuestPress} />
  );

  return (
    <View style={styles.container}>
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
            gradient={journey.coverGradient}
            totalQuests={journey.totalQuests}
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// --- Sub-components ---

interface JourneyHeroProps {
  title: string;
  titleArabic: string;
  description: string;
  gradient: [string, string];
  totalQuests: number;
}

function JourneyHero({ title, titleArabic, description, gradient, totalQuests }: JourneyHeroProps) {
  return (
    <View style={styles.heroContainer}>
      <Pressable
        onPress={() => router.back()}
        style={styles.backBtn}
        accessibilityLabel="Go back"
      >
        <Text style={styles.backIcon}>{'←'}</Text>
      </Pressable>

      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCover}
      >
        <View style={styles.heroGrainOverlay} />
        <Text style={styles.heroArabic} accessibilityLanguage="ar">
          {titleArabic}
        </Text>
      </LinearGradient>

      <View style={styles.heroBody}>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroDescription}>{description}</Text>
        <View style={styles.questCountRow}>
          <View style={styles.questCountBadge}>
            <Text style={styles.questCountText}>{totalQuests} quests</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Quests</Text>
    </View>
  );
}

interface QuestRowProps {
  quest: Quest;
  onPress: (questId: string) => void;
}

function QuestRow({ quest, onPress }: QuestRowProps) {
  return (
    <Pressable
      onPress={() => onPress(quest.id)}
      accessibilityRole="button"
      accessibilityLabel={`Day ${quest.day}: ${quest.title}`}
      style={({ pressed }) => [styles.questRow, pressed && styles.questRowPressed]}
    >
      <View style={styles.dayCircle}>
        <Text style={styles.dayNumber}>{quest.day}</Text>
      </View>

      <View style={styles.questInfo}>
        <Text style={styles.questTitle} numberOfLines={1}>
          {quest.title}
        </Text>
        <Text style={styles.questArabic} numberOfLines={1}>
          {quest.titleArabic}
        </Text>
      </View>

      <Text style={styles.chevron}>{'›'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DEEP,
  },
  centered: {
    flex: 1,
    backgroundColor: COLORS.BG_DEEP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 15,
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
  questCountRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  questCountBadge: {
    backgroundColor: 'rgba(20,184,166,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(20,184,166,0.35)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  questCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.ACCENT,
    letterSpacing: 0.2,
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
  dayNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.ACCENT,
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
  questArabic: {
    fontFamily: 'AmiriQuran',
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  chevron: {
    fontSize: 22,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '300',
  },
});
