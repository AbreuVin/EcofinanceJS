import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ChevronDown, ChevronRight, Download, Factory, Loader2, Search } from "lucide-react";
import { useAdminUnits } from "@/features/audit/hook/useAdminUnits.ts";
import { useAdminReportsByCompany } from "@/features/audit/hook/useAdminReportsByCompany.ts";
import { useAssets } from "@/features/assets/hooks/useAssets";
import { exportToExcel } from "@/features/audit/utils/exportToExcel";
import { ESG_MODULES } from "@/types/enums";
import { SCOPE_LABELS, getScopeModules } from "@/constants/scopeModules";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ---- Constantes de tradução (mesmo padrão do AuditReportsPage) ----
const HIDDEN_COLUMNS = [
    'id', 'unitId', 'createdAt', 'updatedAt', 'unit',
    'evidence', 'evidenceGroupId', 'assetFields',
    'consumptionUnit', 'distanceUnit'
];

const COLUMN_TRANSLATIONS: Record<string, string> = {
    unitName: "Unidade Empresarial",
    year: "Ano",
    period: "Período",
    sourceDescription: "Fonte Emissora",
    inputType: "Tipo de Entrada",
    fuelType: "Combustível / Fonte",
    consumption: "Consumo",
    unitMeasure: "Unidade de Medida",
    reportType: "Tipo de Relatório",
    isCompanyControlled: "Controle da Empresa",
    distance: "Distância",
    quantity: "Quantidade",
    vehicleType: "Tipo de Veículo",
    gasType: "Tipo de Gás",
    quantityReplaced: "Qtd. Reposta",
    comments: "Observações",
};

const translateColumn = (key: string) => {
    if (COLUMN_TRANSLATIONS[key]) return COLUMN_TRANSLATIONS[key];
    return key.charAt(0).toUpperCase() + key.slice(1);
};

