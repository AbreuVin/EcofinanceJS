import type { User } from "@/types/User.ts";
import { create } from 'zustand';
import { createJSONStorage, persist } from "zustand/middleware";
import { isTokenExpired } from "@/lib/authUtils.ts";

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    checkSession: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            login: (token, user) => set({ token, user, isAuthenticated: true }),
            logout: () => set({ token: null, user: null, isAuthenticated: false }),

            checkSession: () => {
                const { token, logout } = get();
                if (!token || isTokenExpired(token)) {
                    logout();
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)