import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@/lib/constants';

const STEPS = [
  {
    number: '01',
    title: 'Choose a journey',
    body: 'Pick a narrative from the Quran — a prophet\'s story, a chapter of trial, a promise fulfilled.',
  },
  {
    number: '02',
    title: 'One quest per day',
    body: 'Each day unlocks a new quest: a short passage, a reflection prompt, and a question to sit with.',
  },
  {
    number: '03',
    title: 'Track your path',
    body: 'Your progress is saved. Return any day. Finish the story. Then begin the next.',
  },
] as const;

/**
 * Onboarding step 2 — explainer with numbered step cards.
 * Editorial layout: numbered left-rail, text right, accent connecting line.
 */
export default function HowItWorksScreen() {
  const handleContinue = useCallback(() => {
    router.push('/onboarding/pick-journey');
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.stepIndicator}>2 of 3</Text>
      </View>

      <View style={styles.titleGroup}>
        <Text style={styles.title}>How it works</Text>
        <Text style={styles.subtitle}>Simple by design. Meaningful by nature.</Text>
      </View>

      {/* Steps */}
      <View style={styles.steps}>
        {STEPS.map((step, index) => (
          <View key={step.number} style={styles.stepRow}>
            {/* Number rail */}
            <View style={styles.numberRail}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>{step.number}</Text>
              </View>
              {index < STEPS.length - 1 && <View style={styles.connector} />}
            </View>

            {/* Step content */}
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepBody}>{step.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [styles.ctaBtn, pressed && styles.ctaBtnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Choose your first journey"
        >
          <Text style={styles.ctaText}>Choose your journey</Text>
        </Pressable>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 32,
  },
  backText: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  stepIndicator: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
    fontWeight: '500',
  },
  titleGroup: {
    gap: 6,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -1.2,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
  },
  steps: {
    flex: 1,
    gap: 0,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 20,
  },
  numberRail: {
    alignItems: 'center',
    width: 44,
  },
  numberCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(20,184,166,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(20,184,166,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.ACCENT,
    letterSpacing: 0.5,
  },
  connector: {
    flex: 1,
    width: 1,
    backgroundColor: 'rgba(20,184,166,0.15)',
    marginVertical: 6,
    minHeight: 40,
  },
  stepContent: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 32,
    gap: 6,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  stepBody: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 21,
  },
  footer: {
    marginTop: 16,
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
});
