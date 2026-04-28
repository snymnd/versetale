import { Redirect, Tabs } from 'expo-router';
import { BookOpen, User } from 'lucide-react-native';

import { COLORS } from '@/lib/constants';
import { useAuthStore } from '@/features/auth/authStore';

export default function TabsLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return null;
  // Redirect outside the (tabs) group explicitly. Using "/" is ambiguous
  // (both app/index.tsx and app/(tabs)/index.tsx map to "/") and can resolve
  // back into this group, causing an infinite redirect loop on logout.
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111827',
          borderTopColor: COLORS.CARD_BORDER,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: COLORS.ACCENT,
        tabBarInactiveTintColor: COLORS.TEXT_TERTIARY,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Journeys',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
      {/* Hide nested detail screens from the tab bar */}
      <Tabs.Screen name="journey/[journeyId]" options={{ href: null }} />
      <Tabs.Screen name="reader/[journeyId]/[questId]" options={{ href: null }} />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
