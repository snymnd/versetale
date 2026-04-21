// OAuth / API constants — values come from the .env file loaded at build time
export const AUTH_CLIENT_ID = 'f8c3932c-74ad-4628-b223-9679142f86e1';
export const AUTH_ENDPOINT = 'https://prelive-oauth2.quran.foundation';

export const AUTH_DISCOVERY = {
  authorizationEndpoint: `${AUTH_ENDPOINT}/oauth2/auth`,
  tokenEndpoint: `${AUTH_ENDPOINT}/oauth2/token`,
  revocationEndpoint: `${AUTH_ENDPOINT}/oauth2/revoke`,
};

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

// Design tokens (mirror tailwind config for use in StyleSheet)
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
