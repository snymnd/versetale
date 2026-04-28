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
    const expectedState = _request?.state;
    console.log('[useAuth] login() called, redirectUri:', REDIRECT_URI);

    const result = await promptAsync();
    console.log('[useAuth] promptAsync result type:', result.type, result.type === 'error' ? result.error : '');

    if (result.type !== 'success') {
      console.log('[useAuth] auth not successful, aborting');
      return;
    }

    const { code, state } = result.params;
    console.log('[useAuth] received code:', code ? `${code.slice(0, 20)}…` : 'MISSING');

    if (expectedState && state !== expectedState) {
      console.warn('[useAuth] state mismatch — possible CSRF. expected:', expectedState, 'got:', state);
      return;
    }

    if (!code) {
      console.warn('[useAuth] code is missing from params');
      return;
    }

    const codeVerifier = _request?.codeVerifier;
    console.log('[useAuth] codeVerifier present:', !!codeVerifier);
    if (!codeVerifier) {
      throw new Error('PKCE code verifier is missing — cannot exchange code');
    }

    let tokenResponse: AuthSession.TokenResponse;
    try {
      console.log('[useAuth] exchanging code for tokens…');
      tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          redirectUri: REDIRECT_URI,
          code,
          extraParams: { code_verifier: codeVerifier },
        },
        discovery,
      );
      console.log('[useAuth] token exchange success, accessToken present:', !!tokenResponse.accessToken);
    } catch (err) {
      throw new Error(`Failed to exchange authorization code: ${err instanceof Error ? err.message : String(err)}`);
    }

    const { accessToken: token, refreshToken, idToken, expiresIn } = tokenResponse;

    if (!token) {
      console.warn('[useAuth] no accessToken in token response');
      return;
    }

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
            console.warn('[useAuth] nonce mismatch — possible replay attack');
            return;
          }

          userInfo = {
            sub: decoded.sub ?? userInfo.sub,
            name: decoded.name ?? userInfo.name,
            email: decoded.email ?? userInfo.email,
          };
        }
      } catch (err) {
        console.warn('[useAuth] failed to parse idToken JWT:', err);
      }
    }

    console.log('[useAuth] calling _setSession for user:', userInfo.sub);
    await _setSession({
      accessToken: token,
      refreshToken: refreshToken ?? undefined,
      idToken: idToken ?? undefined,
      expiresIn: expiresIn ?? undefined,
      user: userInfo,
    });
    console.log('[useAuth] _setSession complete');
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
