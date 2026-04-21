import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/lib/constants';

/**
 * BismillahHeader — shown only on quest day 1 (the first quest of a journey).
 * Displays the Bismillah in Arabic centered above the verse list.
 */
export function BismillahHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.dividerLeft} />
      <Text style={styles.text} accessibilityLabel="Bismillah ir-rahman ir-rahim">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </Text>
      <View style={styles.dividerRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
    gap: 12,
  },
  dividerLeft: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.CARD_BORDER,
  },
  dividerRight: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.CARD_BORDER,
  },
  text: {
    fontFamily: 'AmiriQuran',
    fontSize: 22,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    writingDirection: 'rtl',
    flexShrink: 1,
  },
});