const AuditUnitsPage = () => {
    const [, setLocation] = useLocation();
    const params = useParams();
    const companyId = params.companyId || "";

    // ---- States de Paginação e Busca ----
    const [page, setPage] = useState(1);
    const limit = 10;
    const [inputValue, setInputValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // ---- State do filtro de fonte para export ----
    const [selectedSourceType, setSelectedSourceType] = useState<string>("");

    // Debounce da busca
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(inputValue);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue]);

    // ---- Queries ----
    const { data: response, isLoading } = useAdminUnits(companyId, page, limit, debouncedSearch);
    const { data: assets, isLoading: isLoadingAssets } = useAssets();
    const { data: companyReports, isLoading: isLoadingExport } = useAdminReportsByCompany(
        selectedSourceType, companyId
    );

    const units = response?.data || [];
    const meta = response?.meta;

    // Módulos ativos (somente fontes cadastradas em assets)
    const activeModules = useMemo(() => {
        if (!assets || assets.length === 0) return [];
        const registeredSourceTypes = new Set(assets.map(a => a.sourceType));
        return ESG_MODULES.filter(mod => registeredSourceTypes.has(mod.value));
    }, [assets]);

    // Label legível da fonte selecionada
    const selectedSourceLabel = useMemo(() => {
        if (!selectedSourceType) return null;
        const mod = ESG_MODULES.find(m => m.value === selectedSourceType);
        return mod?.label || selectedSourceType;
    }, [selectedSourceType]);

    // ---- Enriquecimento dos reportes (igual ao AuditReportsPage) ----
    const enrichedReports = useMemo(() => {
        if (!companyReports || companyReports.length === 0) return [];

        return companyReports.map((report: any) => {
            const matchedAsset = assets?.find(
                a => a.description === report.sourceDescription && a.sourceType === selectedSourceType
            );

            let parsedFields: any = {};
            if (matchedAsset && matchedAsset.assetFields) {
                try {
                    parsedFields = typeof matchedAsset.assetFields === 'string'
                        ? JSON.parse(matchedAsset.assetFields)
                        : matchedAsset.assetFields;
                } catch (e) {
                    console.error("Erro ao extrair assetFields do ativo", e);
                }
            }

            const unifiedUnitMeasure = report.consumptionUnit || report.distanceUnit || parsedFields.unitMeasure || null;

            return {
                ...parsedFields,
                ...report,
                unitName: report.unit?.name || "-",
                unitMeasure: unifiedUnitMeasure,
            };
        });
    }, [companyReports, assets, selectedSourceType]);

    // ---- Colunas dinâmicas para o Excel ----
    const dynamicColumns = useMemo(() => {
        if (!enrichedReports || enrichedReports.length === 0) return [];

        const keySet = new Set<string>();
        enrichedReports.forEach((report: any) => {
            Object.keys(report).forEach(key => keySet.add(key));
        });

        const visibleKeys = Array.from(keySet).filter(key => !HIDDEN_COLUMNS.includes(key));

        // Prioridade: unitName primeiro, depois year, period, sourceDescription
        const priority = ['unitName', 'year', 'period', 'sourceDescription'];
        return visibleKeys.sort((a, b) => {
            const indexA = priority.indexOf(a);
            const indexB = priority.indexOf(b);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [enrichedReports]);

    // ---- Handlers ----
    const handleRowClick = (unitId: number) => {
        setLocation(`/admin/units/${unitId}/reports`);
    };

    const handleSourceSelect = (value: string) => {
        setSelectedSourceType(value);
    };

    const handleExportExcel = () => {
        if (!enrichedReports.length || dynamicColumns.length === 0) return;
        const moduleName = selectedSourceLabel || selectedSourceType;
        exportToExcel({
            data: enrichedReports,
            columns: dynamicColumns.map(col => ({ key: col, header: translateColumn(col) })),
            fileName: `reportes_todas_unidades_${moduleName.replace(/\s+/g, "_").toLowerCase()}`,
            sheetName: moduleName,
        });
    };

    // Filtra fontes do dropdown por escopo, mostrando apenas as que são ativas
    const getActiveScopeModules = (scopeKey: string) => {
        const scopeModules = getScopeModules(scopeKey);
        const activeValues = new Set(activeModules.map(m => m.value));
        return scopeModules.filter(mod => activeValues.has(mod.value));
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-full space-y-4 p-4 md:p-8 pt-6">

                {/* Header & Breadcrumb */}
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

                {/* Seção de Export Multi-Unidade */}
                <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Exportar Excel — Todas as Unidades
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Selecione uma fonte de emissão para baixar os registros de todas as unidades desta empresa em um único arquivo Excel.
                    </p>
                    <div className="flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-[400px] justify-between"
                                    disabled={isLoadingAssets || activeModules.length === 0}
                                >
                                    {isLoadingAssets ? (
                                        <span className="flex items-center gap-2 text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Carregando fontes...
                                        </span>
                                    ) : selectedSourceLabel ? (
                                        selectedSourceLabel
                                    ) : activeModules.length === 0 ? (
                                        "Nenhuma fonte cadastrada"
                                    ) : (
                                        "Selecione Escopo → Fonte"
                                    )}
                                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[400px]">
                                {Object.entries(SCOPE_LABELS).map(([scopeKey, scopeLabel]) => {
                                    const modules = getActiveScopeModules(scopeKey);
                                    if (modules.length === 0) return null;
                                    return (
                                        <DropdownMenuSub key={scopeKey}>
                                            <DropdownMenuSubTrigger>
                                                {scopeLabel}
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent className="max-h-[300px] overflow-y-auto">
                                                {modules.map((mod) => (
                                                    <DropdownMenuItem
                                                        key={mod.value}
                                                        onClick={() => handleSourceSelect(mod.value)}
                                                    >
                                                        {mod.label}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleExportExcel}
                            disabled={!selectedSourceType || isLoadingExport || enrichedReports.length === 0}
                            className="gap-2"
                        >
                            {isLoadingExport ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            Exportar Excel
                        </Button>
                    </div>
                    {selectedSourceType && !isLoadingExport && enrichedReports.length === 0 && (
                        <p className="text-xs text-amber-600">
                            Nenhum reporte encontrado para esta fonte nesta empresa.
                        </p>
                    )}
                    {selectedSourceType && !isLoadingExport && enrichedReports.length > 0 && (
                        <p className="text-xs text-emerald-600">
                            {enrichedReports.length} registro(s) encontrado(s) pronto(s) para exportação.
                        </p>
                    )}
                </div>

                {/* Barra de Busca de Unidades */}
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

                {/* Tabela de Unidades */}
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