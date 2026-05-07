import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Text } from '@/components/ui';
import { spacing, useColors } from '@/lib/theme';

/**
 * SoftLoginBanner — slim strip prompting unauthenticated visitors to sign
 * in for progress tracking. Dismissible via the close icon (local state
 * only, does not persist).
 */
export function SoftLoginBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { colors } = useColors();

  if (dismissed) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.brandSoft,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={[styles.accentBar, { backgroundColor: colors.brand }]} />
      <Text variant="caption" tone="brand" style={styles.message} numberOfLines={1}>
        Sign in to save your progress & reflections.
      </Text>
      <Button variant="primary" size="sm" onPress={() => router.push('/(auth)/login')}>
        Sign in
      </Button>
      <Pressable
        onPress={() => setDismissed(true)}
        accessibilityRole="button"
        accessibilityLabel="Dismiss banner"
        hitSlop={8}
        style={[styles.dismissBtn, { backgroundColor: colors.bgSunken }]}
      >
        <X size={12} color={colors.fgMuted} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingRight: spacing[3],
    gap: 10,
    borderBottomWidth: 1,
  },
  accentBar: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  message: {
    flex: 1,
    fontSize: 13,
    paddingLeft: spacing[2],
  },
  dismissBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
});
