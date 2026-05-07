import type { TextProps } from 'react-native';

import { Text } from './Text';

/**
 * Tiny uppercase label used above titles and section headers. Inter 11px
 * semibold with 0.12em tracking — never use it in body copy.
 */
export function Eyebrow(props: TextProps) {
  return <Text variant="eyebrow" tone="muted" {...props} />;
}
