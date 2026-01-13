import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore.ts";
import LoginCard from "@/features/auth/components/LoginCard.tsx";

function LoginPage() {
    // 1. Listen to the authentication state
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // 2. Get the navigation function from Wouter
    const [, setLocation] = useLocation();

    // 3. React to state changes
    useEffect(() => {
        if (isAuthenticated) {
            setLocation("/home");
        }
    }, [isAuthenticated, setLocation]);

    // 4. Optional: Prevent "flash" of login form while redirecting
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