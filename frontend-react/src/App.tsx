import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

import LoginPage from "@/shared/pages/LoginPage";
import HomePage from "@/shared/pages/HomePage";
import { RequireAuth } from "@/shared/components/RequireAuth";
import { Toaster } from "@/components/ui/sonner.tsx";
import CompaniesPage from "@/features/companies/pages/CompaniesPage.tsx";
import UnitsPage from "@/features/units/pages/UnitPage.tsx";
import UsersPage from "./features/users/pages/UsersPage";
import AssetsPage from "./features/assets/pages/AssetsPage";
import DataEntryPage from "@/features/data-entry/pages/DataEntryPage.tsx";

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
                    <Route path="/" component={LoginPage}/>

                    <Route path="/home">
                        <RequireAuth>
                            <HomePage/>
                        </RequireAuth>
                    </Route>

                    <Route path="/managers/companies">
                        <RequireAuth>
                            <CompaniesPage/>
                        </RequireAuth>
                    </Route>

                    <Route path="/managers/units">
                        <RequireAuth>
                            <UnitsPage/>
                        </RequireAuth>
                    </Route>

                    <Route path="/managers/users">
                        <RequireAuth>
                            <UsersPage/>
                        </RequireAuth>
                    </Route>

                    <Route path="/managers/sources">
                        <RequireAuth>
                            <AssetsPage />
                        </RequireAuth>
                    </Route>

                    <Route path="/managers/sources/:module">
                        {(_params) => (
                            <RequireAuth>
                                <AssetsPage />
                            </RequireAuth>
                        )}
                    </Route>

                    <Route path="/data-entry/:module">
                        {(_params) => (
                            <RequireAuth>
                                <DataEntryPage/>
                            </RequireAuth>
                        )}
                    </Route>

                    <Route path="/reports/:module">
                        {(_params) => (
                            <RequireAuth>
                                <DataEntryPage/>
                            </RequireAuth>
                        )}
                    </Route>

                    <Route>404 - Not Found</Route>
                    <Toaster/>
                </Switch>
            </QueryClientProvider>
        </div>
    );
}

export default App;