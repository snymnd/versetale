// expo-av is used for native audio. To migrate to expo-audio (the new API),
// rebuild the dev client after running: npx expo run:android / npx expo run:ios
import { Audio, AVPlaybackStatus } from 'expo-av';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useQuestProgressStore } from '@/features/journeys/journeyStore';
import { COLORS } from '@/lib/constants';

interface MiniAudioPlayerProps {
  /**
   * Ordered list of verse keys for the current quest, e.g. ["12:4","12:5","12:6"].
   */
  verseKeys: string[];
  /**
   * Map of verseKey → audioUrl. If a key is absent or null the player skips silently.
   */
  audioMap: Record<string, string | null>;
  reciterName?: string;
  onComplete?: () => void;
  containerStyle?: object;
}

interface AudioControlsProps {
  isLoading: boolean;
  isPlaying: boolean;
  canPrev: boolean;
  canNext: boolean;
  currentVerseKey: string | null;
  reciterName: string;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function AudioControls({
  isLoading,
  isPlaying,
  canPrev,
  canNext,
  currentVerseKey,
  reciterName,
  onPlayPause,
  onPrev,
  onNext,
}: AudioControlsProps) {
  return (
    <View style={styles.inner}>
      <View style={styles.info}>
        <Text style={styles.reciterName} numberOfLines={1}>
          {reciterName}
        </Text>
        <Text style={styles.verseKey} numberOfLines={1}>
          {currentVerseKey ?? '—'}
        </Text>
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={onPrev}
          disabled={!canPrev}
          accessibilityLabel="Previous verse"
          style={({ pressed }) => [styles.controlBtn, pressed && styles.controlBtnPressed]}
        >
          <Text style={[styles.controlIcon, !canPrev && styles.controlDisabled]}>{'«'}</Text>
        </Pressable>

        <Pressable
          onPress={onPlayPause}
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
          style={({ pressed }) => [styles.playBtn, pressed && styles.playBtnPressed]}
        >
          <Text style={styles.playIcon}>{isLoading ? '…' : isPlaying ? '⏸' : '▶'}</Text>
        </Pressable>

        <Pressable
          onPress={onNext}
          disabled={!canNext}
          accessibilityLabel="Next verse"
          style={({ pressed }) => [styles.controlBtn, pressed && styles.controlBtnPressed]}
        >
          <Text style={[styles.controlIcon, !canNext && styles.controlDisabled]}>{'»'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Native path ────────────────────────────────────────────────────────────

interface BarProps extends MiniAudioPlayerProps {
  currentVerseKey: string | null;
  isPlaying: boolean;
  setCurrentVerse: (key: string) => void;
  setPlaying: (v: boolean) => void;
}

function NativeAudioBar({
  currentVerseKey,
  isPlaying,
  setCurrentVerse,
  setPlaying,
  verseKeys,
  audioMap,
  reciterName = 'Mishary Rashid',
  onComplete,
}: BarProps) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false, shouldDuckAndroid: true }).catch(() => {});
    return () => { soundRef.current?.unloadAsync().catch(() => {}); };
  }, []);

  const loadAndPlay = useCallback(
    async (verseKey: string) => {
      const url = audioMap[verseKey];
      if (!url) { setPlaying(false); return; }

      setIsLoading(true);
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        const { sound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: true },
          (status: AVPlaybackStatus) => {
            if (!status.isLoaded) return;
            if (status.didJustFinish) {
              const idx = verseKeys.indexOf(verseKey);
              const nextKey = verseKeys[idx + 1];
              if (nextKey) { setCurrentVerse(nextKey); }
              else { setPlaying(false); onComplete?.(); }
            }
            setPlaying(status.isPlaying);
          },
        );
        soundRef.current = sound;
        setPlaying(true);
      } catch {
        setPlaying(false);
      } finally {
        setIsLoading(false);
      }
    },
    [audioMap, verseKeys, setCurrentVerse, setPlaying, onComplete],
  );

  useEffect(() => {
    if (currentVerseKey) loadAndPlay(currentVerseKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVerseKey]);

  const handlePlayPause = useCallback(async () => {
    const sound = soundRef.current;
    if (!sound) {
      if (currentVerseKey) loadAndPlay(currentVerseKey);
      return;
    }
    try {
      if (isPlaying) { await sound.pauseAsync(); setPlaying(false); }
      else { await sound.playAsync(); setPlaying(true); }
    } catch { /* ignore */ }
  }, [isPlaying, currentVerseKey, loadAndPlay, setPlaying]);

  const handlePrev = useCallback(() => {
    if (!currentVerseKey) return;
    const prev = verseKeys[verseKeys.indexOf(currentVerseKey) - 1];
    if (prev) setCurrentVerse(prev);
  }, [currentVerseKey, verseKeys, setCurrentVerse]);

  const handleNext = useCallback(() => {
    if (!currentVerseKey) return;
    const next = verseKeys[verseKeys.indexOf(currentVerseKey) + 1];
    if (next) setCurrentVerse(next);
  }, [currentVerseKey, verseKeys, setCurrentVerse]);

  const currentIdx = currentVerseKey ? verseKeys.indexOf(currentVerseKey) : -1;

  return (
    <AudioControls
      isLoading={isLoading}
      isPlaying={isPlaying}
      canPrev={currentIdx > 0}
      canNext={currentIdx >= 0 && currentIdx < verseKeys.length - 1}
      currentVerseKey={currentVerseKey}
      reciterName={reciterName}
      onPlayPause={handlePlayPause}
      onPrev={handlePrev}
      onNext={handleNext}
    />
  );
}

