import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { radii, useColors } from '@/lib/theme';

interface CardProps {
  /** Surface elevation. `flat` removes the shadow entirely. */
  elevation?: 'flat' | 'sm' | 'md' | 'lg';
  /** `lg` (18px) for content cards, `xl` (24px) for hero/journey covers. */
  radius?: 'md' | 'lg' | 'xl';
  padding?: number;
  style?: ViewStyle | ViewStyle[];
  children?: ReactNode;
}

/**
 * Default content surface — bg-raised, soft cool shadow, 18-px radius.
 * Use `radius="xl"` for hero/journey covers, `elevation="flat"` when the
 * card sits inside another raised surface.
 */
export function Card({
  elevation = 'sm',
  radius = 'lg',
  padding,
  style,
  children,
}: CardProps) {
  const { colors, shadow } = useColors();
  const shadowStyle = elevation === 'flat' ? null : shadow[elevation];
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors.bgRaised,
          borderRadius: radii[radius],
          padding,
        },
        shadowStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
});
