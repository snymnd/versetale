import { useQuery } from '@tanstack/react-query';

import { STALE_TIMES } from '@/lib/constants';
import type { Verse, RawVerseApiResponse, RawAudioApiResponse } from './types';

const QDC_BASE = 'https://api.qurancdn.com/api/qdc';
const TRANSLATION_ID = 131; // Saheeh International en
const DEFAULT_RECITER_ID = 7; // Mishary Rashid al-Afasy

// Strip HTML tags that the API occasionally wraps around translation text
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/** Fetch audio URL map for a chapter: { "12:4": "https://..." } */
async function fetchAudioMap(
  surah: number,
  reciterId: number,
): Promise<Record<string, string>> {
  const url = `${QDC_BASE}/audio/reciters/${reciterId}/audio_files?chapter=${surah}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Audio fetch failed: ${res.status}`);
  const data = (await res.json()) as RawAudioApiResponse;

  const map: Record<string, string> = {};
  for (const file of data.audio_files) {
    map[file.verse_key] = file.url;
  }
  return map;
}

/**
 * Fetch all verses for a surah within [from, to] (inclusive, 1-indexed verse numbers).
 * Pulls audio URLs for the entire chapter so each Verse has its URL ready.
 */
async function fetchVersesByRange(
  surah: number,
  from: number,
  to: number,
  reciterId: number,
): Promise<Verse[]> {
  // Quran API uses page + per_page; we request enough to cover our range
  const perPage = to - from + 1;
  const url =
    `${QDC_BASE}/verses/by_chapter/${surah}` +
    `?translations=${TRANSLATION_ID}` +
    `&fields=text_uthmani` +
    `&verse_start=${from}&verse_end=${to}` +
    `&per_page=${perPage}&page=1`;

  const [verseRes, audioMap] = await Promise.all([
    fetch(url),
    fetchAudioMap(surah, reciterId),
  ]);

  if (!verseRes.ok) throw new Error(`Verse fetch failed: ${verseRes.status}`);
  const data = (await verseRes.json()) as RawVerseApiResponse;

  return data.verses.map((raw) => {
    const translationRaw = raw.translations?.[0]?.text ?? '';
    return {
      verseKey: raw.verse_key,
      verseNumber: raw.verse_number,
      textUthmani: raw.text_uthmani ?? '',
      translation: stripHtml(translationRaw),
      audioUrl: audioMap[raw.verse_key] ?? null,
    };
  });
}

/**
 * useVersesByRange — fetches the verses for a quest's verseRange.
 * @param surah   Surah number (e.g. 12)
 * @param from    First verse number in range (inclusive)
 * @param to      Last verse number in range (inclusive)
 * @param reciterId  Reciter ID (defaults to Mishary)
 */
export function useVersesByRange(
  surah: number,
  from: number,
  to: number,
  reciterId: number = DEFAULT_RECITER_ID,
) {
  return useQuery({
    queryKey: ['verses', surah, from, to, reciterId],
    queryFn: () => fetchVersesByRange(surah, from, to, reciterId),
    staleTime: STALE_TIMES.VERSE_CONTENT,
    enabled: surah > 0 && from > 0 && to >= from,
  });
}

/**
 * useVerseAudio — fetches audio file list for an entire chapter.
 * Returns { verseKey → audioUrl } map.
 */
export function useVerseAudio(surah: number, reciterId: number = DEFAULT_RECITER_ID) {
  return useQuery({
    queryKey: ['audio', surah, reciterId],
    queryFn: () => fetchAudioMap(surah, reciterId),
    staleTime: STALE_TIMES.VERSE_CONTENT,
    enabled: surah > 0,
  });
}
