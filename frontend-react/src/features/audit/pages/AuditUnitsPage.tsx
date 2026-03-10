import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ChevronRight, Factory, Search } from "lucide-react";
import { useAdminUnits } from "@/features/audit/hook/useAdminUnits.ts";

const AuditUnitsPage = () => {
    const [, setLocation] = useLocation();
    const params = useParams();
    const companyId = params.companyId || "";

    // Estados de Paginação e Busca
    const [page, setPage] = useState(1);
    const limit = 10;

    const [inputValue, setInputValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Lógica do Debounce (Task 3.6): Espera 500ms o usuário parar de digitar para atualizar a busca real
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(inputValue);
            setPage(1); // Volta para a página 1 ao buscar
        }, 500);

        return () => clearTimeout(timer);
    }, [inputValue]);

    // React Query assume a requisição usando o search com debounce
    const { data: response, isLoading } = useAdminUnits(companyId, page, limit, debouncedSearch);

    const units = response?.data || [];
    const meta = response?.meta;

    // Task 3.7: Roteamento para reportes
    const handleRowClick = (unitId: number) => {
        setLocation(`/admin/units/${unitId}/reports`);
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-full space-y-4 p-4 md:p-8 pt-6">

                {/* Task 3.5: Breadcrumbs e Header */}
                <div className="flex flex-col gap-1 mb-4">
                    <button
                        onClick={() => setLocation('/admin/companies')}
                        className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors w-fit"
                    >
                        <ArrowLeft className="h-3 w-3 mr-1" />
                        Voltar para Empresas
                    </button>
                    <div className="flex items-center justify-between mt-2">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                <Factory className="h-6 w-6 text-primary" />
                                Unidades da Empresa
                            </h2>
                            <p className="text-muted-foreground">
                                Gestão de filiais e operações. Selecione uma unidade para ver os reportes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Task 3.6: Barra de Busca */}
                <div className="flex items-center gap-2 max-w-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nome da unidade..."
                            className="pl-9"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-md border shadow-sm bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome da Unidade</TableHead>
                                <TableHead>Localização</TableHead>
                                <TableHead className="text-center">Colaboradores</TableHead>
                                <TableHead className="text-center">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-12 mx-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-8 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : units.length > 0 ? (
                                units.map((unit: any) => (
                                    <TableRow
                                        key={unit.id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => handleRowClick(unit.id)}
                                    >
                                        <TableCell className="font-medium">
                                            {unit.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {unit.city}{unit.state ? ` - ${unit.state}` : ''}, {unit.country}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {unit.numberOfWorkers || "-"}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground pointer-events-none">
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                        {debouncedSearch
                                            ? "Nenhuma unidade encontrada para a sua busca."
                                            : "Nenhuma unidade cadastrada para esta empresa."}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Controles de Paginação */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Mostrando página <span className="font-medium">{meta?.page || 1}</span> de <span className="font-medium">{meta?.totalPages || 1}</span>
                        {' '}(Total: {meta?.total || 0} registros)
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={isLoading || page === 1}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => p + 1)}
                            disabled={isLoading || !meta || page >= meta.totalPages}
                        >
                            Próxima
                        </Button>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default AuditUnitsPage;