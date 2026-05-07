/**
 * VerseTale Design System — tokens
 *
 * Ported from `colors_and_type.css` in the Claude Design handoff bundle.
 * Light / dark mode is selected by `useColors()` based on `Appearance`.
 * The exported `palette`, `spacing`, `radii`, `shadow`, `motion`, and
 * `typography` objects are immutable (`as const`) so consumers get exact
 * literal types.
 */

import { useMemo } from 'react';
import { Appearance, type ColorSchemeName, type TextStyle } from 'react-native';

// ────────────────────────────────────────────────────────────────────────────
// Palette — raw color values. Use semantic `colors.*` from `useColors()`
// for everything except hero gradients and brand-specific accents.
// ────────────────────────────────────────────────────────────────────────────
export const palette = {
  teal: {
    50: '#EDF7F7',
    100: '#D2ECEC',
    200: '#A6D8D8',
    300: '#6FBDC1',
    400: '#3E9AA2',
    500: '#1F7A84',
    600: '#165F6B',
    700: '#124B56',
    800: '#0E3A43',
    900: '#0A2A31',
    950: '#061B21',
  },
  ink: {
    0: '#FFFFFF',
    25: '#FBFCFC',
    50: '#F4F6F7',
    100: '#E8ECEE',
    200: '#D3DADD',
    300: '#B2BDC2',
    400: '#8794A0',
    500: '#5E6B76',
    600: '#414D57',
    700: '#2D3740',
    800: '#1B232B',
    900: '#0F161C',
    950: '#070C11',
  },
  amber: {
    100: '#FDF1DC',
    300: '#F2C681',
    500: '#D99846',
    700: '#A66A22',
  },
  semantic: {
    success: '#3E9A6D',
    warning: '#D99846',
    danger: '#B85C4C',
    info: '#3E9AA2',
  },
} as const;

// ────────────────────────────────────────────────────────────────────────────
// Gradients — hero surfaces only (Journey covers, daily-quest banners,
// splash). Never on buttons or small UI.
// `LinearGradient` from `expo-linear-gradient` consumes these via:
//   <LinearGradient colors={GRADIENTS.dusk.colors}
//                   locations={GRADIENTS.dusk.locations}
//                   start={GRADIENTS.dusk.start} end={GRADIENTS.dusk.end} />
// 155° on the spec is the angle from a CSS top-left origin, so we encode
// start={0,0} end={cos(angle), sin(angle)} approximated to {0.42, 0.91}.
// ────────────────────────────────────────────────────────────────────────────
const dusk155 = { start: { x: 0, y: 0 }, end: { x: 0.42, y: 0.91 } };
const night180 = { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };
const lantern135 = { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };

export const GRADIENTS = {
  dusk: {
    colors: [palette.teal[800], palette.teal[500], palette.teal[400]] as [string, string, string],
    locations: [0, 0.55, 1] as [number, number, number],
    ...dusk155,
  },
  dawn: {
    colors: [palette.teal[700], palette.teal[400], palette.teal[200]] as [string, string, string],
    locations: [0, 0.6, 1] as [number, number, number],
    ...dusk155,
  },
  night: {
    colors: [palette.teal[900], palette.teal[950]] as [string, string],
    locations: [0, 1] as [number, number],
    ...night180,
  },
  lantern: {
    colors: [palette.amber[300], palette.amber[500]] as [string, string],
    locations: [0, 1] as [number, number],
    ...lantern135,
  },
} as const;

// ────────────────────────────────────────────────────────────────────────────
// Spacing — 4-px base grid. Screen gutter is 20px on mobile.
// ────────────────────────────────────────────────────────────────────────────
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

export const GUTTER = 20;
export const MEASURE = 640;

// ────────────────────────────────────────────────────────────────────────────
// Radii — soft, editorial. Bottom sheets use `2xl` on top corners only.
// ────────────────────────────────────────────────────────────────────────────
export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  '2xl': 32,
  pill: 999,
} as const;

