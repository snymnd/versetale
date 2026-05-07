import Svg, { Line, Path } from 'react-native-svg';

interface DividerProps {
  width?: number;
  height?: number;
  color?: string;
}

/**
 * Chapter-break divider — two hairlines flanking a centered diamond. Use
 * between narrative setup and the first verse, or between major sections.
 */
export function Divider({ width = 200, height = 12, color = 'currentColor' }: DividerProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 200 12" fill="none">
      <Line x1={0} y1={6} x2={88} y2={6} stroke={color} strokeWidth={0.8} opacity={0.6} />
      <Path d="M100 2 L104 6 L100 10 L96 6 Z" fill={color} opacity={0.7} />
      <Line x1={112} y1={6} x2={200} y2={6} stroke={color} strokeWidth={0.8} opacity={0.6} />
    </Svg>
  );
}
