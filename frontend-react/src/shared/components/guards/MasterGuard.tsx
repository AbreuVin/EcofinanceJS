import type { ReactNode } from "react";
import { Redirect } from "wouter";
import { useAuthStore } from "@/store/authStore";

interface MasterGuardProps {
    children: ReactNode;
}

export function MasterGuard({ children }: MasterGuardProps) {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Redirect to="/login" replace />;
    }

    if (user?.role !== "MASTER") {
        return <Redirect to="/" replace />;
    }

    return <>{children}</>;
}