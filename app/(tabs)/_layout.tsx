import { Tabs, router } from 'expo-router';
import { useEffect } from 'react';
import { BookOpen, User } from 'lucide-react-native';

import { COLORS } from '@/lib/constants';
import { useAuthStore } from '@/features/auth/authStore';

export default function TabsLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading || !isAuthenticated) return null;

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
