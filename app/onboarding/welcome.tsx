import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArabicText } from '@/components/ui/ArabicText';
import { COLORS } from '@/lib/constants';

/**
 * Onboarding step 1 — brand introduction with editorial layout.
 * Dark luxury: tight typography, teal accent, deep gradient card.
 */
export default function WelcomeScreen() {
  const handleContinue = useCallback(() => {
    router.push('/onboarding/how-it-works');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Atmospheric top gradient card */}
      <LinearGradient
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroInner}>
          <ArabicText size="xl" style={styles.heroArabic}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </ArabicText>
          <View style={styles.heroAccentLine} />
          <Text style={styles.heroCaption}>In the name of God, the Most Gracious, the Most Merciful</Text>
        </View>
      </LinearGradient>

      {/* Main copy */}
      <View style={styles.body}>
        <View style={styles.titleGroup}>
          <Text style={styles.appName}>VerseTale</Text>
          <Text style={styles.tagline}>One Story. One Day. One Verse.</Text>
        </View>

        <Text style={styles.description}>
          The Quran is not a book to be finished — it is a companion to be walked with. VerseTale
          turns its greatest narratives into day-by-day journeys, one verse at a time.
        </Text>

        <View style={styles.pillRow}>
          {['Story-led', 'Reflective', 'Daily'].map((tag) => (
            <View key={tag} style={styles.pill}>
              <Text style={styles.pillText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [styles.ctaBtn, pressed && styles.ctaBtnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Get started with VerseTale"
        >
          <Text style={styles.ctaText}>Get started</Text>
        </Pressable>

        <Text style={styles.stepIndicator}>1 of 3</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DEEP,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  heroCard: {
    borderRadius: 20,
    marginTop: 16,
    marginBottom: 32,
    overflow: 'hidden',
  },
  heroInner: {
    padding: 28,
    gap: 14,
    alignItems: 'flex-end',
  },
  heroArabic: {
    textAlign: 'right',
  },
  heroAccentLine: {
    width: 48,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
  },
  heroCaption: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  body: {
    flex: 1,
    gap: 20,
  },
  titleGroup: {
    gap: 6,
  },
  appName: {
    fontSize: 44,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -2,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.ACCENT,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 25,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    backgroundColor: 'rgba(20,184,166,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(20,184,166,0.3)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.ACCENT,
    letterSpacing: 0.3,
  },
  footer: {
    gap: 16,
    alignItems: 'center',
  },
  ctaBtn: {
    width: '100%',
    backgroundColor: COLORS.ACCENT,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.BG_DEEP,
    letterSpacing: 0.2,
  },
  stepIndicator: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
    fontWeight: '500',
  },
});
