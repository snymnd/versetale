import Svg, { Circle, G, Path } from 'react-native-svg';

interface OrnamentStarProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * 8-point geometric star — VerseTale's brand ornament. Two nested star
 * outlines plus a center dot. Use only for chapter breaks and achievement
 * moments; never as decorative UI chrome.
 */
export function OrnamentStar({
  size = 28,
  color = 'currentColor',
  strokeWidth = 1.2,
}: OrnamentStarProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <G stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinejoin="round">
        <Path d="M24 4 L28.5 19.5 L44 24 L28.5 28.5 L24 44 L19.5 28.5 L4 24 L19.5 19.5 Z" />
        <Path d="M24 10 L27 21 L38 24 L27 27 L24 38 L21 27 L10 24 L21 21 Z" />
        <Circle cx={24} cy={24} r={1.2} fill={color} stroke="none" />
      </G>
    </Svg>
  );
}
