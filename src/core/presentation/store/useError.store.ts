import { create } from 'zustand';

interface ErrorState {
    error: string | undefined;
    setError: (message: string) => void;
    clearError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
    error: undefined,
    setError: (message) => set({ error: message }),
    clearError: () => set({ error: undefined }),
}));