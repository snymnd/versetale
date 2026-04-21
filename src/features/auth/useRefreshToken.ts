import { getQfOAuthConfig } from '@/lib/qfOAuthConfig';
import { useAuthStore } from './authStore';

let inFlight: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (inFlight) return inFlight;

  inFlight = _doRefresh().finally(() => {
    inFlight = null;
  });

  return inFlight;
}

async function _doRefresh(): Promise<string | null> {
  const { refreshToken, user } = useAuthStore.getState();

  if (!refreshToken || !user) {
    await useAuthStore.getState().logout();
    return null;
  }

  const { authBaseUrl, clientId } = getQfOAuthConfig();

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
  });

  const res = await fetch(`${authBaseUrl}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    await useAuthStore.getState().logout();
    throw new Error('Failed to refresh access token');
  }

  const data = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    id_token?: string;
    expires_in?: number;
  };

  await useAuthStore.getState()._setSession({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    user,
  });

  return data.access_token;
}
