import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { typography, useColors } from '@/lib/theme';

type Variant = keyof typeof typography;

interface TextProps extends RNTextProps {
  variant?: Variant;
  /** Override the resolved foreground color. Defaults: `fg` for body/display,
   *  `fgMuted` for caption/meta/eyebrow/mono. */
  color?: string;
  /** Tonal helpers. */
  tone?: 'default' | 'muted' | 'subtle' | 'brand' | 'amber' | 'onBrand';
}

const MUTED_VARIANTS = new Set<Variant>(['caption', 'meta', 'eyebrow', 'mono']);

/**
 * Typed Text primitive backed by the design-system type ramp.
 * Use `<Text variant="display"|"h1"…|"body"|"read"|"arabic"|"caption"|"meta"|"mono"|"eyebrow">`.
 * Defaults to `body`.
 */
export function Text({
  variant = 'body',
  color,
  tone,
  style,
  ...rest
}: TextProps) {
  const { colors } = useColors();
  const baseColor =
    tone === 'muted'
      ? colors.fgMuted
      : tone === 'subtle'
        ? colors.fgSubtle
        : tone === 'brand'
          ? colors.brandFg
          : tone === 'amber'
            ? colors.amberFg
            : tone === 'onBrand'
              ? colors.fgOnBrand
              : MUTED_VARIANTS.has(variant)
                ? colors.fgMuted
                : colors.fg;

  return (
    <RNText
      {...rest}
      style={[typography[variant] as TextStyle, { color: color ?? baseColor }, style]}
    />
  );
}
