import { BlurView } from 'expo-blur';
import { Redirect, Tabs } from 'expo-router';
import { BookOpen, User } from 'lucide-react-native';
import { Platform, StyleSheet, View } from 'react-native';

import { fontFamily, palette, useColors } from '@/lib/theme';
import { useAuthStore } from '@/features/auth/authStore';

/**
 * Floating frosted-glass tab bar — sits inside a rounded pill above the
 * screen content so the page peeks beneath it. iOS uses `BlurView`
 * (intensity 60); Android falls back to a translucent ink-900 surface
 * because backdrop-filter is unreliable across OEMs.
 */
function TabBarBackground() {
  const { colors, scheme } = useColors();
  const isDark = scheme === 'dark';

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={60}
        tint={isDark ? 'dark' : 'light'}
        style={[
          styles.tabBarFill,
          {
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)',
            backgroundColor: isDark ? 'rgba(15,22,28,0.55)' : 'rgba(255,255,255,0.6)',
          },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.tabBarFill,
        {
          borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)',
          backgroundColor: isDark ? 'rgba(15,22,28,0.92)' : 'rgba(255,255,255,0.92)',
        },
      ]}
    />
  );
}

export default function TabsLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const { colors, scheme } = useColors();

  if (isLoading) return null;
  // Redirect outside the (tabs) group explicitly. Using "/" is ambiguous
  // (both app/index.tsx and app/(tabs)/index.tsx map to "/") and can resolve
  // back into this group, causing an infinite redirect loop on logout.
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  const activeTint = scheme === 'dark' ? palette.teal[300] : palette.teal[700];
  const inactiveTint = colors.fgMuted;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: 14,
          borderRadius: 24,
          height: 64,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 0,
          shadowColor: palette.teal[800],
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.18,
          shadowRadius: 16,
          paddingTop: 8,
          paddingBottom: 6,
          paddingHorizontal: 6,
        },
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarLabelStyle: {
          fontFamily: fontFamily.sansMedium,
          fontSize: 10,
          letterSpacing: 0.2,
          marginTop: 2,
        },
        tabBarItemStyle: {
          marginHorizontal: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <BookOpen color={color} size={22} strokeWidth={focused ? 2 : 1.75} />
          ),
        }}
      />
      {/* Hide nested detail screens from the tab bar */}
      <Tabs.Screen name="journey/[journeyId]" options={{ href: null }} />
      {/* Reader is a focus surface — the floating tab pill would cover the
          MiniAudioPlayer (both are position: absolute at the bottom), so hide
          the tab bar entirely while reading. */}
      <Tabs.Screen
        name="reader/[journeyId]/[questId]"
        options={{ href: null, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <User color={color} size={22} strokeWidth={focused ? 2 : 1.75} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
