import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { palette } from '@/lib/theme';

interface StreakFlameProps {
  size?: number;
  /** Override the default Lantern Amber gradient. */
  startColor?: string;
  endColor?: string;
}

/**
 * Streak flame — Lantern Amber gradient. Reserved exclusively for the
 * streak badge and achievement moments. Never a generic icon.
 */
export function StreakFlame({
  size = 16,
  startColor = palette.amber[300],
  endColor = palette.amber[500],
}: StreakFlameProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="vt-flame" x1={12} y1={2} x2={12} y2={22} gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor={startColor} />
          <Stop offset={1} stopColor={endColor} />
        </LinearGradient>
      </Defs>
      <Path
        d="M12 2 C 14 6, 18 8, 18 13 C 18 17.5, 15 21, 12 21 C 9 21, 6 17.5, 6 13 C 6 10, 8 9, 9 7 C 10 9, 10 11, 11 12 C 11 9, 11 5, 12 2 Z"
        fill="url(#vt-flame)"
      />
    </Svg>
  );
}
