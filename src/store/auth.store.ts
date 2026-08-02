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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      login: (user, token) => {
        localStorage.setItem('vita_token', token);
        set({ user, token, isLoggedIn: true });
      },
      logout: () => {
        localStorage.removeItem('vita_token');
        set({ user: null, token: null, isLoggedIn: false });
      },
      updateUser: (updatedData) => set((state) => ({
        user: state.user ? { ...state.user, ...updatedData } : null
      })),
    }),
    {
      name: 'vita-auth-storage', // name of item in storage (must be unique)
      partialize: (state) => ({ user: state.user, token: state.token, isLoggedIn: state.isLoggedIn }),
    }
  )
);
