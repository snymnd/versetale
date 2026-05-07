import { router, Stack } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LogoMark } from '@/components/brand';
import { Button, Text } from '@/components/ui';
import { fontFamily, palette, useColors } from '@/lib/theme';

/**
 * Navbar shown at the top of public screens that opt in via `headerShown: true`.
 */
function PublicNavbar() {
  const insets = useSafeAreaInsets();
  const { colors } = useColors();

  return (
    <View
      style={[
        styles.navbar,
        { paddingTop: insets.top, backgroundColor: colors.bg, borderBottomColor: colors.border },
      ]}
    >
      <View style={styles.navbarInner}>
        <Pressable
          onPress={() => router.push('/')}
          accessibilityRole="link"
          accessibilityLabel="VerseTale home"
          style={styles.logoRow}
        >
          <LogoMark size={24} />
          <Text style={[styles.wordmark, { color: colors.fg }]}>VerseTale</Text>
        </Pressable>

        <Button variant="soft" size="sm" onPress={() => router.push('/(auth)/login')}>
          Sign in
        </Button>
      </View>
    </View>
  );
}

/**
 * Public route group layout — unauthenticated browsing. No tab bar.
 */
export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.ink[950] },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="journeys"
        options={{ headerShown: true, header: () => <PublicNavbar /> }}
      />
      <Stack.Screen
        name="journey/[journeyId]"
        options={{ headerShown: true, header: () => <PublicNavbar /> }}
      />
      <Stack.Screen name="read/[journeyId]/[questId]" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  navbar: {
    borderBottomWidth: 1,
  },
  navbarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordmark: {
    fontFamily: fontFamily.displaySemiBold,
    fontSize: 18,
    letterSpacing: -0.36,
  },
});
