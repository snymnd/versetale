import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useRef } from 'react';

import { AUTH_CLIENT_ID, AUTH_DISCOVERY } from '@/lib/constants';
import { useAuthStore } from './authStore';

// Required to complete the auth session on Android
WebBrowser.maybeCompleteAuthSession();

// Must exactly match the redirect URI registered with Quran Foundation for this client ID.
// PRD specifies versetale://auth/callback — ensure QF has this registered.
const REDIRECT_URI = AuthSession.makeRedirectUri({ native: 'versetale://auth/callback' });

const SCOPES = ['openid', 'profile', 'email', 'offline_access'];

export function useAuth() {
  const { user, accessToken, isAuthenticated, isLoading, logout, restoreSession } = useAuthStore();
  const _setTokens = useAuthStore((s) => s._setTokens);

  // Nonce is required when using openid scope (per QF OIDC docs)
  const nonceRef = useRef<string>(Crypto.randomUUID());

  const [_request, _response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH_CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: SCOPES,
      usePKCE: true,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        nonce: nonceRef.current,
      },
    },
    AUTH_DISCOVERY,
  );

  const login = useCallback(async () => {
    // Fresh nonce for each login attempt
    nonceRef.current = Crypto.randomUUID();

    const result = await promptAsync();

    if (result.type !== 'success') {
      return;
    }

    const { code, state } = result.params;
    if (!code) {
      return;
    }

    // Exchange auth code for tokens.
    // This requires the client to be configured as public (token_endpoint_auth_method=none)
    // by Quran Foundation. Contact developers@quran.com to confirm or request this.
    const tokenResponse = await AuthSession.exchangeCodeAsync(
      {
        clientId: AUTH_CLIENT_ID,
        redirectUri: REDIRECT_URI,
        code,
        extraParams: {
          code_verifier: _request?.codeVerifier ?? '',
        },
      },
      AUTH_DISCOVERY,
    );

    const { accessToken: token, idToken } = tokenResponse;

    if (!token) {
      return;
    }

    // Parse the id_token JWT payload to extract user info
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
            console.error('[Auth] Nonce mismatch — possible replay attack');
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

    await _setTokens(token, userInfo);
  }, [promptAsync, _request, _setTokens]);

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
