import { router, Stack } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@/lib/constants';

/**
 * Navbar shown at the top of public screens that opt in via `headerShown: true`.
 * Rendered as the Stack's custom header component.
 */
function PublicNavbar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.navbar, { paddingTop: insets.top }]}>
      <View style={styles.navbarInner}>
        <Pressable
          onPress={() => router.push('/')}
          accessibilityRole="link"
          accessibilityLabel="VerseTale home"
        >
          <Text style={styles.wordmark}>VerseTale</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/(auth)/login')}
          accessibilityRole="button"
          accessibilityLabel="Sign in"
          style={({ pressed }) => [styles.signInBtn, pressed && styles.signInBtnPressed]}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Public route group layout — unauthenticated browsing.
 * No tab bar. Screens that set `headerShown: true` will render the public navbar.
 */
export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.BG_DEEP },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="journeys"
        options={{
          headerShown: true,
          header: () => <PublicNavbar />,
        }}
      />
      <Stack.Screen
        name="journey/[journeyId]"
        options={{
          headerShown: true,
          header: () => <PublicNavbar />,
        }}
      />
      <Stack.Screen
        name="read/[journeyId]/[questId]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: COLORS.BG_DEEP,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.CARD_BORDER,
  },
  navbarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 52,
  },
  wordmark: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  signInBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: 'rgba(20,184,166,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(20,184,166,0.35)',
    borderRadius: 20,
  },
  signInBtnPressed: {
    backgroundColor: 'rgba(20,184,166,0.2)',
  },
  signInText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.ACCENT,
    letterSpacing: 0.1,
  },
});
