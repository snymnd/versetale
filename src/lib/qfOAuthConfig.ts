import Constants from 'expo-constants';

type QfEnv = 'prelive' | 'production';

interface QfOAuthConfig {
  env: QfEnv;
  clientId: string;
  clientSecret: string | undefined;
  authBaseUrl: string;
  apiBaseUrl: string;
}

const URL_MAP: Record<QfEnv, { authBaseUrl: string; apiBaseUrl: string }> = {
  prelive: {
    authBaseUrl: 'https://prelive-oauth2.quran.foundation',
    apiBaseUrl: 'https://apis-prelive.quran.foundation',
  },
  production: {
    authBaseUrl: 'https://oauth2.quran.foundation',
    apiBaseUrl: 'https://apis.quran.foundation',
  },
};

export function getQfOAuthConfig(): QfOAuthConfig {
  const extra = Constants.expoConfig?.extra as Record<string, string | undefined> | undefined;

  const clientId = extra?.qfClientId;
  if (!clientId) {
    throw new Error(
      'Missing Quran Foundation API credentials. Request access: https://api-docs.quran.foundation/request-access',
    );
  }

  const rawEnv = extra?.qfEnv ?? 'prelive';
  const env: QfEnv = rawEnv === 'production' ? 'production' : 'prelive';
  const { authBaseUrl, apiBaseUrl } = URL_MAP[env];

  return {
    env,
    clientId,
    clientSecret: extra?.qfClientSecret,
    authBaseUrl,
    apiBaseUrl,
  };
}
