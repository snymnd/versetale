import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

interface LogoMarkProps {
  size?: number;
}

/**
 * VerseTale logo mark — mint crescent cradling cascading manuscript pages
 * (teal → indigo gradient). Use ≥ 24px. Per the design handoff this is
 * the user-supplied logo.
 */
export function LogoMark({ size = 96 }: LogoMarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <Defs>
        <LinearGradient id="vt-pages" x1={38} y1={28} x2={76} y2={68} gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor="#6CC9C9" />
          <Stop offset={0.55} stopColor="#4F8FD9" />
          <Stop offset={1} stopColor="#3F66E0" />
        </LinearGradient>
      </Defs>
      <Path
        d="M48 8 a 40 40 0 1 0 28 68 a 32 32 0 1 1 -22 -56 a 40 40 0 0 0 -6 -12 z"
        fill="#6BC9A8"
      />
      <Path
        d="M58 22 h 18 a 4 4 0 0 1 4 4 v 22 a 4 4 0 0 1 -4 4 h -10 l -8 6 v -6 h 0 a 4 4 0 0 1 -4 -4 v -22 a 4 4 0 0 1 4 -4 z"
        fill="url(#vt-pages)"
        opacity={0.85}
      />
      <Path
        d="M48 32 h 18 a 4 4 0 0 1 4 4 v 22 a 4 4 0 0 1 -4 4 h -10 l -8 6 v -6 a 4 4 0 0 1 -4 -4 v -22 a 4 4 0 0 1 4 -4 z"
        fill="url(#vt-pages)"
      />
      <Path
        d="M38 42 h 16 a 4 4 0 0 1 4 4 v 20 a 4 4 0 0 1 -4 4 h -8 l -8 6 v -6 a 4 4 0 0 1 -4 -4 v -20 a 4 4 0 0 1 4 -4 z"
        fill="url(#vt-pages)"
        opacity={0.95}
      />
    </Svg>
  );
}
