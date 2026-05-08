import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { JourneyCard } from '@/components/ui/JourneyCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { Text } from '@/components/ui';
import { fontFamily, palette, spacing, useColors } from '@/lib/theme';
import { useAuthStore } from '@/features/auth/authStore';
import { useJourneys, type JourneySummary } from '@/features/journeys/useJourneys';

/**
 * Onboarding step 3 — journey catalog. Selecting a journey routes
 * authenticated users to the tabs and unauthenticated visitors to login
 * with the chosen journey id pinned to params.
 */
export default function PickJourneyScreen() {
  const { data: journeys, isLoading } = useJourneys();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { colors } = useColors();

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/onboarding/welcome');
  }, []);

  const handleJourneySelect = useCallback(
    (id: string) => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={handleBack}
          style={[styles.iconBtn, { backgroundColor: colors.bgSunken }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <ChevronLeft color={colors.fgMuted} size={20} strokeWidth={1.75} />
        </Pressable>
        <Text variant="meta" tone="muted">
          3 of 3
        </Text>
      </View>

      <View style={styles.titleGroup}>
        <Text style={[styles.title, { color: colors.fg }]}>Pick your first journey</Text>
        <Text variant="read" tone="muted" style={styles.subtitle}>
          You can start another one any time.
        </Text>
      </View>

      {isLoading ? (
        <View>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlashList
          data={journeys ?? []}
          keyExtractor={(item) => item.id}
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
    marginBottom: spacing[6],
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleGroup: {
    gap: 4,
    marginBottom: spacing[5],
  },
  title: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
    color: palette.ink[25],
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
  },
  listContent: {
    paddingBottom: 60,
  },
});
