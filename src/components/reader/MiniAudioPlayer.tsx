import {
  setAudioModeAsync,
  setIsAudioActiveAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useQuestProgressStore } from '@/features/journeys/journeyStore';
import { fontFamily, palette, radii, useColors } from '@/lib/theme';

interface MiniAudioPlayerProps {
  verseKeys: string[];
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
  const { colors, shadow } = useColors();

  return (
    <View
      style={[
        styles.inner,
        shadow.lg,
        { backgroundColor: colors.bgRaised, borderColor: colors.border },
      ]}
    >
      <View style={styles.info}>
        <Text style={[styles.reciterName, { color: colors.brandFg }]} numberOfLines={1}>
          {reciterName}
        </Text>
        <Text style={[styles.verseKey, { color: colors.fgMuted }]} numberOfLines={1}>
          {currentVerseKey ?? '—'}
        </Text>
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={onPrev}
          disabled={!canPrev}
          accessibilityLabel="Previous verse"
          style={({ pressed }) => [
            styles.controlBtn,
            { backgroundColor: pressed ? colors.bgMuted : colors.bgSunken },
          ]}
        >
          <Text
            style={[
              styles.controlIcon,
              { color: canPrev ? colors.fgMuted : colors.fgSubtle },
            ]}
          >
            {'«'}
          </Text>
        </Pressable>

        <Pressable
          onPress={onPlayPause}
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
          style={({ pressed }) => [
            styles.playBtn,
            { backgroundColor: colors.brand, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.playIcon}>{isLoading ? '…' : isPlaying ? '⏸' : '▶'}</Text>
        </Pressable>

        <Pressable
          onPress={onNext}
          disabled={!canNext}
          accessibilityLabel="Next verse"
          style={({ pressed }) => [
            styles.controlBtn,
            { backgroundColor: pressed ? colors.bgMuted : colors.bgSunken },
          ]}
        >
          <Text
            style={[
              styles.controlIcon,
              { color: canNext ? colors.fgMuted : colors.fgSubtle },
            ]}
          >
            {'»'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Native path ─────────────────────────────────────────────────────────────

interface BarProps extends MiniAudioPlayerProps {
  currentVerseKey: string | null;
  isPlaying: boolean;
  setCurrentVerse: (key: string | null) => void;
  setPlaying: (v: boolean) => void;
}

function NativeAudioBar({
  currentVerseKey,
  setCurrentVerse,
  setPlaying,
  verseKeys,
  audioMap,
  reciterName = 'Mishary Rashid',
  onComplete,
}: Omit<BarProps, 'isPlaying'>) {
  // useAudioPlayer is tied to this component's lifecycle — expo-audio releases
  // the player automatically on unmount, so no manual singleton is needed.
  // Start with no source; replace() is called whenever the verse key changes.
  const player = useAudioPlayer(undefined);
  const status = useAudioPlayerStatus(player);

  // Tracks which verse key the player is already loaded for, to avoid re-replacing
  // the source on every render when only unrelated state changes.
  const loadedKeyRef = useRef<string | null>(null);

  // Ref that always holds the latest currentVerseKey so the didJustFinish
  // effect can read it without creating a stale closure.
  const currentVerseKeyRef = useRef(currentVerseKey);
  useEffect(() => { currentVerseKeyRef.current = currentVerseKey; }, [currentVerseKey]);

  // Configure audio session once on mount.
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  // Replace the audio source and start playing when the selected verse changes.
  useEffect(() => {
    if (!currentVerseKey) {
      player.pause();
      loadedKeyRef.current = null;
      return;
    }

    const url = audioMap[currentVerseKey] ?? null;
    if (!url) {
      setPlaying(false);
      return;
    }

    if (currentVerseKey === loadedKeyRef.current) return;
    loadedKeyRef.current = currentVerseKey;

    player.replace({ uri: url });
    player.play();
  // player identity is stable; audioMap contents are stable per render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVerseKey]);

  // Sync Zustand isPlaying state from expo-audio's source-of-truth status.
  useEffect(() => {
    setPlaying(status.playing);
  }, [status.playing, setPlaying]);

  // Advance to the next verse when the current one finishes naturally.
  // currentVerseKey is read from a ref to avoid stale closure issues when the
  // user taps Next mid-playback and didJustFinish fires on the old verse.
  useEffect(() => {
    if (!status.didJustFinish) return;
    const key = currentVerseKeyRef.current;
    if (!key) return;

    setPlaying(false);
    const idx = verseKeys.indexOf(key);
    const nextKey = verseKeys[idx + 1];
    if (nextKey) {
      setCurrentVerse(nextKey);
    } else {
      setCurrentVerse(null);
      onComplete?.();
    }
  }, [status.didJustFinish, verseKeys, setCurrentVerse, setPlaying, onComplete]);

  // Pause audio when the app is backgrounded / becomes inactive.
  // setIsAudioActiveAsync(false) gracefully deactivates the audio session,
  // which avoids the "Unable to activate keep awake" crash from expo-av.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'background' || next === 'inactive') {
        setIsAudioActiveAsync(false).catch(() => {});
        player.pause();
      } else if (next === 'active') {
        setIsAudioActiveAsync(true).catch(() => {});
      }
    });
    return () => subscription.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayPause = useCallback(() => {
    if (status.playing) {
      player.pause();
    } else {
      const url = currentVerseKey ? (audioMap[currentVerseKey] ?? null) : null;
      if (!url) return;
      // If the player lost its source (e.g. after app resume), reload first.
      if (!status.isLoaded) {
        loadedKeyRef.current = null;
        player.replace({ uri: url });
      }
      player.play();
    }
  }, [status.playing, status.isLoaded, currentVerseKey, audioMap, player]);

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
      isLoading={status.isBuffering || (!status.isLoaded && !!currentVerseKey)}
      isPlaying={status.playing}
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

// ─── Web path ─────────────────────────────────────────────────────────────────

function WebAudioBar({
  currentVerseKey,
  setCurrentVerse,
  setPlaying,
  verseKeys,
  audioMap,
  reciterName = 'Mishary Rashid',
  onComplete,
}: BarProps) {
  const webAudioRef = useRef<HTMLAudioElement | null>(null);
  const mountedRef = useRef(true);
  const genRef = useRef(0);
  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (webAudioRef.current) {
        webAudioRef.current.pause();
        webAudioRef.current.src = '';
        webAudioRef.current = null;
      }
    };
  }, []);

  const loadAndPlay = useCallback(
    async (verseKey: string) => {
      const gen = ++genRef.current;
      const url = audioMap[verseKey];
      if (!url) { setLocalIsPlaying(false); setPlaying(false); return; }

      if (mountedRef.current) setIsLoading(true);

      if (webAudioRef.current) {
        webAudioRef.current.pause();
        webAudioRef.current.src = '';
        webAudioRef.current = null;
      }

      if (gen !== genRef.current || !mountedRef.current) return;

      try {
        const audio = new window.Audio(url);
        webAudioRef.current = audio;
        audio.onended = () => {
          if (gen !== genRef.current || !mountedRef.current) return;
          setLocalIsPlaying(false);
          setPlaying(false);
          const idx = verseKeys.indexOf(verseKey);
          const nextKey = verseKeys[idx + 1];
          if (nextKey) { setCurrentVerse(nextKey); }
          else { setCurrentVerse(null); onComplete?.(); }
        };
        await audio.play();
        if (gen !== genRef.current || !mountedRef.current) {
          audio.pause();
          return;
        }
        setLocalIsPlaying(true);
        setPlaying(true);
      } catch {
        if (mountedRef.current) { setLocalIsPlaying(false); setPlaying(false); }
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [audioMap, verseKeys, setCurrentVerse, setPlaying, onComplete],
  );

  useEffect(() => {
    if (currentVerseKey) {
      loadAndPlay(currentVerseKey);
    } else {
      genRef.current++;
      if (webAudioRef.current) {
        webAudioRef.current.pause();
        webAudioRef.current.src = '';
        webAudioRef.current = null;
      }
      if (mountedRef.current) { setLocalIsPlaying(false); setIsLoading(false); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVerseKey]);

  const handlePlayPause = useCallback(async () => {
    const audio = webAudioRef.current;
    if (!audio) { if (currentVerseKey) loadAndPlay(currentVerseKey); return; }
    try {
      if (localIsPlaying) { audio.pause(); setLocalIsPlaying(false); setPlaying(false); }
      else { await audio.play(); setLocalIsPlaying(true); setPlaying(true); }
    } catch { /* ignore */ }
  }, [localIsPlaying, currentVerseKey, loadAndPlay, setPlaying]);

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
      isPlaying={localIsPlaying}
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

// ─── Main export ──────────────────────────────────────────────────────────────

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
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  reciterName: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  verseKey: {
    fontFamily: fontFamily.mono,
    fontSize: 13,
    letterSpacing: 0,
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
  },
  controlIcon: {
    fontSize: 16,
    fontFamily: fontFamily.sansSemiBold,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 16,
    color: palette.ink[0],
  },
});
