export interface Verse {
  verseKey: string; // "12:4"
  verseNumber: number;
  textUthmani: string; // Arabic
  translation: string; // English
  audioUrl: string | null;
}

export interface QuestContent {
  journeyId: string;
  questId: string;
  verses: Verse[];
}

// --- Quran Foundation Content API v4 raw shapes ---

interface WordField {
  text_uthmani: string;
}

interface RawWord {
  text_uthmani?: string;
}

interface RawTranslation {
  text: string;
  resource_id: number;
}

interface RawVerse {
  id: number;
  verse_key: string;
  verse_number: number;
  words?: RawWord[];
  text_uthmani?: string;
  translations?: RawTranslation[];
}

interface RawVerseApiResponse {
  verses: RawVerse[];
}

interface RawAudioFile {
  verse_key: string;
  url: string;
}

interface RawAudioApiResponse {
  audio_files: RawAudioFile[];
}

export type { RawVerseApiResponse, RawAudioApiResponse, RawAudioFile, RawVerse, WordField };