// ─── Web path ────────────────────────────────────────────────────────────────

function WebAudioBar({
  currentVerseKey,
  isPlaying,
  setCurrentVerse,
  setPlaying,
  verseKeys,
  audioMap,
  reciterName = 'Mishary Rashid',
  onComplete,
}: BarProps) {
  const webAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadAndPlay = useCallback(
    async (verseKey: string) => {
      const url = audioMap[verseKey];
      if (!url) { setPlaying(false); return; }

      setIsLoading(true);
      try {
        if (webAudioRef.current) {
          webAudioRef.current.pause();
          webAudioRef.current.src = '';
        }
        const audio = new window.Audio(url);
        webAudioRef.current = audio;
        audio.onended = () => {
          const idx = verseKeys.indexOf(verseKey);
          const nextKey = verseKeys[idx + 1];
          if (nextKey) { setCurrentVerse(nextKey); }
          else { setPlaying(false); onComplete?.(); }
        };
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      } finally {
        setIsLoading(false);
      }
    },
    [audioMap, verseKeys, setCurrentVerse, setPlaying, onComplete],
  );

  useEffect(() => {
    if (currentVerseKey) loadAndPlay(currentVerseKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVerseKey]);

  useEffect(() => {
    return () => {
      if (webAudioRef.current) {
        webAudioRef.current.pause();
        webAudioRef.current = null;
      }
    };
  }, []);

  const handlePlayPause = useCallback(async () => {
    const audio = webAudioRef.current;
    if (!audio) {
      if (currentVerseKey) loadAndPlay(currentVerseKey);
      return;
    }
    try {
      if (isPlaying) { audio.pause(); setPlaying(false); }
      else { await audio.play(); setPlaying(true); }
    } catch { /* ignore */ }
  }, [isPlaying, currentVerseKey, loadAndPlay, setPlaying]);

  const handlePrev = useCallback(() => {
    if (!currentVerseKey) return;
    const prev = verseKeys[verseKeys.indexOf(currentVerseKey) - 1];
    if (prev) setCurrentVerse(prev);
  }, [currentVerseKey, verseKeys, setCurrentVerse]);

  const handleNext = useCallback(() => {
    if (!currentVerseKey) return;
    const next = verseKeys[verseKeys.indexOf(currentVerseKey) + 1];
    if (next) setCurrentVerse(next);
  }, [currentVerseKey, verseKeys, setCurrentVerse]);

  const currentIdx = currentVerseKey ? verseKeys.indexOf(currentVerseKey) : -1;

  return (
    <AudioControls
      isLoading={isLoading}
      isPlaying={isPlaying}
      canPrev={currentIdx > 0}
      canNext={currentIdx >= 0 && currentIdx < verseKeys.length - 1}
      currentVerseKey={currentVerseKey}
      reciterName={reciterName}
      onPlayPause={handlePlayPause}
      onPrev={handlePrev}
      onNext={handleNext}
    />
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function MiniAudioPlayer({
  verseKeys,
  audioMap,
  reciterName = 'Mishary Rashid',
  onComplete,
  containerStyle,
}: MiniAudioPlayerProps) {
  const currentVerseKey = useQuestProgressStore((s) => s.currentVerseKey);
  const isPlaying = useQuestProgressStore((s) => s.isPlaying);
  const setCurrentVerse = useQuestProgressStore((s) => s.setCurrentVerse);
  const setPlaying = useQuestProgressStore((s) => s.setPlaying);

  const visible = currentVerseKey !== null;
  const translateY = useSharedValue(80);

  useEffect(() => {
    translateY.value = withSpring(visible ? 0 : 80, { damping: 18, stiffness: 200 });
  }, [visible, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const sharedProps: BarProps = {
    currentVerseKey,
    isPlaying,
    setCurrentVerse,
    setPlaying,
    verseKeys,
    audioMap,
    reciterName,
    onComplete,
  };

  return (
    <Animated.View
      style={[styles.container, animatedStyle, containerStyle]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {Platform.OS === 'web' ? (
        <WebAudioBar {...sharedProps} />
      ) : (
        <NativeAudioBar {...sharedProps} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 4,
    zIndex: 100,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2540',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(20,184,166,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  reciterName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.ACCENT,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  verseKey: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  controlBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  controlIcon: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '700',
  },
  controlDisabled: {
    color: COLORS.TEXT_TERTIARY,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  playBtnPressed: {
    opacity: 0.8,
  },
  playIcon: {
    fontSize: 16,
    color: '#0A0F1E',
  },
});
