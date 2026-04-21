import { refreshAccessToken } from '@/features/auth/useRefreshToken';
import { useAuthStore } from '@/features/auth/authStore';
import { getQfOAuthConfig } from './qfOAuthConfig';

export async function qfFetch<T>(
  path: string,
  init?: RequestInit,
  _retried = false,
): Promise<T> {
  const { apiBaseUrl, clientId } = getQfOAuthConfig();
  const { accessToken } = useAuthStore.getState();

  const res = await fetch(`${apiBaseUrl}/auth/v1${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      'x-auth-token': accessToken ?? '',
      'x-client-id': clientId,
    },
  });

  if (res.status === 401 && !_retried) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      throw new Error(`QF API request failed: 401 ${path}`);
    }
    return qfFetch<T>(path, init, true);
  }

  if (!res.ok) {
    throw new Error(`QF API request failed: ${res.status} ${path}`);
  }

  return res.json() as Promise<T>;
}
