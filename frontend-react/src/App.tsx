import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

// Pages
import LoginPage from "@/shared/pages/LoginPage";
import HomePage from "@/shared/pages/HomePage";
import ManagerPage from "@/shared/pages/ManagerPage"; // The Generic Body
import { RequireAuth } from "@/shared/components/RequireAuth";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { Toaster } from "@/components/ui/sonner.tsx";

const queryClient = new QueryClient();

function App() {
    const checkSession = useAuthStore((state) => state.checkSession);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    return (
        <div className="h-screen w-screen">
            <QueryClientProvider client={queryClient}>
                <Switch>
                    {/* Public Routes */}
                    <Route path="/" component={LoginPage} />

                    {/* Protected Routes */}
                    <Route path="/home">
                        <RequireAuth>
                            <HomePage />
                        </RequireAuth>
                    </Route>

                    {/* THE MAGIC ROUTE: Handles Units, Users, and Sources dynamically */}
                    <Route path="/managers/:type">
                        {(_params) => (
                            <RequireAuth>
                                <DashboardLayout>
                                    <ManagerPage />
                                </DashboardLayout>
                            </RequireAuth>
                        )}
                    </Route>

                    {/* Fallback 404 (Optional) */}
                    <Route>404 - Not Found</Route>
                    <Toaster/>
                </Switch>
            </QueryClientProvider>
        </div>
    );
}

export default App;