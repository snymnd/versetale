import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { motion, palette, useColors } from '@/lib/theme';
import { useAuthStore } from '@/features/auth/authStore';

WebBrowser.maybeCompleteAuthSession();

/**
 * OAuth callback landing — the deep link returns here after the QF
 * authorization sheet closes. Once the auth store flips to authenticated,
 * redirect into the tabs.
 */
export default function AuthCallback() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { colors } = useColors();

  const rotation = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: motion.duration.base,
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
    if (isAuthenticated) router.replace('/(tabs)');
  }, [isAuthenticated]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Animated.View style={{ opacity, alignItems: 'center', gap: 16 }}>
        <Animated.View
          style={[
            styles.spinner,
            {
              borderColor: 'rgba(31,122,132,0.2)',
              borderTopColor: colors.brand,
              transform: [{ rotate: spin }],
            },
          ]}
        />
        <Text variant="caption" tone="muted">
          Signing you in…
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.ink[950],
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
  },
});
