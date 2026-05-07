import { StyleSheet, Text, View } from 'react-native';

import { Divider } from '@/components/brand';
import { spacing, useColors } from '@/lib/theme';

/**
 * BismillahHeader — shown only on quest day 1 (the first quest of a journey).
 * Uses the design system's chapter-break divider as a frame around the
 * Bismillah set in Amiri.
 */
export function BismillahHeader() {
  const { colors } = useColors();
  return (
    <View style={styles.container}>
      <Divider color={colors.divider} />
      <Text
        style={[styles.text, { color: colors.fgMuted }]}
        accessibilityLabel="Bismillah ir-rahman ir-rahim"
      >
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </Text>
      <Divider color={colors.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 32,
    marginTop: spacing[3],
    marginBottom: spacing[6],
    gap: spacing[3],
  },
  text: {
    fontFamily: 'AmiriQuran',
    fontSize: 24,
    lineHeight: 44,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
