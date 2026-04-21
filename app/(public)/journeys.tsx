import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { JourneyCard } from '@/components/ui/JourneyCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { SoftLoginBanner } from '@/components/ui/SoftLoginBanner';
import { COLORS } from '@/lib/constants';
import { useJourneys, type JourneySummary } from '@/features/journeys/useJourneys';

/**
 * Public journey browse screen — same data as the authenticated tab index,
 * but no auth guard. Tapping a journey routes into the public journey detail.
 * A SoftLoginBanner nudges visitors to sign in for progress tracking.
 */
export default function PublicJourneysScreen() {
  const { data: journeys, isLoading, isError } = useJourneys();

  const handleJourneyPress = useCallback((id: string) => {
    router.push(`/(public)/journey/${id}`);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: JourneySummary }) => (
      <JourneyCard journey={item} onPress={handleJourneyPress} />
    ),
    [handleJourneyPress],
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.skeletonContainer}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      );
    }
    if (isError) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Something went wrong</Text>
          <Text style={styles.emptySubtext}>Could not load journeys. Please try again.</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No journeys yet</Text>
        <Text style={styles.emptySubtext}>New journeys are on their way.</Text>
      </View>
    );
  }, [isLoading, isError]);

  return (
    <View style={styles.container}>
      <SoftLoginBanner />

      <FlashList
        data={journeys ?? []}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Journey Library</Text>
            <Text style={styles.headerSubtitle}>Choose your path through the Quran</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DEEP,
  },
  header: {
    paddingHorizontal: 4,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 4,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  skeletonContainer: {
    gap: 0,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
});
