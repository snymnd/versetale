import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArchesPattern, OrnamentStar } from '@/components/brand';
import { Button, Eyebrow, Text } from '@/components/ui';
import { fontFamily, palette, radii, spacing, useColors } from '@/lib/theme';
import { useJourneyDetail } from '@/features/journeys/useJourneyDetail';

const REFLECTION_STORAGE_PREFIX = 'versetale_reflection_';

/**
 * Reflection — dark-mode writing surface that follows quest completion.
 * The completion prompt is set in Fraunces over a dusk-tinted card with
 * the arches pattern and an ornament; the writing surface itself uses
 * Fraunces 17 for the literary feel called out in the design brief.
 */
export default function ReflectionScreen() {
  const { journeyId, questId } = useLocalSearchParams<{ journeyId: string; questId: string }>();
  const { data: journey } = useJourneyDetail(journeyId);
  const { colors } = useColors();

  const quest = journey?.quests.find((q) => q.id === questId);

  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!note.trim()) {
      Alert.alert('A blank page', 'Write something — even a single line — before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const key = `${REFLECTION_STORAGE_PREFIX}${journeyId}_${questId}`;
      await AsyncStorage.setItem(
        key,
        JSON.stringify({
          journeyId,
          questId,
          note: note.trim(),
          savedAt: Date.now(),
        }),
      );
      router.replace(`/(tabs)/journey/${journeyId}`);
    } catch {
      Alert.alert('Couldn\'t save', 'We weren\'t able to save your reflection. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [note, journeyId, questId]);

  const handleSkip = useCallback(() => {
    router.replace(`/(tabs)/journey/${journeyId}`);
  }, [journeyId]);

  const wordCount = note.trim() ? note.trim().split(/\s+/).length : 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.bg }]}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.topBar}>
          <Button variant="ghost" size="sm" onPress={handleSkip}>
            Cancel
          </Button>
          <Eyebrow tone="subtle">Reflection · Day {quest?.day ?? '—'}</Eyebrow>
          <Button variant="ghost" size="sm" onPress={handleSave} loading={isSaving}>
            Save
          </Button>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Verse echo card */}
          {quest?.reflection ? (
            <View
              style={[
                styles.echoCard,
                {
                  backgroundColor: colors.brandSoft,
                  borderColor: 'rgba(62,154,162,0.18)',
                },
              ]}
            >
              <Eyebrow tone="brand" style={styles.echoEyebrow}>
                You are reflecting on
              </Eyebrow>
              <Text variant="read" style={styles.echoText} tone="default">
                {quest.reflection}
              </Text>
            </View>
          ) : null}

          {/* Prompt — Fraunces 22 */}
          <View style={styles.promptWrap}>
            <View style={styles.promptOrnament}>
              <OrnamentStar size={22} color={palette.amber[300]} />
            </View>
            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
              <ArchesPattern color={colors.fg} opacity={0.04} tileSize={140} />
            </View>
            <Text style={[styles.promptText, { color: colors.fg }]}>
              {quest?.completionPrompt ?? 'A moment to reflect.'}
            </Text>
          </View>

          {/* Editor */}
          <TextInput
            style={[styles.editor, { color: colors.fg }]}
            value={note}
            onChangeText={setNote}
            placeholder="Begin where the verse meets your day…"
            placeholderTextColor={colors.fgSubtle}
            multiline
            textAlignVertical="top"
            maxLength={2000}
            accessibilityLabel="Reflection text input"
          />
        </ScrollView>

        <View style={[styles.toolbar, { backgroundColor: colors.bgRaised, borderColor: colors.border }]}>
          <Text variant="meta" tone="muted">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </Text>
          <Text variant="mono" tone="subtle">
            {note.length}/2000
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: spacing[2],
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    gap: spacing[5],
  },
  echoCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    gap: spacing[2],
  },
  echoEyebrow: {
    marginBottom: 4,
  },
  echoText: {
    fontFamily: fontFamily.display,
    fontSize: 15,
    lineHeight: 23,
    fontStyle: 'italic',
  },
  promptWrap: {
    position: 'relative',
    overflow: 'hidden',
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
  },
  promptOrnament: {
    marginBottom: spacing[3],
  },
  promptText: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.22,
  },
  editor: {
    fontFamily: fontFamily.display,
    fontSize: 17,
    lineHeight: 29,
    minHeight: 220,
    paddingTop: 0,
    paddingBottom: spacing[6],
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radii.lg,
    borderWidth: 1,
  },
});
