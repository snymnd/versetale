import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@/lib/constants';
import { useAuthStore } from '@/features/auth/authStore';
import { useQuestProgressStore } from '@/features/journeys/journeyStore';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const progress = useQuestProgressStore((s) => s.progress);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const journeyCount = Object.keys(progress).length;

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) {
      console.log('[profile] logout already in progress — ignoring tap');
      return;
    }
    console.log('[profile] signing out…');
    setIsLoggingOut(true);
    try {
      await logout();
      console.log('[profile] logout complete — redirect will fire from tabs layout');
    } catch (err) {
      console.error('[profile] logout failed:', err);
    } finally {
      // Always clear busy state. Even if the tabs-layout redirect fires and
      // unmounts us, setting state on an unmounting component is a no-op.
      // If the redirect is delayed for any reason, this prevents a stuck spinner.
      setIsLoggingOut(false);
    }
  }, [logout, isLoggingOut]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Avatar + name */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name ?? 'VerseTale User'}</Text>
        {user?.email ? <Text style={styles.userEmail}>{user.email}</Text> : null}
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{journeyCount}</Text>
          <Text style={styles.statLabel}>Journeys started</Text>
        </View>
      </View>

      {/* Sign out */}
      <Pressable
        onPress={handleLogout}
        disabled={isLoggingOut}
        style={({ pressed }) => [
          styles.logoutBtn,
          pressed && !isLoggingOut && styles.logoutBtnPressed,
          isLoggingOut && styles.logoutBtnDisabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
        accessibilityState={{ busy: isLoggingOut, disabled: isLoggingOut }}
      >
        {isLoggingOut ? (
          <View style={styles.logoutBusyRow}>
            <ActivityIndicator color="#EF4444" size="small" />
            <Text style={styles.logoutText}>Signing out…</Text>
          </View>
        ) : (
          <Text style={styles.logoutText}>Sign out</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DEEP,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -1,
  },
  avatarSection: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.BG_DEEP,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.CARD_BG,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.35)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.08)',
  },
  logoutBtnPressed: {
    opacity: 0.75,
  },
  logoutBtnDisabled: {
    opacity: 0.6,
  },
  logoutBusyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
});
