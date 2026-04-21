import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? 'VerseTale',
  slug: config.slug ?? 'versetale',
  extra: {
    ...config.extra,
    qfClientId: process.env.QF_CLIENT_ID,
    qfClientSecret: process.env.QF_CLIENT_SECRET,
    qfEnv: process.env.QF_ENV ?? 'prelive',
  },
});
