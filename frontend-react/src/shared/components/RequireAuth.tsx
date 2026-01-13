// src/components/RequireAuth.tsx (Create this file)
import { useAuthStore } from "@/store/authStore.ts";
import { Redirect } from "wouter";
import type { ReactNode } from "react";

export function RequireAuth({ children }: { children: ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Redirect to="/" />;
    }

    return <>{children}</>;
}