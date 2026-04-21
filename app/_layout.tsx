import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { asyncStoragePersister, queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/features/auth/authStore';

// Keep the splash screen visible until fonts and session are ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const restoreSession = useAuthStore((s) => s.restoreSession);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [fontsLoaded, fontError] = useFonts({
    AmiriQuran: require('../assets/fonts/AmiriQuran.ttf'),
  });

  // Restore persisted auth session on first mount
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Hide splash once fonts are ready and session restore is complete
  useEffect(() => {
    if ((fontsLoaded || fontError) && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isLoading]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
          <StatusBar style="light" backgroundColor="#0A0F1E" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A0F1E' } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(public)" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="reflection/[journeyId]/[questId]" />
          </Stack>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
