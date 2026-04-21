import { useEffect, useRef, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

import { COLORS } from '@/lib/constants';
import type { Verse } from '@/features/reader/types';

interface VerseBlockProps {
  verse: Verse;
  isPlaying: boolean;
  onPress: () => void;
}

/**
 * VerseBlock — renders a single Quran verse with:
 * - Right-aligned Arabic text (AmiriQuran font)
 * - Verse number badge
 * - English translation
 * - Animated teal highlight when this verse is actively playing
 * - Long-press forwarded via onLongPress for tafsir sheet
 */
export function VerseBlock({ verse, isPlaying, onPress }: VerseBlockProps) {
  // 0 = idle, 1 = active/playing
  const highlight = useSharedValue(isPlaying ? 1 : 0);

  useEffect(() => {
    highlight.value = withTiming(isPlaying ? 1 : 0, { duration: 350 });
  }, [isPlaying, highlight]);

  const animatedStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      highlight.value,
      [0, 1],
      ['rgba(255,255,255,0)', 'rgba(20,184,166,0.08)'],
    );
    return { backgroundColor: bg };
  });

  const borderStyle = useAnimatedStyle(() => {
    const opacity = withTiming(isPlaying ? 1 : 0, { duration: 350 });
    return { opacity };
  });

  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <Pressable onPress={handlePress} accessibilityRole="button" accessibilityLabel={`Verse ${verse.verseNumber}`}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Active left-border indicator */}
        <Animated.View style={[styles.activeBorder, borderStyle]} />

        <View style={styles.content}>
          {/* Verse number badge */}
          <View style={styles.verseNumberRow}>
            <View style={styles.verseNumberBadge}>
              <Text style={styles.verseNumberText}>{verse.verseNumber}</Text>
            </View>
          </View>

          {/* Arabic text */}
          <Text style={styles.arabicText} accessibilityLanguage="ar">
            {verse.textUthmani}
          </Text>

          {/* Translation */}
          <Text style={styles.translationText}>{verse.translation}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    flexDirection: 'row',
  },
  activeBorder: {
    width: 3,
    backgroundColor: COLORS.ACCENT,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 12,
  },
  verseNumberRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  verseNumberBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(20,184,166,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(20,184,166,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.ACCENT,
  },
  arabicText: {
    fontFamily: 'AmiriQuran',
    fontSize: 26,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 44,
  },
  translationText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
  },
});
