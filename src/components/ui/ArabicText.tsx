import { Text, TextProps, StyleSheet } from 'react-native';

import { COLORS } from '@/lib/constants';

interface ArabicTextProps extends TextProps {
  children: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_MAP = {
  sm: 16,
  md: 22,
  lg: 28,
  xl: 36,
} as const;

/**
 * Renders Arabic text with the AmiriQuran font loaded via expo-font.
 * Always RTL writing direction.
 */
export function ArabicText({ children, size = 'md', style, ...props }: ArabicTextProps) {
  return (
    <Text
      style={[
        styles.base,
        { fontSize: SIZE_MAP[size] },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'AmiriQuran',
    color: COLORS.TEXT_PRIMARY,
    writingDirection: 'rtl',
    textAlign: 'right',
    lineHeight: 40,
  },
});
