import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { radii, spacing, useColors } from '@/lib/theme';

/**
 * Animated skeleton loader shaped like a JourneyCard list row.
 * Uses opacity pulse animation — compositor-friendly, no layout triggers.
 */
export function SkeletonCard() {
  const { colors, shadow } = useColors();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.card, shadow.sm, { backgroundColor: colors.bgRaised, opacity }]}
    >
      <View style={[styles.cover, { backgroundColor: colors.bgMuted }]} />
      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <View style={[styles.refLine, { backgroundColor: colors.bgMuted }]} />
          <View style={[styles.titleLine, { backgroundColor: colors.borderStrong }]} />
        </View>
        <View style={styles.bodyBottom}>
          <View style={[styles.progressTrack, { backgroundColor: colors.bgMuted }]} />
          <View style={[styles.metaLine, { backgroundColor: colors.bgMuted }]} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    padding: spacing[3],
    borderRadius: radii.lg,
    marginBottom: spacing[3],
    overflow: 'hidden',
  },
  cover: {
    width: 76,
    height: 96,
    borderRadius: radii.md,
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  bodyTop: { gap: 8 },
  bodyBottom: { gap: 6 },
  refLine: { height: 10, width: '40%', borderRadius: 4 },
  titleLine: { height: 16, width: '85%', borderRadius: 6 },
  progressTrack: { height: 3, borderRadius: 2, width: '100%' },
  metaLine: { height: 11, width: '60%', borderRadius: 4 },
});
