import { useQuery } from '@tanstack/react-query';

import { STALE_TIMES } from '@/lib/constants';
import type { Verse, RawVerseApiResponse } from './types';

const QDC_BASE = 'https://api.qurancdn.com/api/qdc';
const QURAN_API_BASE = 'https://api.quran.com/api/v4';
const QURAN_AUDIO_CDN = 'https://verses.quran.com';
const TRANSLATION_ID = 131; // Saheeh International en
const DEFAULT_RECITER_ID = 7; // Mishari Rashid al-Afasy

interface RawAudioFile {
  verse_key: string;
  url: string;
}

interface RawAudioResponse {
  audio_files: RawAudioFile[];
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

async function fetchAudioMapForChapter(
  surah: number,
  reciterId: number,
): Promise<Record<string, string>> {
  const url =
    `${QURAN_API_BASE}/recitations/${reciterId}/by_chapter/${surah}` +
    `?per_page=300`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Audio fetch failed: ${res.status}`);
  const data = (await res.json()) as RawAudioResponse;

  return Object.fromEntries(
    data.audio_files.map((f) => [
      f.verse_key,
      `${QURAN_AUDIO_CDN}/${f.url}`,
    ]),
  );
}

async function fetchVersesByRange(
  surah: number,
  from: number,
  to: number,
  reciterId: number,
): Promise<Verse[]> {
  const perPage = to - from + 1;
  const verseUrl =
    `${QDC_BASE}/verses/by_chapter/${surah}` +
    `?translations=${TRANSLATION_ID}` +
    `&fields=text_uthmani` +
    `&verse_start=${from}&verse_end=${to}` +
    `&per_page=${perPage}&page=1`;

  const [verseRes, audioMap] = await Promise.all([
    fetch(verseUrl),
    fetchAudioMapForChapter(surah, reciterId),
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
