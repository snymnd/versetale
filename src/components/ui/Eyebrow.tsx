import type { ComponentProps } from 'react';

import { Text } from './Text';

type EyebrowProps = Omit<ComponentProps<typeof Text>, 'variant'>;

/**
 * Tiny uppercase label used above titles and section headers. Inter 11px
 * semibold with 0.12em tracking — never use it in body copy.
 */
export function Eyebrow(props: EyebrowProps) {
  return <Text variant="eyebrow" tone="muted" {...props} />;
}
