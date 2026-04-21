import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { COLORS } from '@/lib/constants';

/**
 * Animated skeleton loader shaped like a JourneyCard.
 * Uses opacity pulse animation — compositor-friendly, no layout triggers.
 */
export function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      {/* Cover area */}
      <View style={styles.cover} />
      {/* Content lines */}
      <View style={styles.content}>
        <View style={styles.titleLine} />
        <View style={styles.subtitleLine} />
        <View style={styles.badge} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: COLORS.CARD_BG,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cover: {
    height: 110,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  content: {
    padding: 16,
    gap: 8,
  },
  titleLine: {
    height: 16,
    width: '65%',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  subtitleLine: {
    height: 12,
    width: '45%',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  badge: {
    height: 20,
    width: 70,
    borderRadius: 10,
    backgroundColor: 'rgba(20,184,166,0.2)',
    marginTop: 4,
  },
});
