import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { ArchesPattern, OrnamentStar } from '@/components/brand';
import { Text } from '@/components/ui/Text';
import { palette, radii, spacing, typography, useColors } from '@/lib/theme';
import type { JourneySummary } from '@/features/journeys/useJourneys';

interface JourneyCardProps {
  journey: JourneySummary;
  onPress: (id: string) => void;
  /** Reading progress 0..1 — if provided, renders a hairline bar. */
  progress?: number;
  /** "Day 4 / 12" or "12 verses · 9 min" — short status line under the title. */
  statusLine?: string;
  /** Sūrah reference, e.g. `Sūrah 12 · al-Yūsuf`. */
  reference?: string;
}

/**
 * Compact list-row journey card — 76×96 gradient cover with arches
 * overlay and an ornament, paired with a Fraunces title, mono Sūrah
 * reference, and (optionally) a hairline progress track + day counter.
 *
 * Ports the "Your journeys" row pattern from the design system kit.
 */
export function JourneyCard({
  journey,
  onPress,
  progress,
  statusLine,
  reference,
}: JourneyCardProps) {
  const { colors, shadow } = useColors();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, { toValue: 0.98, duration: 150, useNativeDriver: true }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  }, [scale]);

  const gradientColors = journey.coverGradient as [string, string];
  const ref = reference ?? `${journey.totalQuests} ${journey.totalQuests === 1 ? 'day' : 'days'}`;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        shadow.sm,
        { backgroundColor: colors.bgRaised, transform: [{ scale }] },
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress(journey.id)}
        accessibilityRole="button"
        accessibilityLabel={`Open journey: ${journey.title}`}
        style={styles.pressable}
      >
        {/* Cover — 76×96 gradient with arches overlay + ornament */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.cover}
        >
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <ArchesPattern color="#FFFFFF" opacity={0.18} tileSize={80} />
          </View>
          <View style={styles.ornamentSlot}>
            <OrnamentStar size={18} color="rgba(242,198,129,0.85)" />
          </View>
        </LinearGradient>

        {/* Body */}
        <View style={styles.body}>
          <View style={styles.bodyTop}>
            <Text variant="mono" tone="subtle" numberOfLines={1} style={styles.refLine}>
              {ref}
            </Text>
            <Text
              variant="h4"
              numberOfLines={2}
              style={[styles.titleLine, { fontFamily: typography.h3.fontFamily }]}
            >
              {journey.title}
            </Text>
          </View>

          <View style={styles.bodyBottom}>
            {progress !== undefined ? (
              <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
                      backgroundColor: colors.brand,
                    },
                  ]}
                />
              </View>
            ) : null}
            {statusLine ? (
              <Text variant="meta" tone="muted" style={styles.statusLine}>
                {statusLine}
              </Text>
            ) : (
              <Text variant="meta" tone="muted" numberOfLines={2} style={styles.statusLine}>
                {journey.description}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radii.lg,
    marginBottom: spacing[3],
    overflow: 'hidden',
  },
  pressable: {
    flexDirection: 'row',
    gap: 14,
    padding: spacing[3],
  },
  cover: {
    width: 76,
    height: 96,
    borderRadius: radii.md,
    overflow: 'hidden',
    position: 'relative',
  },
  ornamentSlot: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  body: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  bodyTop: {
    gap: 4,
  },
  refLine: {
    fontSize: 10,
    letterSpacing: 0.6,
    color: palette.ink[400],
  },
  titleLine: {
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: -0.34,
  },
  bodyBottom: {
    gap: 6,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  statusLine: {
    fontSize: 11,
  },
});
