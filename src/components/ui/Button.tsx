import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { fontFamily, palette, radii, useColors } from '@/lib/theme';

type Variant = 'primary' | 'ghost' | 'onDark' | 'soft';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  variant?: Variant;
  size?: Size;
  /** Render leading content (icon) before the label. */
  leading?: ReactNode;
  /** Render trailing content (icon) after the label. */
  trailing?: ReactNode;
  /** Show a loading spinner instead of the label. Disables press. */
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

const HEIGHT: Record<Size, number> = { sm: 36, md: 44, lg: 52 };
const PADDING_X: Record<Size, number> = { sm: 14, md: 18, lg: 22 };
const FONT_SIZE: Record<Size, number> = { sm: 13, md: 14, lg: 15 };

/**
 * Pill button with three states (rest / hover-equivalent / press) and
 * four variants. Per the design system, buttons are *always* pill-radius;
 * never square. `primary` is the only variant that uses `--brand` as a
 * fill — use `ghost` for secondary actions and `onDark` for surfaces
 * over hero gradients (frosted-glass treatment).
 */
export function Button({
  variant = 'primary',
  size = 'md',
  leading,
  trailing,
  loading = false,
  fullWidth = false,
  disabled,
  style,
  children,
  ...rest
}: ButtonProps) {
  const { colors } = useColors();
  const isDisabled = disabled || loading;

  const fillColor = (() => {
    switch (variant) {
      case 'primary':
        return colors.brand;
      case 'soft':
        return colors.brandSoft;
      case 'onDark':
        return 'rgba(255,255,255,0.16)';
      case 'ghost':
      default:
        return 'transparent';
    }
  })();

  const pressFillColor = (() => {
    switch (variant) {
      case 'primary':
        return colors.brandPress;
      case 'soft':
        return colors.brandSoft;
      case 'onDark':
        return 'rgba(255,255,255,0.24)';
      case 'ghost':
      default:
        return 'rgba(0,0,0,0.04)';
    }
  })();

  const textColor = (() => {
    switch (variant) {
      case 'primary':
        return colors.fgOnBrand;
      case 'soft':
        return colors.brandFg;
      case 'onDark':
        return palette.ink[0];
      case 'ghost':
      default:
        return colors.brandFg;
    }
  })();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          height: HEIGHT[size],
          paddingHorizontal: PADDING_X[size],
          backgroundColor: pressed && !isDisabled ? pressFillColor : fillColor,
          opacity: isDisabled ? 0.4 : 1,
          transform: pressed && !isDisabled ? [{ scale: 0.98 }] : [],
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.row}>
          {leading ? <View style={styles.slot}>{leading}</View> : null}
          <Text
            style={{
              fontFamily: fontFamily.sansSemiBold,
              fontSize: FONT_SIZE[size],
              color: textColor,
              letterSpacing: 0,
            }}
          >
            {children}
          </Text>
          {trailing ? <View style={styles.slot}>{trailing}</View> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
