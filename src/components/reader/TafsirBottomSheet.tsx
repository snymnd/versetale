import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Eyebrow, Text } from '@/components/ui';
import { fontFamily, palette, radii, spacing, useColors } from '@/lib/theme';
import { STALE_TIMES } from '@/lib/constants';

const QDC_BASE = 'https://api.qurancdn.com/api/qdc';
const IBN_KATHIR_ID = 169; // Ibn Kathir English

interface RawTafsirResponse {
  tafsir: {
    text: string;
    resource_name: string;
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s{2,}/g, ' ').trim();
}

async function fetchTafsir(verseKey: string): Promise<string> {
  const url = `${QDC_BASE}/tafsirs/${IBN_KATHIR_ID}/by_ayah/${verseKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Tafsir fetch failed: ${res.status}`);
  const data = (await res.json()) as RawTafsirResponse;
  return stripHtml(data.tafsir.text);
}

interface TafsirBottomSheetProps {
  verseKey: string | null;
  arabicText: string;
  onClose: () => void;
}

/**
 * Tafsir bottom sheet — opens on long-press of a verse. Uses the design
 * system's `--radius-2xl` top-only radius and the `--brand-soft` surface
 * for the Arabic quote echo.
 */
export function TafsirBottomSheet({ verseKey, arabicText, onClose }: TafsirBottomSheetProps) {
  const { colors } = useColors();
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const sheetRef = useRef<BottomSheet>(null);

  const {
    data: tafsirText,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tafsir', verseKey],
    queryFn: () => fetchTafsir(verseKey!),
    enabled: verseKey !== null,
    staleTime: STALE_TIMES.VERSE_CONTENT,
  });

  useEffect(() => {
    if (verseKey) {
      sheetRef.current?.snapToIndex(0);
    } else {
      sheetRef.current?.close();
    }
  }, [verseKey]);

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: colors.bgRaised,
        borderTopLeftRadius: radii['2xl'],
        borderTopRightRadius: radii['2xl'],
      }}
      handleIndicatorStyle={{ backgroundColor: colors.brand, width: 40, height: 4 }}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Eyebrow tone="brand">A note · Ibn Kathīr</Eyebrow>
          <Text variant="mono" tone="muted">
            {verseKey}
          </Text>
        </View>

        {arabicText ? (
          <View style={[styles.arabicQuoteCard, { backgroundColor: colors.brandSoft }]}>
            <Text style={[styles.arabicQuote, { color: colors.fg }]} accessibilityLanguage="ar">
              {arabicText}
            </Text>
          </View>
        ) : null}

        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.brand} size="small" />
            <Text variant="caption" tone="muted">
              Loading tafsir…
            </Text>
          </View>
        ) : isError ? (
          <Text variant="read" style={styles.errorText}>
            Could not load tafsir. Check your connection and try again.
          </Text>
        ) : (
          <Text variant="read" tone="muted" style={styles.tafsirText}>
            {tafsirText}
          </Text>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
  },
  arabicQuoteCard: {
    borderRadius: radii.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    marginBottom: spacing[4],
  },
  arabicQuote: {
    fontFamily: 'AmiriQuran',
    fontSize: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 40,
    color: palette.ink[25],
  },
  divider: {
    height: 1,
    marginBottom: spacing[5],
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: spacing[2],
  },
  errorText: {
    fontFamily: fontFamily.sans,
    fontSize: 15,
  },
  tafsirText: {
    fontSize: 16,
    lineHeight: 27,
  },
});
