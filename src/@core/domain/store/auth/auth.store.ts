// src/presentation/store/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  isAuthenticated: boolean;
  
  // Actions
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  setUser: (user: any) => void;
  login: (tokens: { accessToken: string; refreshToken: string }, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      
      setTokens: (tokens) => {
        // เก็บ accessToken ใน Cookie เพื่อให้ middleware สามารถเข้าถึงได้
        Cookies.set('accessToken', tokens.accessToken, { 
          expires: 1, // 1 วัน
          path: '/',
          sameSite: 'strict'
        });
        
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true
        });
      },
      
      setUser: (user) => set({ user }),
      
      login: (tokens, user) => {
        // เก็บ accessToken ใน Cookie
        Cookies.set('accessToken', tokens.accessToken, { 
          expires: 1,
          path: '/',
          sameSite: 'strict'
        });
        
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
          isAuthenticated: true
        });
      },
      
      logout: () => {
        // ลบ accessToken จาก Cookie
        Cookies.remove('accessToken', { path: '/' });
        
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false
        });
        
        // ถ้าต้องการนำทางกลับไปยังหน้าล็อกอิน
        window.location.href = '/auth/login';
      }
    }),
    {
      name: 'auth-storage', // ชื่อ storage key
      partialize: (state) => ({
        // เลือกเก็บเฉพาะข้อมูลบางส่วนใน localStorage
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);