import { Play } from 'lucide-react-native';
import { useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/ui';
import { fontFamily, palette, radii, spacing, useColors } from '@/lib/theme';
import type { Verse } from '@/features/reader/types';

interface VerseBlockProps {
  verse: Verse;
  isPlaying: boolean;
  onPress: () => void;
}

/**
 * VerseBlock — verse card matching the design kit's "verse" pattern:
 * mono reference + inline Recite pill, Amiri 30/2.0 RTL Arabic, Fraunces
 * 17 translation. Highlights softly when this verse is the active audio
 * track. Long-press is forwarded by the parent for tafsir.
 */
export function VerseBlock({ verse, isPlaying, onPress }: VerseBlockProps) {
  const { colors } = useColors();
  const highlight = useSharedValue(isPlaying ? 1 : 0);

  useEffect(() => {
    highlight.value = withTiming(isPlaying ? 1 : 0, { duration: 240 });
  }, [isPlaying, highlight]);

  const animatedStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      highlight.value,
      [0, 1],
      [colors.bgRaised, colors.brandSoft],
    );
    return { backgroundColor: bg };
  });

  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.headerRow}>
        <Text variant="mono" tone="muted" style={styles.verseRef}>
          Qur'ān {verse.verseKey}
        </Text>
        <Pressable
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause recitation' : `Play verse ${verse.verseNumber}`}
          style={({ pressed }) => [
            styles.recitePill,
            { backgroundColor: colors.brandSoft, opacity: pressed ? 0.85 : 1 },
          ]}
          hitSlop={6}
        >
          <Play
            size={11}
            color={colors.brandFg}
            fill={colors.brandFg}
            strokeWidth={0}
          />
          <Text variant="meta" tone="brand" style={styles.recitePillText}>
            {isPlaying ? 'Playing' : 'Recite'}
          </Text>
        </Pressable>
      </View>

      <Text style={[styles.arabicText, { color: colors.fg }]} accessibilityLanguage="ar">
        {verse.textUthmani}
      </Text>

      <Text variant="read" style={styles.translationText}>
        {verse.translation}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 7,
    paddingHorizontal: 22,
    paddingVertical: 20,
    borderRadius: radii.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  verseRef: {
    fontSize: 11,
  },
  recitePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 11,
    paddingLeft: 8,
    borderRadius: radii.pill,
  },
  recitePillText: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 11,
  },
  arabicText: {
    fontFamily: 'AmiriQuran',
    fontSize: 28,
    lineHeight: 56,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: spacing[3],
    color: palette.ink[25],
  },
  translationText: {
    fontSize: 17,
    lineHeight: 28,
  },
});
