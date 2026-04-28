import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@/lib/constants';
import { useJourneyDetail } from '@/features/journeys/useJourneyDetail';

const REFLECTION_STORAGE_PREFIX = 'versetale_reflection_';

/**
 * Reflection screen — shown after completing a quest.
 * Displays the quest's completionPrompt and collects the user's written reflection.
 * Persists the note to AsyncStorage (Phase 3 will sync to the user API).
 */
export default function ReflectionScreen() {
  const { journeyId, questId } = useLocalSearchParams<{ journeyId: string; questId: string }>();
  const { data: journey } = useJourneyDetail(journeyId);

  const quest = journey?.quests.find((q) => q.id === questId);

  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!note.trim()) {
      Alert.alert('Empty Reflection', 'Write something before saving.');
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
      Alert.alert('Error', 'Could not save your reflection. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [note, journeyId, questId]);

  const handleSkip = useCallback(() => {
    router.replace(`/(tabs)/journey/${journeyId}`);
  }, [journeyId]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.completedPill}>
              <Text style={styles.completedPillText}>Quest Complete</Text>
            </View>
            <Text style={styles.dayLabel}>
              Day {quest?.day ?? '—'} — {quest?.title ?? ''}
            </Text>
          </View>

          {/* Reflection prompt card */}
          <View style={styles.promptCard}>
            <Text style={styles.promptLabel}>Reflect</Text>
            <Text style={styles.promptText}>{quest?.completionPrompt ?? ''}</Text>
          </View>

          {/* Narrative excerpt (smaller, for context) */}
          {quest?.reflection ? (
            <View style={styles.narrativeCard}>
              <View style={styles.narrativeBorder} />
              <Text style={styles.narrativeText}>{quest.reflection}</Text>
            </View>
          ) : null}

          {/* Text area */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Your reflection</Text>
            <TextInput
              style={styles.textInput}
              value={note}
              onChangeText={setNote}
              placeholder="Write your thoughts here…"
              placeholderTextColor={COLORS.TEXT_TERTIARY}
              multiline
              textAlignVertical="top"
              returnKeyType="default"
              maxLength={1000}
              accessibilityLabel="Reflection text input"
            />
            <Text style={styles.charCount}>{note.length}/1000</Text>
          </View>
        </ScrollView>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <Pressable
            onPress={handleSkip}
            style={styles.skipBtn}
            accessibilityLabel="Skip reflection"
          >
            <Text style={styles.skipBtnText}>Skip</Text>
          </Pressable>

          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
            accessibilityLabel="Save reflection"
          >
            <Text style={styles.saveBtnText}>{isSaving ? 'Saving…' : 'Save Reflection'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DEEP,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 16,
  },

  // Header
  header: {
    gap: 8,
    alignItems: 'flex-start',
  },
  completedPill: {
    backgroundColor: 'rgba(20,184,166,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(20,184,166,0.35)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  completedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.ACCENT,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  dayLabel: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.5,
  },

  // Prompt card
  promptCard: {
    backgroundColor: 'rgba(20,184,166,0.07)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(20,184,166,0.2)',
    padding: 18,
    gap: 8,
  },
  promptLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.ACCENT,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  promptText: {
    fontSize: 17,
    color: COLORS.ACCENT,
    lineHeight: 26,
    fontWeight: '500',
  },

  // Narrative
  narrativeCard: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  narrativeBorder: {
    width: 2,
    backgroundColor: COLORS.CARD_BORDER,
    borderRadius: 1,
  },
  narrativeText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  // Input
  inputCard: {
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    padding: 16,
    gap: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  textInput: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 24,
    minHeight: 160,
    maxHeight: 320,
  },
  charCount: {
    fontSize: 11,
    color: COLORS.TEXT_TERTIARY,
    textAlign: 'right',
  },

  // Actions
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.CARD_BORDER,
  },
  skipBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnPressed: {
    opacity: 0.85,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0A0F1E',
  },
});
