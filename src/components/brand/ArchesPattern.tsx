import Svg, { Circle, Defs, G, Path, Pattern, Rect } from 'react-native-svg';

interface ArchesPatternProps {
  /** Total render size of the SVG (the pattern repeats inside it). */
  width?: number | string;
  height?: number | string;
  /** Single tile size. The repeating mihrab arch fits a 120×120 tile. */
  tileSize?: number;
  color?: string;
  opacity?: number;
}

/**
 * Mihrab-arch lattice — a subliminal Islamic-architecture motif used as
 * an overlay on hero gradients. Spec calls for 4–6% opacity; never higher.
 *
 * Mount inside a parent with `position: absolute` and `inset: 0`. Pair
 * with `overflow: hidden` so the pattern doesn't bleed past corners.
 */
export function ArchesPattern({
  width = '100%',
  height = '100%',
  tileSize = 120,
  color = '#FFFFFF',
  opacity = 0.06,
}: ArchesPatternProps) {
  return (
    <Svg width={width} height={height} opacity={opacity}>
      <Defs>
        <Pattern
          id="vt-arches"
          patternUnits="userSpaceOnUse"
          width={tileSize}
          height={tileSize}
          viewBox="0 0 120 120"
        >
          <G stroke={color} strokeWidth={0.8} fill="none">
            <Path d="M0 80 C 0 45, 60 45, 60 80 C 60 45, 120 45, 120 80" />
            <Path d="M-60 80 C -60 45, 0 45, 0 80 C 0 45, 60 45, 60 80" />
            <Path d="M60 80 C 60 45, 120 45, 120 80 C 120 45, 180 45, 180 80" />
            <Circle cx={0} cy={80} r={1} fill={color} />
            <Circle cx={60} cy={80} r={1} fill={color} />
            <Circle cx={120} cy={80} r={1} fill={color} />
          </G>
        </Pattern>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill="url(#vt-arches)" />
    </Svg>
  );
}