// ────────────────────────────────────────────────────────────────────────────
// Shadows — cool-tinted (rgba of #0E3A43, never black).
// React Native ignores some CSS shadow features; these map to the
// closest shadow{Color,Offset,Opacity,Radius} + elevation pair.
// ────────────────────────────────────────────────────────────────────────────
const SHADOW_COLOR = '#0E3A43';
const SHADOW_COLOR_DARK = '#000000';

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export type ShadowScale = {
  xs: ShadowStyle;
  sm: ShadowStyle;
  md: ShadowStyle;
  lg: ShadowStyle;
  xl: ShadowStyle;
};

export const shadow: ShadowScale = {
  xs: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 12,
  },
  xl: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.22,
    shadowRadius: 40,
    elevation: 20,
  },
};

const shadowDark: ShadowScale = {
  xs: { ...shadow.xs, shadowColor: SHADOW_COLOR_DARK, shadowOpacity: 0.4 },
  sm: { ...shadow.sm, shadowColor: SHADOW_COLOR_DARK, shadowOpacity: 0.35 },
  md: { ...shadow.md, shadowColor: SHADOW_COLOR_DARK, shadowOpacity: 0.45 },
  lg: { ...shadow.lg, shadowColor: SHADOW_COLOR_DARK, shadowOpacity: 0.55 },
  xl: { ...shadow.xl, shadowColor: SHADOW_COLOR_DARK, shadowOpacity: 0.6 },
};

// ────────────────────────────────────────────────────────────────────────────
// Motion — reverent, never bouncy. No springs, no overshoot on UI. The
// lone exception is "entrance" for hero/splash surfaces.
// ────────────────────────────────────────────────────────────────────────────
export const motion = {
  ease: {
    standard: [0.2, 0.8, 0.2, 1] as const,
    entrance: [0.16, 1, 0.3, 1] as const,
    exit: [0.4, 0, 0.6, 1] as const,
  },
  duration: {
    fast: 150,
    base: 240,
    slow: 420,
    page: 600,
  },
} as const;

// ────────────────────────────────────────────────────────────────────────────
// Typography — four families, mapped to the names registered with
// `useFonts()` in `app/_layout.tsx`.
// ────────────────────────────────────────────────────────────────────────────
export const fontFamily = {
  display: 'Fraunces',
  displayMedium: 'Fraunces_500Medium',
  displaySemiBold: 'Fraunces_600SemiBold',
  displayBold: 'Fraunces_700Bold',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
  mono: 'JetBrainsMono_500Medium',
  arabic: 'AmiriQuran',
} as const;

// Reading body (verses, translations, Tafsir) uses Fraunces 17/relaxed.
// Display variants use the Medium weight per the design (font-weight 500).
type StyleLiteral = TextStyle;

export const typography = {
  display: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 56,
    lineHeight: 64,
    letterSpacing: -1.12,
  },
  h1: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 44,
    lineHeight: 50,
    letterSpacing: -0.88,
  },
  h2: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 34,
    lineHeight: 44,
    letterSpacing: -0.68,
  },
  h3: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
  },
  h4: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 19,
    lineHeight: 24,
    letterSpacing: -0.38,
  },
  body: {
    fontFamily: fontFamily.sans,
    fontSize: 16,
    lineHeight: 24,
  },
  read: {
    // Reading body — translations, Tafsir, reflections
    fontFamily: fontFamily.display,
    fontSize: 17,
    lineHeight: 29,
    letterSpacing: 0.085,
  },
  arabic: {
    fontFamily: fontFamily.arabic,
    fontSize: 30,
    lineHeight: 60,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: 14,
    lineHeight: 21,
  },
  meta: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    lineHeight: 18,
  },
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: 12,
    lineHeight: 18,
  },
  eyebrow: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.32,
    textTransform: 'uppercase',
  },
} as const satisfies Record<string, StyleLiteral>;

