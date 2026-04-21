// SecureStore keys
export const SECURE_STORE_KEYS = {
  ACCESS_TOKEN: 'versetale_access_token',
  REFRESH_TOKEN: 'versetale_refresh_token',
  ID_TOKEN: 'versetale_id_token',
  USER: 'versetale_user',
} as const;

// React Query stale times
export const STALE_TIMES = {
  VERSE_CONTENT: 60 * 60 * 1000, // 1 hour
  USER_DATA: 5 * 60 * 1000, // 5 minutes
} as const;

// Design tokens
export const COLORS = {
  BG_DEEP: '#0A0F1E',
  BG_SURFACE: '#111827',
  GRADIENT_START: '#1E3A5F',
  GRADIENT_END: '#0D7377',
  ACCENT: '#14B8A6',
  TEXT_PRIMARY: '#F8FAFC',
  TEXT_SECONDARY: '#94A3B8',
  TEXT_TERTIARY: '#64748B',
  CARD_BG: 'rgba(255,255,255,0.06)',
  CARD_BORDER: 'rgba(255,255,255,0.10)',
} as const;
