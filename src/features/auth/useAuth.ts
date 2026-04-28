import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { useCallback, useRef } from 'react';

import { getQfOAuthConfig } from '@/lib/qfOAuthConfig';
import { useAuthStore } from './authStore';

const SCOPES = ['openid', 'profile', 'offline_access'];

// Must exactly match the redirect URI registered with Quran Foundation for this client ID.
// PRD specifies versetale://auth/callback — ensure QF has this registered.
const REDIRECT_URI = AuthSession.makeRedirectUri({ native: 'versetale://auth/callback' });

export function useAuth() {
  const { user, accessToken, isAuthenticated, isLoading, logout, restoreSession } = useAuthStore();
  const _setSession = useAuthStore((s) => s._setSession);

  const config = getQfOAuthConfig();

  const discovery: AuthSession.DiscoveryDocument = {
    authorizationEndpoint: `${config.authBaseUrl}/oauth2/auth`,
    tokenEndpoint: `${config.authBaseUrl}/oauth2/token`,
    revocationEndpoint: `${config.authBaseUrl}/oauth2/revoke`,
  };

  // Nonce is required when using openid scope (per QF OIDC docs)
  const nonceRef = useRef<string>(Crypto.randomUUID());

  const [_request, _response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: config.clientId,
      redirectUri: REDIRECT_URI,
      scopes: SCOPES,
      usePKCE: true,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        nonce: nonceRef.current,
      },
    },
    discovery,
  );

  const login = useCallback(async () => {
    // Refresh nonce on each attempt to prevent replay attacks across retries.
    nonceRef.current = Crypto.randomUUID();

    const expectedState = _request?.state;

    const result = await promptAsync();

    if (result.type !== 'success') return;

    const { code, state } = result.params;

    if (expectedState && state !== expectedState) {
      if (__DEV__) console.warn('[useAuth] state mismatch — possible CSRF');
      return;
    }

    if (!code) return;

    const codeVerifier = _request?.codeVerifier;
    if (!codeVerifier) {
      throw new Error('PKCE code verifier is missing — cannot exchange code');
    }

    let tokenResponse: AuthSession.TokenResponse;
    try {
      // Mobile apps are public OAuth clients — clientSecret must NOT be sent.
      // Security is provided by PKCE (code_verifier / code_challenge).
      tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: config.clientId,
          redirectUri: REDIRECT_URI,
          code,
          extraParams: { code_verifier: codeVerifier },
        },
        discovery,
      );
    } catch (err) {
      throw new Error(`Failed to exchange authorization code: ${err instanceof Error ? err.message : String(err)}`);
    }

    const { accessToken: token, refreshToken, idToken, expiresIn } = tokenResponse;
    if (!token) return;

    let userInfo = { sub: state ?? 'unknown', name: 'VerseTale User', email: '' };

    if (idToken) {
      try {
        const payloadBase64 = idToken.split('.')[1];
        if (payloadBase64) {
          const decoded = JSON.parse(atob(payloadBase64)) as {
            sub?: string;
            name?: string;
            email?: string;
            nonce?: string;
          };

          if (decoded.nonce && decoded.nonce !== nonceRef.current) {
            if (__DEV__) console.warn('[useAuth] nonce mismatch — possible replay attack');
            return;
          }

          userInfo = {
            sub: decoded.sub ?? userInfo.sub,
            name: decoded.name ?? userInfo.name,
            email: decoded.email ?? userInfo.email,
          };
        }
      } catch { /* malformed idToken — fall back to defaults */ }
    }

    await _setSession({
      accessToken: token,
      refreshToken: refreshToken ?? undefined,
      idToken: idToken ?? undefined,
      expiresIn: expiresIn ?? undefined,
      user: userInfo,
    });
  }, [promptAsync, _request, _setSession, config.clientId, config.authBaseUrl]);

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    restoreSession,
  };
}