// ────────────────────────────────────────────────────────────────────────────
// Semantic colors — light & dark variants. Use `useColors()` to subscribe.
// ────────────────────────────────────────────────────────────────────────────
export interface SemanticColors {
  bg: string;
  bgRaised: string;
  bgSunken: string;
  bgMuted: string;
  fg: string;
  fgMuted: string;
  fgSubtle: string;
  fgOnBrand: string;
  brand: string;
  brandHover: string;
  brandPress: string;
  brandSoft: string;
  brandFg: string;
  border: string;
  borderStrong: string;
  divider: string;
  amber: string;
  amberSoft: string;
  amberFg: string;
}

const lightColors: SemanticColors = {
  bg: palette.ink[25],
  bgRaised: palette.ink[0],
  bgSunken: palette.ink[50],
  bgMuted: palette.ink[100],
  fg: palette.ink[900],
  fgMuted: palette.ink[600],
  fgSubtle: palette.ink[400],
  fgOnBrand: palette.ink[0],
  brand: palette.teal[500],
  brandHover: palette.teal[600],
  brandPress: palette.teal[700],
  brandSoft: palette.teal[50],
  brandFg: palette.teal[700],
  border: palette.ink[100],
  borderStrong: palette.ink[200],
  divider: palette.ink[100],
  amber: palette.amber[500],
  amberSoft: palette.amber[100],
  amberFg: palette.amber[700],
};

const darkColors: SemanticColors = {
  bg: palette.ink[950],
  bgRaised: palette.ink[900],
  bgSunken: '#04090D',
  bgMuted: palette.ink[800],
  fg: '#ECEFF2',
  fgMuted: '#9CA7B0',
  fgSubtle: palette.ink[500],
  fgOnBrand: palette.ink[0],
  brand: palette.teal[400],
  brandHover: palette.teal[300],
  brandPress: palette.teal[200],
  brandSoft: 'rgba(62, 154, 162, 0.12)',
  brandFg: palette.teal[300],
  border: palette.ink[800],
  borderStrong: palette.ink[700],
  divider: '#14202A',
  amber: palette.amber[500],
  amberSoft: 'rgba(217, 152, 70, 0.18)',
  amberFg: palette.amber[300],
};

export interface Theme {
  scheme: 'light' | 'dark';
  colors: SemanticColors;
  shadow: ShadowScale;
}

const lightTheme: Theme = { scheme: 'light', colors: lightColors, shadow };
const darkTheme: Theme = { scheme: 'dark', colors: darkColors, shadow: shadowDark };

/**
 * Resolve the active theme. Defaults to dark — VerseTale ships dark mode as a
 * product feature for night reading, not just a toggle. Pass an explicit
 * `scheme` to override (e.g. for one-off light/dark surfaces).
 */
export function getTheme(scheme: ColorSchemeName | 'light' | 'dark' = 'dark'): Theme {
  return scheme === 'light' ? lightTheme : darkTheme;
}

/**
 * Subscribe to the system color scheme and return the active theme.
 * The component re-renders when the user toggles dark/light at the OS level.
 */
export function useColors(): Theme {
  const scheme = Appearance.getColorScheme();
  return useMemo(() => getTheme(scheme ?? 'dark'), [scheme]);
}

// ────────────────────────────────────────────────────────────────────────────
// Legacy compatibility — re-export the old `COLORS` shape so existing
// imports keep compiling during migration. Mapped to the *dark*-mode
// semantic palette (the surfaces these constants drive are dark today).
// New code should import `useColors()` instead.
// ────────────────────────────────────────────────────────────────────────────
export const COLORS = {
  BG_DEEP: darkColors.bg,
  BG_SURFACE: darkColors.bgRaised,
  GRADIENT_START: palette.teal[800],
  GRADIENT_END: palette.teal[400],
  ACCENT: darkColors.brand,
  TEXT_PRIMARY: darkColors.fg,
  TEXT_SECONDARY: darkColors.fgMuted,
  TEXT_TERTIARY: darkColors.fgSubtle,
  CARD_BG: 'rgba(255,255,255,0.06)',
  CARD_BORDER: 'rgba(255,255,255,0.10)',
} as const;
