import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { GRADIENTS } from '@/lib/theme';

import { ArchesPattern } from './ArchesPattern';

type GradientName = keyof typeof GRADIENTS;

interface HeroDuskProps {
  /** Which signature gradient to render. Defaults to the dusk wash. */
  variant?: GradientName;
  /** Subliminal arches overlay — defaults on, set false for plain gradient. */
  pattern?: boolean;
  /** Pattern opacity, 4–6% per spec. */
  patternOpacity?: number;
  patternTileSize?: number;
  patternColor?: string;
  style?: ViewStyle | ViewStyle[];
  children?: ReactNode;
}

/**
 * Signature hero surface — VerseTale's "dusk wash" gradient with a
 * subliminal mihrab-arch overlay. Reserved for journey covers, daily-quest
 * banners, splash, and the Library greeting. Never on buttons or small UI.
 */
export function HeroDusk({
  variant = 'dusk',
  pattern = true,
  patternOpacity = 0.06,
  patternTileSize = 120,
  patternColor = '#FFFFFF',
  style,
  children,
}: HeroDuskProps) {
  const g = GRADIENTS[variant];
  return (
    <LinearGradient
      colors={[...g.colors]}
      locations={[...g.locations]}
      start={g.start}
      end={g.end}
      style={[styles.container, style]}
    >
      {pattern ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <ArchesPattern
            color={patternColor}
            opacity={patternOpacity}
            tileSize={patternTileSize}
          />
        </View>
      ) : null}
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
});
