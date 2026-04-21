import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { COLORS, STALE_TIMES } from '@/lib/constants';

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
 * TafsirBottomSheet — opened on long-press of a verse.
 * Fetches Ibn Kathir tafsir from Quran Foundation Content API.
 * Styled with dark luxury surface, teal handle, Arabic quote above tafsir text.
 */
export function TafsirBottomSheet({ verseKey, arabicText, onClose }: TafsirBottomSheetProps) {
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const sheetRef = useRef<BottomSheet>(null);

  const { data: tafsirText, isLoading, isError } = useQuery({
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
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>Tafsir · Ibn Kathir</Text>
          <Text style={styles.verseKeyLabel}>{verseKey}</Text>
        </View>

        {/* Arabic quote */}
        {arabicText ? (
          <View style={styles.arabicQuoteCard}>
            <Text style={styles.arabicQuote} accessibilityLanguage="ar">
              {arabicText}
            </Text>
          </View>
        ) : null}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Tafsir body */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={COLORS.ACCENT} size="small" />
            <Text style={styles.loadingText}>Loading tafsir…</Text>
          </View>
        ) : isError ? (
          <Text style={styles.errorText}>
            Could not load tafsir. Please check your connection.
          </Text>
        ) : (
          <Text style={styles.tafsirText}>{tafsirText}</Text>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#131C30',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(20,184,166,0.15)',
  },
  handleIndicator: {
    backgroundColor: COLORS.ACCENT,
    width: 40,
    height: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.ACCENT,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  verseKeyLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    fontVariant: ['tabular-nums'],
  },
  arabicQuoteCard: {
    backgroundColor: 'rgba(20,184,166,0.07)',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.ACCENT,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  arabicQuote: {
    fontFamily: 'AmiriQuran',
    fontSize: 22,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 38,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.CARD_BORDER,
    marginBottom: 18,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    lineHeight: 22,
  },
  tafsirText: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 26,
  },
});
