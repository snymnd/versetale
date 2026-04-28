import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@/lib/constants';
import { useAuthStore } from '@/features/auth/authStore';

/**
 * Public landing page — web-first marketing surface.
 * Dark luxury direction: deep navy background, teal accent, editorial type scale.
 * Works on both web and mobile.
 */
export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return null;
  if (isAuthenticated) return <Redirect href="/(tabs)" />;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Top nav row */}
      <View style={styles.topNav}>
        <Text style={styles.wordmark}>VerseTale</Text>
        <Pressable
          onPress={() => router.push('/(auth)/login')}
          accessibilityRole="button"
          accessibilityLabel="Sign in"
          style={({ pressed }) => [styles.navSignInBtn, pressed && styles.navSignInBtnPressed]}
        >
          <Text style={styles.navSignInText}>Sign In</Text>
        </Pressable>
      </View>

      {/* Decorative Arabic card */}
      <View style={styles.arabicCardWrapper}>
        <LinearGradient
          colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.arabicCard}
        >
          <View style={styles.arabicCardOverlay} />
          <Text style={styles.arabicDecorative} accessibilityLanguage="ar">
            بِسْمِ ٱللَّٰهِ
          </Text>
          <Text style={styles.arabicCardCaption}>In the name of God</Text>
        </LinearGradient>
      </View>

      {/* Hero text block */}
      <View style={styles.heroBlock}>
        <Text style={styles.heroTitle}>VerseTale</Text>
        <Text style={styles.heroTagline}>One Story. One Day. One Verse.</Text>
        <Text style={styles.heroDescription}>
          VerseTale guides you through the Quran one story at a time. Each journey breaks a
          prophetic narrative into daily quests — a single verse, its translation, and a moment
          to reflect. No shortcuts. No overload. Just depth.
        </Text>
      </View>

      {/* CTA buttons */}
      <View style={styles.ctaRow}>
        <Pressable
          onPress={() => router.push('/(public)/journeys')}
          accessibilityRole="button"
          accessibilityLabel="Browse journeys"
          style={({ pressed }) => [styles.ctaPrimary, pressed && styles.ctaPrimaryPressed]}
        >
          <Text style={styles.ctaPrimaryText}>Browse Journeys</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/(auth)/login')}
          accessibilityRole="button"
          accessibilityLabel="Sign in"
          style={({ pressed }) => [styles.ctaSecondary, pressed && styles.ctaSecondaryPressed]}
        >
          <Text style={styles.ctaSecondaryText}>Sign In</Text>
        </Pressable>
      </View>

      {/* Feature highlights */}
      <View style={styles.featuresGrid}>
        <FeatureChip icon="📖" label="Story-driven journeys" />
        <FeatureChip icon="🎙️" label="Recitation audio" />
        <FeatureChip icon="🌙" label="Daily quests" />
        <FeatureChip icon="✍️" label="Personal reflections" />
      </View>
    </ScrollView>
  );
}

interface FeatureChipProps {
  icon: string;
  label: string;
}

function FeatureChip({ icon, label }: FeatureChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipIcon}>{icon}</Text>
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: COLORS.BG_DEEP,
  },
  contentContainer: {
    paddingHorizontal: 24,
    gap: 32,
    maxWidth: 560,
    alignSelf: 'center',
    width: '100%',
  },

  // Top nav
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordmark: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.4,
  },
  navSignInBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
  },
  navSignInBtnPressed: {
    borderColor: COLORS.ACCENT,
  },
  navSignInText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },

  // Arabic decorative card
  arabicCardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.GRADIENT_END,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  arabicCard: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  arabicCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  arabicDecorative: {
    fontFamily: 'AmiriQuran',
    fontSize: 46,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  arabicCardCaption: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },

  // Hero text
  heroBlock: {
    gap: 12,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -1.5,
    lineHeight: 46,
  },
  heroTagline: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.ACCENT,
    letterSpacing: 0.1,
  },
  heroDescription: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 24,
  },

  // CTA buttons
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  ctaPrimary: {
    flex: 1,
    minWidth: 160,
    paddingVertical: 16,
    backgroundColor: COLORS.ACCENT,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaPrimaryPressed: {
    opacity: 0.85,
  },
  ctaPrimaryText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A0F1E',
    letterSpacing: -0.2,
  },
  ctaSecondary: {
    flex: 1,
    minWidth: 160,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    alignItems: 'center',
  },
  ctaSecondaryPressed: {
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  ctaSecondaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.2,
  },

  // Feature chips
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.BG_SURFACE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
  },
  chipIcon: {
    fontSize: 14,
  },
  chipLabel: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
});
