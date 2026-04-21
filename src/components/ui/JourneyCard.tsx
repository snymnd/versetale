import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/lib/constants';
import type { JourneySummary } from '@/features/journeys/useJourneys';

interface JourneyCardProps {
  journey: JourneySummary;
  onPress: (id: string) => void;
}

/**
 * Editorial-style card showing a journey with:
 * - Full-bleed cover gradient
 * - Arabic subtitle overlaid on gradient
 * - English title, description, quest count badge
 * - Scale + opacity press animation via Reanimated-compatible Animated API
 */
export function JourneyCard({ journey, onPress }: JourneyCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressOpacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.timing(pressOpacity, {
        toValue: 0.88,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, pressOpacity]);

  const handlePressOut = useCallback(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 4,
      }),
      Animated.timing(pressOpacity, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, pressOpacity]);

  const gradientColors = journey.coverGradient as [string, string];

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }], opacity: pressOpacity }]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress(journey.id)}
        accessibilityRole="button"
        accessibilityLabel={`Start journey: ${journey.title}`}
        style={styles.pressable}
      >
        {/* Cover gradient with Arabic subtitle */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cover}
        >
          {/* Decorative grain overlay */}
          <View style={styles.grainOverlay} />

          <View style={styles.coverContent}>
            <Text style={styles.arabicSubtitle} numberOfLines={1}>
              {journey.titleArabic}
            </Text>
          </View>
        </LinearGradient>

        {/* Card body */}
        <View style={styles.body}>
          <View style={styles.bodyTop}>
            <Text style={styles.title} numberOfLines={2}>
              {journey.title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {journey.description}
            </Text>
          </View>

          <View style={styles.footer}>
            {/* Quest count badge */}
            <View style={styles.questBadge}>
              <Text style={styles.questBadgeText}>{journey.totalQuests} quests</Text>
            </View>

            {/* Difficulty chip */}
            <View style={styles.difficultyChip}>
              <Text style={styles.difficultyText}>{journey.difficulty}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: COLORS.CARD_BG,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    overflow: 'hidden',
  },
  pressable: {
    flex: 1,
  },
  cover: {
    height: 130,
    justifyContent: 'flex-end',
    padding: 16,
  },
  grainOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  coverContent: {
    alignItems: 'flex-end',
  },
  arabicSubtitle: {
    fontFamily: 'AmiriQuran',
    fontSize: 24,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'right',
    writingDirection: 'rtl',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  body: {
    padding: 16,
    gap: 12,
  },
  bodyTop: {
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  questBadge: {
    backgroundColor: 'rgba(20,184,166,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(20,184,166,0.35)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  questBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.ACCENT,
    letterSpacing: 0.2,
  },
  difficultyChip: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  difficultyText: {
    fontSize: 11,
    color: COLORS.TEXT_TERTIARY,
    textTransform: 'capitalize',
  },
});
