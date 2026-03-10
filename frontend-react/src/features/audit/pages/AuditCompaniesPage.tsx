import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Book, ChevronRight } from "lucide-react";
import { useAdminCompanies } from "@/features/audit/hook/useAdminCompanies.ts";


const AuditCompaniesPage = () => {
    const [, setLocation] = useLocation();

    // Controle da página atual
    const [page, setPage] = useState(1);
    const limit = 10;

    // React Query assume a bronca! Sem mais useEffect, states e try/catch soltos.
    const { data: response, isLoading } = useAdminCompanies(page, limit);

    // Extraindo dados para facilitar a leitura no JSX
    const companies = response?.data || [];
    const meta = response?.meta;

    const handleRowClick = (companyId: string) => {
        setLocation(`/admin/companies/${companyId}/units`);
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-full space-y-4 p-4 md:p-8 pt-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Book className="h-6 w-6 text-primary"/>
                            Empresas Clientes
                        </h2>
                        <p className="text-muted-foreground">
                            Gestão global e acesso aos reportes de todas as empresas cadastradas no sistema.
                        </p>
                    </div>
                </div>

                <div className="rounded-md border shadow-sm bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Empresa</TableHead>
                                <TableHead className="text-center">Unidades</TableHead>
                                <TableHead className="text-center">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-64"/></TableCell>
                                        <TableCell><Skeleton className="h-5 w-16 mx-auto"/></TableCell>
                                        <TableCell><Skeleton className="h-5 w-8 ml-auto"/></TableCell>
                                    </TableRow>
                                ))
                            ) : companies.length > 0 ? (
                                companies.map((company: any) => (
                                    <TableRow
                                        key={company.id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => handleRowClick(company.id)}
                                    >
                                        <TableCell>
                                            {company.name}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div
                                                className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold">
                                                {company._count.units}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button variant="ghost" size="icon"
                                                    className="h-8 w-8 text-muted-foreground pointer-events-none">
                                                <ChevronRight className="h-4 w-4"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                                        Nenhuma empresa cadastrada no sistema.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Controles de Paginação */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Mostrando página <span className="font-medium">{meta?.page || 1}</span> de <span
                        className="font-medium">{meta?.totalPages || 1}</span>
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

export default AuditCompaniesPage;