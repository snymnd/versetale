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

// Legacy color constants — kept as a re-export so older imports keep
// compiling. New surfaces should pull semantic colors from `useColors()`
// in `@/lib/theme` instead.
export { COLORS } from './theme';
