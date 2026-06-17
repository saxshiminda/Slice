import { create } from 'zustand';
import { setAuthToken } from '@/lib/api';

const TOKEN_KEY = 'slice_admin_token';
const USER_KEY = 'slice_admin_user';

interface AuthState {
  token: string | null;
  username: string | null;
  setAuth: (token: string, username: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  username: null,
  setAuth: (token, username) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, username);
    setAuthToken(token);
    set({ token, username });
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthToken(null);
    set({ token: null, username: null });
  },
  hydrate: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const username = localStorage.getItem(USER_KEY);
    if (token) setAuthToken(token);
    set({ token, username });
  },
}));
