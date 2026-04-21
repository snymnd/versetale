import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/lib/constants';

/**
 * SoftLoginBanner — a slim horizontal strip prompting unauthenticated users to sign in.
 * Dismissible via the X button (local state, does not persist across navigation).
 * Designed to be placed at the top of a screen or pinned above a player bar.
 */
export function SoftLoginBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <View style={styles.container}>
      <View style={styles.accentBar} />
      <Text style={styles.message} numberOfLines={1}>
        Sign in to save your progress &amp; notes
      </Text>
      <Pressable
        onPress={() => router.push('/(auth)/login')}
        accessibilityRole="button"
        accessibilityLabel="Sign in"
        style={({ pressed }) => [styles.signInBtn, pressed && styles.signInBtnPressed]}
      >
        <Text style={styles.signInText}>Sign In</Text>
      </Pressable>
      <Pressable
        onPress={() => setDismissed(true)}
        accessibilityRole="button"
        accessibilityLabel="Dismiss banner"
        style={({ pressed }) => [styles.dismissBtn, pressed && styles.dismissBtnPressed]}
      >
        <Text style={styles.dismissIcon}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BG_SURFACE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.CARD_BORDER,
    paddingVertical: 10,
    paddingRight: 12,
    gap: 10,
  },
  accentBar: {
    width: 3,
    alignSelf: 'stretch',
    backgroundColor: COLORS.ACCENT,
    borderRadius: 2,
    marginLeft: 0,
  },
  message: {
    flex: 1,
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    paddingLeft: 10,
  },
  signInBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: COLORS.ACCENT,
    borderRadius: 20,
  },
  signInBtnPressed: {
    opacity: 0.82,
  },
  signInText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A0F1E',
    letterSpacing: 0.2,
  },
  dismissBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  dismissBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  dismissIcon: {
    fontSize: 11,
    color: COLORS.TEXT_TERTIARY,
    fontWeight: '600',
  },
});
