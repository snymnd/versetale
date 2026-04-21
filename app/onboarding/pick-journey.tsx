import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { JourneyCard } from '@/components/ui/JourneyCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { COLORS } from '@/lib/constants';
import { useJourneys, type JourneySummary } from '@/features/journeys/useJourneys';
import { useAuthStore } from '@/features/auth/authStore';

/**
 * Onboarding step 3 — journey catalog.
 * Selecting a journey checks authentication, then routes accordingly.
 */
export default function PickJourneyScreen() {
  const { data: journeys, isLoading } = useJourneys();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleJourneySelect = useCallback(
    (id: string) => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        // Store the selected journey in URL state so login can redirect back
        router.push({ pathname: '/(auth)/login', params: { returnJourney: id } });
      }
    },
    [isAuthenticated],
  );

  const renderItem = useCallback(
    ({ item }: { item: JourneySummary }) => (
      <JourneyCard journey={item} onPress={handleJourneySelect} />
    ),
    [handleJourneySelect],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.stepIndicator}>3 of 3</Text>
      </View>

      <View style={styles.titleGroup}>
        <Text style={styles.title}>Pick your first journey</Text>
        <Text style={styles.subtitle}>You can start another one any time.</Text>
      </View>

      {isLoading ? (
        <View style={styles.skeletonContainer}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlashList
          data={journeys ?? []}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DEEP,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 24,
  },
  backText: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  stepIndicator: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
    fontWeight: '500',
  },
  titleGroup: {
    gap: 4,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  skeletonContainer: {
    paddingHorizontal: 0,
  },
  listContent: {
    paddingBottom: 32,
  },
});
