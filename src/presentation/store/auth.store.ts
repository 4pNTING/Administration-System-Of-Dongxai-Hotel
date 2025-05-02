import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

// Types
interface JwtPayload {
  sub: number;
  userName: string;
  role: string;
  exp: number;
  iat: number;
}

interface AuthState {
  user: {
    id: number;
    userName: string;
    roleId: number;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  setUser: (user: { id: number; userName: string; role: string } | null) => void;
  logout: () => void;
  clearError: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
}

// Helper function to parse JWT token
const parseToken = (token: string | null): { id: number; userName: string; roleId: number } | null => {
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return {
      id: decoded.sub,
      userName: decoded.userName,
      roleId: parseInt(decoded.role, 10), // Rename role to roleId
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Create store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      setTokens: (tokens) => {
        const { accessToken, refreshToken } = tokens;
        const user = parseToken(accessToken);
        
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: !!user,
          error: null,
        });
      },
      
      setUser: (user) => {
        if (user) {
          set({
            user: {
              id: user.id,
              userName: user.userName,
              roleId: parseInt(user.role, 10), // Rename role to roleId
            },
            isAuthenticated: !!user,
          });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      },
      
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      setLoading: (isLoading) => {
        set({ isLoading });
      },
      
      setError: (error) => {
        set({ error, isLoading: false });
      },
    }),
    {
      name: 'auth-storage', // name for localStorage key
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);