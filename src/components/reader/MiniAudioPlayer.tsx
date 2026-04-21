import { Audio, AVPlaybackStatus } from 'expo-av';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { COLORS } from '@/lib/constants';
import { useQuestProgressStore } from '@/features/journeys/journeyStore';

interface MiniAudioPlayerProps {
  /**
   * Ordered list of verse keys for the current quest, e.g. ["12:4","12:5","12:6"].
   * The player uses this to advance to the next verse automatically.
   */
  verseKeys: string[];
  /**
   * Map of verseKey → audioUrl. If a key is absent or null the player skips silently.
   */
  audioMap: Record<string, string | null>;
  /** Human-readable reciter name for display */
  reciterName?: string;
  /** Called when audio naturally reaches the last verse and finishes */
  onComplete?: () => void;
  /** Override the outermost container style (e.g. to remove absolute positioning) */
  containerStyle?: object;
}

/**
 * MiniAudioPlayer — floating bar pinned above the bottom tab bar.
 *
 * Responsibilities:
 * - Play / pause expo-av Audio.Sound for the currentVerseKey
 * - Auto-advance to the next verse on playback end
 * - Sync play state to questProgressStore
 * - Animate in/out when a verse is active
 */
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

  const soundRef = useRef<Audio.Sound | null>(null);
  // Web-only: native HTMLAudioElement for reliable browser playback
  const webAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const translateY = useSharedValue(80);
  const visible = currentVerseKey !== null;

  useEffect(() => {
    translateY.value = withSpring(visible ? 0 : 80, { damping: 18, stiffness: 200 });
  }, [visible, translateY]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      }).catch(() => {});
    }
    return () => {
      soundRef.current?.unloadAsync().catch(() => {});
      if (webAudioRef.current) {
        webAudioRef.current.pause();
        webAudioRef.current = null;
      }
    };
  }, []);

  const loadAndPlay = useCallback(
    async (verseKey: string) => {
      const url = audioMap[verseKey];
      if (!url) { setPlaying(false); return; }

      setIsLoading(true);
      try {
        if (Platform.OS === 'web') {
          // Use native HTMLAudioElement — avoids expo-av web limitations
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
        } else {
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
        }
      } catch (err) {
        console.error('[MiniAudioPlayer] playback error:', err);
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
    if (Platform.OS === 'web') {
      const audio = webAudioRef.current;
      if (!audio) {
        if (currentVerseKey) loadAndPlay(currentVerseKey);
        return;
      }
      try {
        if (isPlaying) { audio.pause(); setPlaying(false); }
        else { await audio.play(); setPlaying(true); }
      } catch { /* ignore */ }
      return;
    }

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
    const idx = verseKeys.indexOf(currentVerseKey);
    const prevKey = verseKeys[idx - 1];
    if (prevKey) setCurrentVerse(prevKey);
  }, [currentVerseKey, verseKeys, setCurrentVerse]);

  const handleNext = useCallback(() => {
    if (!currentVerseKey) return;
    const idx = verseKeys.indexOf(currentVerseKey);
    const nextKey = verseKeys[idx + 1];
    if (nextKey) setCurrentVerse(nextKey);
  }, [currentVerseKey, verseKeys, setCurrentVerse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const currentIdx = currentVerseKey ? verseKeys.indexOf(currentVerseKey) : -1;
  const canPrev = currentIdx > 0;
  const canNext = currentIdx >= 0 && currentIdx < verseKeys.length - 1;

  return (
    <Animated.View style={[styles.container, animatedStyle, containerStyle]} pointerEvents={visible ? 'auto' : 'none'}>
      <View style={styles.inner}>
        {/* Left: reciter + verse info */}
        <View style={styles.info}>
          <Text style={styles.reciterName} numberOfLines={1}>
            {reciterName}
          </Text>
          <Text style={styles.verseKey} numberOfLines={1}>
            {currentVerseKey ?? '—'}
          </Text>
        </View>

        {/* Right: controls */}
        <View style={styles.controls}>
          <Pressable
            onPress={handlePrev}
            disabled={!canPrev}
            accessibilityLabel="Previous verse"
            style={({ pressed }) => [styles.controlBtn, pressed && styles.controlBtnPressed]}
          >
            <Text style={[styles.controlIcon, !canPrev && styles.controlDisabled]}>{'«'}</Text>
          </Pressable>

          <Pressable
            onPress={handlePlayPause}
            accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
            style={({ pressed }) => [styles.playBtn, pressed && styles.playBtnPressed]}
          >
            <Text style={styles.playIcon}>{isLoading ? '…' : isPlaying ? '⏸' : '▶'}</Text>
          </Pressable>

          <Pressable
            onPress={handleNext}
            disabled={!canNext}
            accessibilityLabel="Next verse"
            style={({ pressed }) => [styles.controlBtn, pressed && styles.controlBtnPressed]}
          >
            <Text style={[styles.controlIcon, !canNext && styles.controlDisabled]}>{'»'}</Text>
          </Pressable>
        </View>
      </View>
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
