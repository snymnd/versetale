import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { GRADIENTS, palette, typography } from '@/lib/theme';

import { StreakFlame } from './StreakFlame';

interface StreakChipProps {
  days: number;
  label?: string;
  /** Tighter padding for hero overlays. */
  compact?: boolean;
}

/**
 * Streak badge — Lantern Amber pill with a flame icon. The single
 * permitted use of amber alongside the streak hero on Profile. Never
 * style other counters as a streak chip.
 */
export function StreakChip({ days, label = 'day streak', compact = false }: StreakChipProps) {
  const flameSize = compact ? 22 : 28;
  return (
    <View style={[styles.chip, compact ? styles.chipCompact : styles.chipNormal]}>
      <LinearGradient
        colors={[...GRADIENTS.lantern.colors]}
        start={GRADIENTS.lantern.start}
        end={GRADIENTS.lantern.end}
        style={[
          styles.flameWell,
          { width: flameSize, height: flameSize, borderRadius: flameSize / 2 },
        ]}
      >
        <StreakFlame size={compact ? 14 : 16} startColor="#FFFFFF" endColor="#FFFFFF" />
      </LinearGradient>
      <Text style={[styles.label, compact && styles.labelCompact]}>
        {days} {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(253,241,220,0.92)',
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  chipNormal: { paddingVertical: 6, paddingLeft: 6, paddingRight: 14 },
  chipCompact: { paddingVertical: 4, paddingLeft: 4, paddingRight: 10 },
  flameWell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.meta,
    fontFamily: 'Inter_600SemiBold',
    color: palette.amber[700],
    fontSize: 13,
  },
  labelCompact: {
    fontSize: 12,
  },
});
