import { useState, useMemo } from "react";
import {
    type ColumnDef,
    type CellContext,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ClipboardEdit, Filter, X } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { MONTHS } from "@/features/assets/constants/esg-options";
import type { AssetTypology } from "@/types/AssetTypology.ts";
import type { EsgModuleType } from "@/types/enums.ts";
import { SPECIFIC_COLUMNS } from "@/features/assets/components/AssetColumns.tsx";

interface AssetWithProgress extends AssetTypology {
    progress: {
        current: number;
        total: number;
        filledMonths: string[];
    };
}

interface DataEntryTableProps {
    assets: AssetWithProgress[];
    module: EsgModuleType;
    onReport: (asset: AssetTypology) => void;
}

// Helper to get display label for reportingFrequency
function getFrequencyLabel(value: string): string {
    const labels: Record<string, string> = {
        mensal: "Mensal",
        anual: "Anual",
        Mensal: "Mensal",
        Anual: "Anual",
    };
    return labels[value] || value;
}

// Generic Column Filter Component
function DynamicColumnFilter({
    columnLabel,
    uniqueValues,
    selectedValues,
    onFilterChange,
}: {
    columnLabel: string;
    uniqueValues: string[];
    selectedValues: string[];
    onFilterChange: (values: string[]) => void;
}) {
    const hasFilters = selectedValues.length > 0;

    const handleToggle = (value: string) => {
        const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];
        onFilterChange(newValues);
    };

    const handleClearAll = () => {
        onFilterChange([]);
    };

    if (uniqueValues.length === 0) {
        return <span>{columnLabel}</span>;
    }

    return (
        <div className="flex items-center gap-1">
            <span>{columnLabel}</span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 ${hasFilters ? "text-primary" : "text-muted-foreground"}`}
                    >
                        <Filter className="h-3 w-3" />
                        {hasFilters && (
                            <Badge
                                variant="secondary"
                                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                            >
                                {selectedValues.length}
                            </Badge>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 max-h-64 overflow-y-auto">
                    <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-xs font-medium text-muted-foreground">Filtrar por {columnLabel}</span>
                        {hasFilters && (
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={handleClearAll}>
                                <X className="h-3 w-3 mr-1" />
                                Limpar
                            </Button>
                        )}
                    </div>
                    <DropdownMenuSeparator />
                    {uniqueValues.map((value) => (
                        <DropdownMenuCheckboxItem
                            key={value}
                            checked={selectedValues.includes(value)}
                            onCheckedChange={() => handleToggle(value)}
                        >
                            {value}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export function DataEntryTable({ assets, onReport, module }: DataEntryTableProps) {
    const [frequencyFilter, setFrequencyFilter] = useState<string[]>([]);
    const [dynamicFilters, setDynamicFilters] = useState<Record<string, string[]>>({});

    // Get the source columns for this module
    const sourceCols = useMemo(() => {
        return (SPECIFIC_COLUMNS[module] || []) as ColumnDef<AssetWithProgress>[];
    }, [module]);

    // Extract unique values for frequency filter
    const frequencyValues = useMemo(() => {
        if (!assets || assets.length === 0) return [];
        return [...new Set(assets.map(a => a.reportingFrequency))].filter(Boolean).sort();
    }, [assets]);

    // Safely get column value using accessorFn
    const getColumnValue = (col: ColumnDef<AssetWithProgress>, item: AssetWithProgress): string | null => {
        try {
            const accessorFn = (col as any).accessorFn;
            if (typeof accessorFn === 'function') {
                const value = accessorFn(item);
                if (value != null && value !== "-" && value !== "undefined" && value !== "null") {
                    return String(value);
                }
            }
        } catch {
            // Ignore errors
        }
        return null;
    };

    // Pre-compute unique values for each dynamic column
    const dynamicColumnValues = useMemo(() => {
        const result: Record<string, string[]> = {};
        if (!assets || assets.length === 0) return result;
        
        sourceCols.forEach((col) => {
            const header = typeof col.header === 'string' ? col.header : '';
            if (!header) return;
            
            const values = new Set<string>();
            assets.forEach((item) => {
                const value = getColumnValue(col, item);
                if (value) values.add(value);
            });
            
            if (values.size > 0 && values.size <= 50) { // Only enable filter if reasonable number of values
                result[header] = Array.from(values).sort();
            }
        });
        
        return result;
    }, [sourceCols, assets]);

    // Handle dynamic filter changes
    const handleDynamicFilterChange = (columnHeader: string, values: string[]) => {
        setDynamicFilters(prev => ({ ...prev, [columnHeader]: values }));
    };

    // Filter data based on all filters
    const filteredData = useMemo(() => {
        if (!assets || assets.length === 0) return [];
        
        return assets.filter((item) => {
            // Check frequency filter
            if (frequencyFilter.length > 0 && !frequencyFilter.includes(item.reportingFrequency)) {
                return false;
            }
            
            // Check dynamic column filters
            for (const col of sourceCols) {
                const header = typeof col.header === 'string' ? col.header : '';
                const selectedValues = dynamicFilters[header];
                if (selectedValues && selectedValues.length > 0) {
                    const value = getColumnValue(col, item);
                    if (!value || !selectedValues.includes(value)) {
                        return false;
                    }
                }
            }
            
            return true;
        });
    }, [assets, frequencyFilter, dynamicFilters, sourceCols]);

    // Check if any filters are active
    const hasActiveFilters = frequencyFilter.length > 0 || 
        Object.values(dynamicFilters).some(v => v.length > 0);

    // Get active filter labels for display
    const activeFilterLabels = useMemo(() => {
        const labels: { key: string; label: string; count: number }[] = [];
        
        if (frequencyFilter.length > 0) {
            labels.push({ key: "frequency", label: "Frequência", count: frequencyFilter.length });
        }
        
        Object.entries(dynamicFilters).forEach(([key, values]) => {
            if (values.length > 0) {
                labels.push({ key, label: key, count: values.length });
            }
        });
        
        return labels;
    }, [frequencyFilter, dynamicFilters]);

    // Clear all filters
    const clearAllFilters = () => {
        setFrequencyFilter([]);
        setDynamicFilters({});
    };

    const columns = useMemo<ColumnDef<AssetWithProgress>[]>(() => {
        return [
            {
                accessorKey: "description",
                header: "Fonte de Emissão",
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-medium">{row.original.description}</span>
                    </div>
                )
            },

            // Dynamic columns with filters
            ...sourceCols.map((col, index) => {
                const header = typeof col.header === 'string' ? col.header : '';
                const uniqueValues = dynamicColumnValues[header] || [];
                const hasFilterableValues = uniqueValues.length > 0;
                // Generate a unique id for columns using accessorFn
                const colId = col.id || `dynamic_col_${index}_${header.replace(/\s+/g, '_').toLowerCase()}`;
                
                return {
                    ...col,
                    id: colId,
                    header: hasFilterableValues ? () => (
                        <DynamicColumnFilter
                            columnLabel={header}
                            uniqueValues={uniqueValues}
                            selectedValues={dynamicFilters[header] || []}
                            onFilterChange={(values) => handleDynamicFilterChange(header, values)}
                        />
                    ) : header,
                    cell: (info: CellContext<AssetWithProgress, unknown>) => {
                        const value = info.getValue();
                        const rawValue = value ?? (info.row.original.assetFields as any)?.[colId];

                        return (
                            <span className="text-sm text-muted-foreground">
                                {rawValue !== null && rawValue !== undefined ? String(rawValue) : '-'}
                            </span>
                        );
                    }
                } as ColumnDef<AssetWithProgress>;
            }),

            {
                accessorKey: "reportingFrequency",
                header: () => (
                    <DynamicColumnFilter
                        columnLabel="Frequência"
                        uniqueValues={frequencyValues}
                        selectedValues={frequencyFilter}
                        onFilterChange={setFrequencyFilter}
                    />
                ),
                cell: ({ row }) => (
                    <Badge variant="outline" className="capitalize">
                        {getFrequencyLabel(row.original.reportingFrequency)}
                    </Badge>
                )
            },
            {
                header: "Progresso",
                minSize: 200,
                cell: ({ row }) => {
                    const progress = row.original.progress || { current: 0, total: 1, filledMonths: [] };
                    const { current, total, filledMonths } = progress;
                    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
                    const isMensal = total === 12;

                    return (
                        <div className="w-[180px] space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{current}/{total} {isMensal ? 'Meses' : 'Registro'}</span>
                                <span className={percentage === 100 ? "text-green-600 font-bold" : ""}>
                                    {percentage}%
                                </span>
                            </div>
                            {isMensal ? (
                                <div className="flex gap-0.5">
                                    {MONTHS.map((month, index) => {
                                        const isFilled = filledMonths.includes(month);
                                        return (
                                            <TooltipProvider key={index}>
                                                <Tooltip delayDuration={0}>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            className={`h-3 w-full rounded-sm transition-colors ${
                                                                isFilled
                                                                    ? "bg-green-500 hover:bg-green-600"
                                                                    : "bg-muted hover:bg-muted-foreground/30"
                                                            }`}
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{month}: {isFilled ? "Preenchido" : "Pendente"}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${
                                            percentage === 100 ? "bg-green-500" : "bg-primary"
                                        }`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                }
            },
            {
                id: "actions",
                cell: ({ row }) => (
                    <Button size="sm" variant="outline" onClick={() => onReport(row.original)}>
                        <ClipboardEdit className="mr-2 size-3"/> Reportar
                    </Button>
                )
            }
        ];
    }, [sourceCols, onReport, frequencyFilter, frequencyValues, dynamicFilters, dynamicColumnValues]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-4">
            {/* Active filters indicator */}
            {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                    <span>Filtros ativos:</span>
                    {activeFilterLabels.map(({ key, label, count }) => (
                        <Badge key={key} variant="secondary" className="gap-1">
                            {label}: {count}
                            <Button onClick={clearAllFilters} variant="ghost" size="icon" className="h-3 w-3 p-0">
                                <X className="h-3 w-3 cursor-pointer hover:text-destructive"/>
                            </Button>
                        </Badge>
                    ))}
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearAllFilters}>
                        Limpar todos
                    </Button>
                </div>
            )}

            <div className="rounded-md border shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {hasActiveFilters
                                        ? "Nenhum registro encontrado com os filtros aplicados."
                                        : "Nenhum registro encontrado."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Results count and Pagination Controls */}
            <div className="flex items-center justify-between py-4">
                <span className="text-sm text-muted-foreground">
                    Mostrando {filteredData.length} de {assets.length} registros
                </span>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Próximo
                    </Button>
                </div>
            </div>
        </div>
    );
}