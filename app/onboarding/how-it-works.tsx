import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Eyebrow, Text } from '@/components/ui';
import { fontFamily, spacing, useColors } from '@/lib/theme';

const STEPS = [
  {
    number: '01',
    title: 'Choose a journey',
    body: "Pick a narrative — a prophet's story, a chapter of trial, a promise fulfilled.",
  },
  {
    number: '02',
    title: 'One quest a day',
    body: 'Each day unlocks a short passage, a reflection, and a question to sit with.',
  },
  {
    number: '03',
    title: 'Walk the story',
    body: 'Your progress saves itself. Return any day. Finish the arc. Then begin the next.',
  },
] as const;

/**
 * Onboarding step 2 — explainer with numbered step cards.
 */
export default function HowItWorksScreen() {
  const { colors } = useColors();

  const handleContinue = useCallback(() => {
    router.push('/onboarding/pick-journey');
  }, []);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/onboarding/welcome');
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          onPress={handleBack}
          style={[styles.iconBtn, { backgroundColor: colors.bgSunken }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <ChevronLeft color={colors.fgMuted} size={20} strokeWidth={1.75} />
        </Pressable>
        <Text variant="meta" tone="muted">
          2 of 3
        </Text>
      </View>

      <View style={styles.titleGroup}>
        <Text style={[styles.title, { color: colors.fg }]}>How it works</Text>
        <Text variant="read" tone="muted" style={styles.subtitle}>
          Simple by design. Meaningful by nature.
        </Text>
      </View>

      <View style={styles.steps}>
        {STEPS.map((step, index) => (
          <View key={step.number} style={styles.stepRow}>
            <View style={styles.numberRail}>
              <View
                style={[
                  styles.numberCircle,
                  { backgroundColor: 'rgba(31,122,132,0.16)', borderColor: 'rgba(31,122,132,0.4)' },
                ]}
              >
                <Text style={[styles.numberText, { color: colors.brandFg }]}>{step.number}</Text>
              </View>
              {index < STEPS.length - 1 ? (
                <View style={[styles.connector, { backgroundColor: 'rgba(31,122,132,0.18)' }]} />
              ) : null}
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.fg }]}>{step.title}</Text>
              <Text variant="read" tone="muted" style={styles.stepBody}>
                {step.body}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Eyebrow tone="subtle" style={styles.stepLabel}>
          Step 2
        </Eyebrow>
        <Button variant="primary" size="lg" fullWidth onPress={handleContinue}>
          Choose your journey
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
    marginBottom: spacing[8],
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleGroup: {
    gap: 6,
    marginBottom: spacing[8],
  },
  title: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.72,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  steps: {
    flex: 1,
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
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontFamily: fontFamily.sansBold,
    fontSize: 13,
    letterSpacing: 0.4,
  },
  connector: {
    flex: 1,
    width: 1,
    marginVertical: 6,
    minHeight: 40,
  },
  stepContent: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: spacing[8],
    gap: 6,
  },
  stepTitle: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 19,
    lineHeight: 24,
    letterSpacing: -0.38,
  },
  stepBody: {
    fontSize: 15,
    lineHeight: 23,
  },
  footer: {
    paddingTop: spacing[4],
    alignItems: 'stretch',
    gap: spacing[3],
  },
  stepLabel: {
    alignSelf: 'center',
  },
});
