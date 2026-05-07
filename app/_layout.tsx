import {
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { asyncStoragePersister, queryClient } from '@/lib/queryClient';
import { palette } from '@/lib/theme';
import { useAuthStore } from '@/features/auth/authStore';

// Keep the splash screen visible until fonts and session are ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const restoreSession = useAuthStore((s) => s.restoreSession);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [fontsLoaded, fontError] = useFonts({
    AmiriQuran: require('../assets/fonts/AmiriQuran.ttf'),
    // Display serif — narrative titles, journey names, reading body.
    Fraunces: Fraunces_400Regular,
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    // Humanist sans — UI, nav, buttons, metadata.
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    // Mono — verse refs, day counters, timers only.
    JetBrainsMono_500Medium,
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
          <StatusBar style="light" backgroundColor={palette.ink[950]} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: palette.ink[950] },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(public)" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="reflection/[journeyId]/[questId]" />
            <Stack.Screen name="auth/callback" />
          </Stack>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
