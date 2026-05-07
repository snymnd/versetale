import { router } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { HeroDusk, OrnamentStar } from '@/components/brand';
import { Button, Text } from '@/components/ui';
import { fontFamily, palette, spacing } from '@/lib/theme';

/**
 * Onboarding step 1 — full-bleed dusk hero with the headline set in
 * Fraunces 38/400 and a quietly literary subtitle. Brand mark replaces
 * the previous Arabic banner so the user-supplied logo carries here.
 */
export default function WelcomeScreen() {
  const handleContinue = useCallback(() => {
    router.push('/onboarding/how-it-works');
  }, []);

  return (
    <HeroDusk style={styles.container}>
      <View style={styles.body}>
        <View style={styles.headlineGroup}>
          <View style={styles.ornamentRow}>
            <OrnamentStar size={36} color={palette.amber[300]} />
          </View>
          <Text style={styles.headline} color={palette.ink[0]}>
            The Qur'ān, told as story.
          </Text>
          <Text style={styles.subhead} color="rgba(236,239,242,0.78)">
            Ten minutes a day. One narrative arc at a time. Read at the pace of a thoughtful
            companion.
          </Text>
        </View>

        <View style={styles.footer}>
          <Button variant="primary" size="lg" fullWidth onPress={handleContinue}>
            Begin
          </Button>
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
      </View>
    </HeroDusk>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  headlineGroup: {
    alignItems: 'center',
  },
  ornamentRow: {
    marginBottom: spacing[5],
    opacity: 0.92,
  },
  headline: {
    fontFamily: fontFamily.display,
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -0.76,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  subhead: {
    fontFamily: fontFamily.display,
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
    maxWidth: 320,
    alignSelf: 'center',
  },
  footer: {
    gap: spacing[6],
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#FFFFFF',
  },
});
