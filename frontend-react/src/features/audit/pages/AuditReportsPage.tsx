import { useState, useMemo, useEffect } from "react";
import { useParams } from "wouter";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, FileText, Loader2 } from "lucide-react";
import { useAdminReports } from "@/features/audit/hook/useAdminReports.ts";
import { ESG_MODULES } from "@/types/enums.ts";
import { exportToExcel } from "@/features/audit/utils/exportToExcel";

import { useAssets } from "@/features/assets/hooks/useAssets";

const HIDDEN_COLUMNS = ['id', 'unitId', 'createdAt', 'updatedAt', 'unit', 'evidence', 'evidenceGroupId'];

// --- DICIONÁRIO DE TRADUÇÃO (MAPPER) ---
const COLUMN_TRANSLATIONS: Record<string, string> = {
    year: "Ano",
    period: "Período",
    sourceDescription: "Fonte Emissora",
    fuelType: "Combustível / Fonte",
    consumption: "Consumo",
    unitMeasure: "Unidade de Medida",
    isCompanyControlled: "Controle da Empresa",
    distance: "Distância",
    quantity: "Quantidade",
    vehicleType: "Tipo de Veículo",
    gasType: "Tipo de Gás",
    quantityReplaced: "Qtd. Reposta",
};

const translateColumn = (key: string) => {
    if (COLUMN_TRANSLATIONS[key]) {
        return COLUMN_TRANSLATIONS[key];
    }
    return key.charAt(0).toUpperCase() + key.slice(1);
};

const AuditReportsPage = () => {
    const params = useParams();
    const unitId = params.unitId || "";

    const [sourceType, setSourceType] = useState<string>("");
    const [page, setPage] = useState(1);
    const limit = 10;

    // 1. Busca os Assets cadastrados
    const { data: assets, isLoading: isLoadingAssets } = useAssets();

    // 2. MÁGICA DO DROPDOWN: Filtra os módulos que possuem AssetTypology
    const activeModules = useMemo(() => {
        if (!assets || assets.length === 0) return [];

        // Aqui pegamos todos os sourceTypes únicos que existem nos assets
        // (Se quiser ser extremamente rigoroso, pode filtrar os assets onde a unidade é igual ao unitId)
        const registeredSourceTypes = new Set(assets.map(a => a.sourceType));

        return ESG_MODULES.filter(mod => registeredSourceTypes.has(mod.value));
    }, [assets]);

    // 3. Auto-seleciona o primeiro módulo ativo
    useEffect(() => {
        if (activeModules.length > 0 && (!sourceType || !activeModules.find(m => m.value === sourceType))) {
            setSourceType(activeModules[0].value);
            setPage(1);
        }
    }, [activeModules, sourceType]);

    // Só busca os relatórios se já tivermos um sourceType definido
    const { data: response, isLoading: isLoadingReports } = useAdminReports(sourceType, unitId, page, limit);

    const isLoading = isLoadingAssets || isLoadingReports;
    const reports: Record<string, any>[] = response?.data || [];
    const meta = response?.meta;

    const dynamicColumns = useMemo(() => {
        if (reports.length === 0) return [];

        const allKeys = Object.keys(reports[0]);
        const visibleKeys = allKeys.filter(key => !HIDDEN_COLUMNS.includes(key));

        const priority = ['year', 'period'];

        return visibleKeys.sort((a, b) => {
            const indexA = priority.indexOf(a);
            const indexB = priority.indexOf(b);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [reports]);

    const handleModuleChange = (val: string) => {
        setSourceType(val);
        setPage(1);
    };

    const handleExportExcel = () => {
        if (!reports.length || dynamicColumns.length === 0) return;
        const moduleName = activeModules.find(m => m.value === sourceType)?.label || sourceType;
        exportToExcel({
            data: reports,
            columns: dynamicColumns.map(col => ({ key: col, header: translateColumn(col) })),
            fileName: `reportes_${moduleName.replace(/\s+/g, "_").toLowerCase()}`,
            sheetName: moduleName,
        });
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-full space-y-4 p-4 md:p-8 pt-6 bg-background">

                <div className="flex flex-col gap-1 mb-4">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors w-fit"
                    >
                        <ArrowLeft className="h-3 w-3 mr-1" />
                        Voltar para Unidades
                    </button>
                    <div className="flex items-center justify-between mt-2">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                <FileText className="h-6 w-6 text-primary" />
                                Reportes da Unidade
                            </h2>
                            <p className="text-muted-foreground">
                                Visão completa de todos os dados lançados.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportExcel}
                            disabled={isLoading || reports.length === 0}
                            className="gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Exportar Excel
                        </Button>
                    </div>
                </div>

                <div className="w-64">
                    <Select
                        value={sourceType}
                        onValueChange={handleModuleChange}
                        disabled={isLoadingAssets || activeModules.length === 0}
                    >
                        <SelectTrigger>
                            {isLoadingAssets ? (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Carregando módulos...</span>
                                </div>
                            ) : (
                                <SelectValue placeholder={activeModules.length === 0 ? "Nenhuma fonte cadastrada" : "Selecione a fonte"} />
                            )}
                        </SelectTrigger>
                        <SelectContent>
                            {activeModules.map(mod => (
                                <SelectItem key={mod.value} value={mod.value}>
                                    {mod.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border shadow-sm bg-card overflow-x-auto">
                    <Table className="whitespace-nowrap">
                        <TableHeader>
                            <TableRow>
                                {isLoading ? (
                                    <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                                ) : reports.length > 0 ? (
                                    dynamicColumns.map(col => (
                                        <TableHead key={col} className="uppercase text-xs tracking-wider text-center">
                                            {translateColumn(col)}
                                        </TableHead>
                                    ))
                                ) : (
                                    <TableHead>Sem dados</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : reports.length > 0 ? (
                                reports.map((report) => (
                                    <TableRow key={report.id} className="hover:bg-muted/50 transition-colors">
                                        {dynamicColumns.map(col => {
                                            let displayValue = report[col];
                                            if (typeof displayValue === 'boolean') {
                                                displayValue = displayValue ? 'Sim' : 'Não';
                                            }

                                            return (
                                                <TableCell key={`${report.id}-${col}`} className="text-center">
                                                    {displayValue === null || displayValue === '' || displayValue === undefined
                                                        ? <span className="text-muted-foreground/50">-</span>
                                                        : String(displayValue)}
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={1} className="h-32 text-center text-muted-foreground">
                                        {activeModules.length === 0
                                            ? "Cadastre fontes emissoras em 'Ativos' para visualizar os dados."
                                            : "Nenhum reporte encontrado para este módulo."}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Página <span className="font-medium text-foreground">{meta?.page || 1}</span> de <span className="font-medium text-foreground">{meta?.totalPages || 1}</span> (Total: {meta?.total || 0})
                    </p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={isLoading || page === 1}>Anterior</Button>
                        <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={isLoading || !meta || page >= meta.totalPages}>Próxima</Button>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default AuditReportsPage;