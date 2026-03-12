import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

import LoginPage from "@/shared/pages/LoginPage";
import HomePage from "@/shared/pages/HomePage";
import { AuthGuard } from "@/shared/components/guards/AuthGuard.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import CompaniesPage from "@/features/companies/pages/CompaniesPage.tsx";
import UnitsPage from "@/features/units/pages/UnitPage.tsx";
import UsersPage from "./features/users/pages/UsersPage";
import AssetsPage from "./features/assets/pages/AssetsPage";
import DataEntryPage from "@/features/data-entry/pages/DataEntryPage.tsx";
import ReportsLandingPage from "@/features/data-entry/pages/ReportsLandingPage.tsx";
import { MasterGuard } from "@/shared/components/guards/MasterGuard.tsx";
import AuditCompaniesPage from "@/features/audit/pages/AuditCompaniesPage.tsx";
import AuditUnitsPage from "@/features/audit/pages/AuditUnitsPage.tsx";
import AuditReportsPage from "@/features/audit/pages/AuditReportsPage.tsx";

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
                        <AuthGuard>
                            <HomePage/>
                        </AuthGuard>
                    </Route>

                    <Route path="/managers/companies">
                        <AuthGuard>
                            <CompaniesPage/>
                        </AuthGuard>
                    </Route>

                    <Route path="/managers/units">
                        <AuthGuard>
                            <UnitsPage/>
                        </AuthGuard>
                    </Route>

                    <Route path="/managers/users">
                        <AuthGuard>
                            <UsersPage/>
                        </AuthGuard>
                    </Route>

                    <Route path="/managers/sources">
                        <AuthGuard>
                            <AssetsPage/>
                        </AuthGuard>
                    </Route>

                    <Route path="/managers/sources/:module">
                        {(_params) => (
                            <AuthGuard>
                                <AssetsPage/>
                            </AuthGuard>
                        )}
                    </Route>

                    <Route path="/data-entry/:module">
                        {(_params) => (
                            <AuthGuard>
                                <DataEntryPage/>
                            </AuthGuard>
                        )}
                    </Route>

                    <Route path="/reports">
                        <AuthGuard>
                            <ReportsLandingPage/>
                        </AuthGuard>
                    </Route>

                    <Route path="/reports/:module">
                        {(_params) => (
                            <AuthGuard>
                                <DataEntryPage/>
                            </AuthGuard>
                        )}
                    </Route>

                    <Route path="/admin/companies">
                        <MasterGuard>
                            <AuditCompaniesPage/>
                        </MasterGuard>
                    </Route>

                    <Route path="/admin/companies/:companyId/units">
                        <MasterGuard>
                            <AuditUnitsPage />
                        </MasterGuard>
                    </Route>

                    <Route path="/admin/units/:unitId/reports">
                        <MasterGuard>
                            <AuditReportsPage />
                        </MasterGuard>
                    </Route>

                    <Route>404 - Not Found</Route>
                    <Toaster/>
                </Switch>
            </QueryClientProvider>
        </div>
    );
}

export default App;