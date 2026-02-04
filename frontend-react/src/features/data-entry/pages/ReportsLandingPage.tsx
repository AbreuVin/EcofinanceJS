import { useMemo } from "react";
import { useLocation } from "wouter";
import { AlertCircle, ArrowRight, FileText } from "lucide-react";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";

import { useAssets } from "@/features/assets/hooks/useAssets";
import { useAuthStore } from "@/store/authStore";
import { ESG_MODULES, UserRole } from "@/types/enums";

export default function ReportsLandingPage() {
    const [, setLocation] = useLocation();
    const { user } = useAuthStore();
    const { data: assets = [], isLoading } = useAssets();

    const availableModules = useMemo(() => {
        if (!user) return [];

        // 1. Filter assets based on Role and Status
        const relevantAssets = assets.filter(asset => {
            if (!asset.isActive) return false;

            // Master/Admin see all configured modules for the company
            if (user.role === UserRole.MASTER || user.role === UserRole.ADMIN) {
                return true;
            }

            // Standard Users only see modules for their Unit
            return asset.unitId === Number(user.unitId);
        });

        // 2. Extract unique Source Types
        const uniqueTypes = new Set(relevantAssets.map(a => a.sourceType));

        // 3. Map back to ESG_MODULES definition to get labels
        return ESG_MODULES.filter(module => uniqueTypes.has(module.value));
    }, [assets, user]);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 container mx-auto max-w-7xl">
                    <Skeleton className="h-8 w-64" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 container mx-auto max-w-7xl">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Reporte de Dados</h1>
                    <p className="text-muted-foreground text-lg">
                        Selecione um módulo abaixo para iniciar o preenchimento de dados.
                        Exibindo módulos configurados para {user?.role === 'USER' ? 'sua unidade' : 'sua empresa'}.
                    </p>
                </div>

                {availableModules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border rounded-xl border-dashed bg-muted/30 text-center">
                        <AlertCircle className="size-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">Nenhum módulo configurado</h3>
                        <p className="text-muted-foreground max-w-md mt-2">
                            Não há fontes de emissão ativas vinculadas ao seu perfil.
                            {user?.role !== 'USER'
                                ? " Cadastre fontes no menu 'Cadastro de Fontes'."
                                : " Contate o administrador para configurar as fontes da sua unidade."}
                        </p>
                        {user?.role !== 'USER' && (
                            <Button className="mt-6" onClick={() => setLocation("/managers/sources")}>
                                Ir para Cadastro de Fontes
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableModules.map((module) => (
                            <Card
                                key={module.value}
                                className="group hover:border-primary/50 transition-colors cursor-pointer flex flex-col"
                                onClick={() => setLocation(`/reports/${module.value}`)}
                            >
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 bg-primary/10 text-primary rounded-lg w-fit">
                                            <FileText className="size-6" />
                                        </div>
                                    </div>
                                    <CardTitle className="pt-4 text-xl group-hover:text-primary transition-colors">
                                        {module.label}
                                    </CardTitle>
                                    <CardDescription>
                                        Gerenciar reportes e visualizar indicadores.
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="mt-auto pt-0">
                                    <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5 p-0 hover:bg-transparent">
                                        Acessar Módulo
                                        <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}