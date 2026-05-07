import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { HeroDusk, LogoMark } from '@/components/brand';
import { Button, Eyebrow, Text } from '@/components/ui';
import { fontFamily, palette, spacing } from '@/lib/theme';
import { useAuth } from '@/features/auth/useAuth';

/**
 * Login — full-bleed dusk hero with the brand logomark, an editorial
 * Fraunces headline, and a single primary CTA. Secondary action drops
 * the user into a public preview if Quran Foundation auth fails.
 */
export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const busy = isLoading || isSigningIn;

  const handleLogin = useCallback(async () => {
    if (busy) return;
    setIsSigningIn(true);
    try {
      await login();
    } finally {
      setIsSigningIn(false);
    }
  }, [login, busy]);

  return (
    <HeroDusk style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoArea}>
          <LogoMark size={72} />
          <Text style={styles.appName} color={palette.ink[0]}>
            VerseTale
          </Text>
          <Eyebrow color="rgba(255,255,255,0.7)">One story · one day · one verse</Eyebrow>
        </View>

        <View style={styles.cta}>
          <Text style={styles.heading} color={palette.ink[0]}>
            Begin your journey.
          </Text>
          <Text style={styles.subheading} color="rgba(236,239,242,0.78)">
            Sign in with your Quran Foundation account to keep your progress, reflections, and
            reading streak across devices.
          </Text>

          <Button
            variant="onDark"
            size="lg"
            fullWidth
            loading={busy}
            onPress={handleLogin}
            style={styles.primaryBtn}
          >
            Continue with Quran Foundation
          </Button>
        </View>
      </View>
    </HeroDusk>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 88,
    paddingBottom: 56,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  logoArea: {
    gap: spacing[3],
    alignItems: 'flex-start',
  },
  appName: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -0.76,
    marginTop: spacing[2],
  },
  cta: {
    gap: spacing[3],
  },
  heading: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.56,
  },
  subheading: {
    fontFamily: fontFamily.display,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing[2],
  },
  primaryBtn: {
    marginTop: spacing[2],
  },
});
