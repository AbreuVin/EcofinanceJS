import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore.ts";
import LoginCard from "@/features/auth/components/LoginCard.tsx";

function LoginPage() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [, setLocation] = useLocation();

    useEffect(() => {
        if (isAuthenticated) {
            setLocation("/home");
        }
    }, [isAuthenticated, setLocation]);

    if (isAuthenticated) {
        return null;
    }

    return (
        <main className="flex h-full w-full flex-col items-center justify-center px-4 text-center">
            <LoginCard />
        </main>
    );
}

export default LoginPage;