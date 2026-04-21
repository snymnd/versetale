import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/lib/constants';
import { useAuth } from '@/features/auth/useAuth';
import { useAuthStore } from '@/features/auth/authStore';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();

  const handleLogin = useCallback(async () => {
    await login();
    if (useAuthStore.getState().isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [login]);

  return (
    <LinearGradient
      colors={[COLORS.BG_DEEP, COLORS.BG_SURFACE]}
      style={styles.container}
    >
      {/* Decorative accent blob */}
      <View style={styles.accentBlob} />

      <View style={styles.content}>
        <View style={styles.logoArea}>
          <Text style={styles.appName}>VerseTale</Text>
          <Text style={styles.tagline}>One Story. One Day. One Verse.</Text>
        </View>

        <View style={styles.cta}>
          <Text style={styles.heading}>Begin your journey</Text>
          <Text style={styles.subheading}>
            Sign in with your Quran Foundation account to track your progress across all journeys.
          </Text>

          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            style={({ pressed }) => [styles.signInBtn, pressed && styles.signInBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Sign in to VerseTale"
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.BG_DEEP} />
            ) : (
              <Text style={styles.signInText}>Sign in with Quran Foundation</Text>
            )}
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 56,
  },
  accentBlob: {
    position: 'absolute',
    top: -60,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(20,184,166,0.07)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoArea: {
    gap: 8,
  },
  appName: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -1.5,
  },
  tagline: {
    fontSize: 15,
    color: COLORS.ACCENT,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  cta: {
    gap: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
  },
  signInBtn: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  signInBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  signInText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.BG_DEEP,
    letterSpacing: 0.1,
  },
});
