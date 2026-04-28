import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '@/features/auth/authStore';
import { COLORS } from '@/lib/constants';

const result = WebBrowser.maybeCompleteAuthSession();
console.log('[auth/callback] maybeCompleteAuthSession result:', result);

export default function AuthCallback() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const rotation = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [opacity, rotation]);

  useEffect(() => {
    console.log('[auth/callback] isAuthenticated changed:', isAuthenticated);
    if (isAuthenticated) {
      console.log('[auth/callback] navigating to /(tabs)');
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity }}>
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
        <Text style={styles.label}>Signing you in…</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DEEP,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(20,184,166,0.2)',
    borderTopColor: COLORS.ACCENT,
    alignSelf: 'center',
  },
  label: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 15,
    letterSpacing: 0.2,
    textAlign: 'center',
    marginTop: 4,
  },
});
