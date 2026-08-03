import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

/** Sets a cookie readable by the Next.js middleware (no HttpOnly — client-side only). */
function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      login: (user, token) => {
        // Persist token to localStorage (for axios interceptor)
        localStorage.setItem('vita_token', token);
        // Also set a cookie so the Next.js middleware can enforce SSR route protection
        setCookie('vita_session_token', token, 7);
        set({ user, token, isLoggedIn: true });
      },
      logout: () => {
        localStorage.removeItem('vita_token');
        localStorage.removeItem('vita_user');
        deleteCookie('vita_session_token');
        set({ user: null, token: null, isLoggedIn: false });
      },
      updateUser: (updatedData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        })),
    }),
    {
      name: 'vita-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
