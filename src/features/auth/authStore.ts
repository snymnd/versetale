import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { SECURE_STORE_KEYS } from '@/lib/constants';

interface User {
  sub: string;
  name: string;
  email: string;
}

interface SessionParams {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn?: number;
  user: User;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _setSession: (params: SessionParams) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  idToken: null,
  expiresAt: null,
  isAuthenticated: false,
  isLoading: true,

  _setSession: async ({ accessToken, refreshToken, idToken, expiresIn, user }) => {
    const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : null;

    await Promise.all([
      SecureStore.setItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN, accessToken),
      SecureStore.setItemAsync(SECURE_STORE_KEYS.USER, JSON.stringify(user)),
      refreshToken
        ? SecureStore.setItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN, refreshToken)
        : Promise.resolve(),
      idToken
        ? SecureStore.setItemAsync(SECURE_STORE_KEYS.ID_TOKEN, idToken)
        : Promise.resolve(),
    ]);

    set({
      accessToken,
      refreshToken: refreshToken ?? null,
      idToken: idToken ?? null,
      expiresAt,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ID_TOKEN),
      SecureStore.deleteItemAsync(SECURE_STORE_KEYS.USER),
    ]);
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      idToken: null,
      expiresAt: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  restoreSession: async () => {
    try {
      set({ isLoading: true });
      const [accessToken, refreshToken, idToken, userJson] = await Promise.all([
        SecureStore.getItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN),
        SecureStore.getItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN),
        SecureStore.getItemAsync(SECURE_STORE_KEYS.ID_TOKEN),
        SecureStore.getItemAsync(SECURE_STORE_KEYS.USER),
      ]);

      if (accessToken && userJson) {
        const user = JSON.parse(userJson) as User;
        set({
          accessToken,
          refreshToken: refreshToken ?? null,
          idToken: idToken ?? null,
          expiresAt: null,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ user: null, accessToken: null, refreshToken: null, idToken: null, expiresAt: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
