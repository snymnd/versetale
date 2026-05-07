import { Redirect, router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeroDusk, LogoMark, OrnamentStar } from '@/components/brand';
import { Button, Card, Eyebrow, Text } from '@/components/ui';
import { fontFamily, palette, radii, spacing, useColors } from '@/lib/theme';
import { useAuthStore } from '@/features/auth/authStore';

const HIGHLIGHTS = [
  { eyebrow: '01 · Story', title: 'Narrative arcs', body: 'Read each Sūrah the way it speaks — as a story, not a syllabus.' },
  { eyebrow: '02 · Practice', title: 'Ten-minute days', body: 'Five to ten verses, a translation, a single question.' },
  { eyebrow: '03 · Reflection', title: 'Your own voice', body: 'Write back to the verse. Your reflections stay private to you.' },
];

/**
 * Public landing — web-first marketing surface, also the entry route on
 * mobile. Dusk hero with the brand mark, an editorial Fraunces headline,
 * a three-up feature stack, and a primary CTA into the public catalog.
 */
export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const { colors } = useColors();

  if (isLoading) return null;
  if (isAuthenticated) return <Redirect href="/(tabs)" />;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.bg }]}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 48 }]}
      showsVerticalScrollIndicator={false}
    >
      <HeroDusk style={styles.hero}>
        <View
          style={[
            styles.heroInner,
            { paddingTop: insets.top + spacing[5] },
          ]}
        >
          <View style={styles.topNav}>
            <View style={styles.logoRow}>
              <LogoMark size={28} />
              <Text style={styles.wordmark} color={palette.ink[0]}>
                VerseTale
              </Text>
            </View>
            <Button variant="onDark" size="sm" onPress={() => router.push('/(auth)/login')}>
              Sign in
            </Button>
          </View>

          <View style={styles.headlineGroup}>
            <View style={styles.heroOrnament}>
              <OrnamentStar size={28} color={palette.amber[300]} />
            </View>
            <Text style={styles.headline} color={palette.ink[0]}>
              The Qur'ān, told as story.
            </Text>
            <Text style={styles.subhead} color="rgba(236,239,242,0.78)">
              Ten minutes a day, one narrative arc at a time. VerseTale walks you through the
              Qisas of the Qur'ān — verse by verse, in the company of a thoughtful friend.
            </Text>

            <View style={styles.heroCtaRow}>
              <Button
                variant="onDark"
                size="lg"
                onPress={() => router.push('/(public)/journeys')}
              >
                Browse journeys
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onPress={() => router.push('/(auth)/login')}
              >
                Sign in
              </Button>
            </View>
          </View>
        </View>
      </HeroDusk>

      <View style={styles.featuresWrap}>
        {HIGHLIGHTS.map((h) => (
          <Card key={h.title} padding={spacing[5]} style={styles.featureCard}>
            <Eyebrow style={styles.featureEyebrow}>{h.eyebrow}</Eyebrow>
            <Text style={[styles.featureTitle, { color: colors.fg }]}>{h.title}</Text>
            <Text variant="read" tone="muted" style={styles.featureBody}>
              {h.body}
            </Text>
          </Card>
        ))}
      </View>

      <View style={styles.footer}>
        <Text variant="meta" tone="subtle">
          Built for the verse-by-verse reader. Made with care.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  contentContainer: {
    maxWidth: 720,
    alignSelf: 'center',
    width: '100%',
  },

  hero: {
    paddingBottom: spacing[10],
    borderBottomLeftRadius: radii['2xl'],
    borderBottomRightRadius: radii['2xl'],
    overflow: 'hidden',
  },
  heroInner: {
    paddingHorizontal: 24,
    paddingTop: 28,
    gap: spacing[10],
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wordmark: {
    fontFamily: fontFamily.displaySemiBold,
    fontSize: 18,
    letterSpacing: -0.36,
  },

  headlineGroup: {
    gap: spacing[3],
    paddingTop: spacing[6],
  },
  heroOrnament: {
    marginBottom: spacing[2],
  },
  headline: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -0.76,
  },
  subhead: {
    fontFamily: fontFamily.display,
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 480,
  },
  heroCtaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: spacing[4],
    flexWrap: 'wrap',
  },

  featuresWrap: {
    paddingHorizontal: 20,
    paddingTop: spacing[8],
    gap: spacing[3],
  },
  featureCard: {
    gap: 6,
  },
  featureEyebrow: {
    marginBottom: 4,
  },
  featureTitle: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.44,
  },
  featureBody: {
    fontSize: 15,
    lineHeight: 23,
    marginTop: 2,
  },

  footer: {
    paddingHorizontal: 24,
    paddingTop: spacing[8],
    alignItems: 'center',
  },
});
