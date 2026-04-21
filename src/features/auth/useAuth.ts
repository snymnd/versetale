import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useRef } from 'react';

import { getQfOAuthConfig } from '@/lib/qfOAuthConfig';
import { useAuthStore } from './authStore';

// Required to complete the auth session on Android
WebBrowser.maybeCompleteAuthSession();

const SCOPES = ['openid', 'profile', 'email', 'offline_access'];

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
    nonceRef.current = Crypto.randomUUID();

    // Capture state before promptAsync for CSRF validation
    const expectedState = _request?.state;

    const result = await promptAsync();

    if (result.type !== 'success') {
      return;
    }

    const { code, state } = result.params;

    // CSRF: validate state matches what we sent
    if (expectedState && state !== expectedState) {
      return;
    }

    if (!code) {
      return;
    }

    let tokenResponse: AuthSession.TokenResponse;
    try {
      tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: config.clientId,
          redirectUri: REDIRECT_URI,
          code,
          extraParams: {
            code_verifier: _request?.codeVerifier ?? '',
          },
        },
        discovery,
      );
    } catch {
      throw new Error('Failed to exchange authorization code for tokens');
    }

    const { accessToken: token, refreshToken, idToken, expiresIn } = tokenResponse;

    if (!token) {
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

          // Validate nonce to prevent replay attacks
          if (decoded.nonce && decoded.nonce !== nonceRef.current) {
            return;
          }

          userInfo = {
            sub: decoded.sub ?? userInfo.sub,
            name: decoded.name ?? userInfo.name,
            email: decoded.email ?? userInfo.email,
          };
        }
      } catch {
        // Fall back to defaults if JWT parsing fails
      }
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
