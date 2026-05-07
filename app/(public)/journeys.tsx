import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { JourneyCard } from '@/components/ui/JourneyCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { SoftLoginBanner } from '@/components/ui/SoftLoginBanner';
import { Eyebrow, Text } from '@/components/ui';
import { fontFamily, palette, spacing, useColors } from '@/lib/theme';
import { useJourneys, type JourneySummary } from '@/features/journeys/useJourneys';

/**
 * Public journeys catalog — same data as the authenticated tab index, no
 * auth guard. A SoftLoginBanner nudges visitors to sign in for progress.
 */
export default function PublicJourneysScreen() {
  const { data: journeys, isLoading, isError } = useJourneys();
  const { colors } = useColors();

  const handleJourneyPress = useCallback((id: string) => {
    router.push(`/(public)/journey/${id}`);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: JourneySummary }) => (
      <JourneyCard journey={item} onPress={handleJourneyPress} />
    ),
    [handleJourneyPress],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      <SoftLoginBanner />

      <FlashList
        data={journeys ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.header}>
            <Eyebrow tone="muted">Library · Public preview</Eyebrow>
            <Text style={[styles.title, { color: colors.fg }]}>Choose your path</Text>
            <Text variant="read" tone="muted" style={styles.subtitle}>
              Begin a story below. Sign in any time to keep your progress.
            </Text>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </View>
          ) : isError ? (
            <View style={styles.empty}>
              <Text variant="h4">Something went wrong</Text>
              <Text variant="caption" tone="muted">
                Could not load journeys. Pull to refresh.
              </Text>
            </View>
          ) : (
            <View style={styles.empty}>
              <Text variant="h4">No journeys yet</Text>
              <Text variant="caption" tone="muted">
                New journeys are on their way.
              </Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: spacing[5],
    paddingBottom: spacing[5],
    gap: 6,
  },
  title: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
    color: palette.ink[25],
    marginTop: 4,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 8,
  },
});
