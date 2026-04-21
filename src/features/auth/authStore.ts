import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { SECURE_STORE_KEYS } from '@/lib/constants';

interface User {
  sub: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Actions (login/logout are implemented in useAuth.ts which drives the OAuth flow)
  _setTokens: (accessToken: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  _setTokens: async (accessToken, user) => {
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN, accessToken);
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.USER, JSON.stringify(user));
    set({ accessToken, user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ID_TOKEN);
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.USER);
    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  },

  restoreSession: async () => {
    try {
      set({ isLoading: true });
      const [accessToken, userJson] = await Promise.all([
        SecureStore.getItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN),
        SecureStore.getItemAsync(SECURE_STORE_KEYS.USER),
      ]);

      if (accessToken && userJson) {
        const user = JSON.parse(userJson) as User;
        set({ accessToken, user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      // Corrupted storage — clear everything and start fresh
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
