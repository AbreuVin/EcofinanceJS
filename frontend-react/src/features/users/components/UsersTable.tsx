import { useState, useMemo } from "react";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Filter, X } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types/User";

interface UsersTableProps {
    columns: ColumnDef<User, unknown>[];
    data: User[];
    isLoading?: boolean;
}

// Columns that should have Excel-like filters
// TODO: "unit.name" removido a pedido do cliente - descomentar se necessário
const FILTERABLE_COLUMNS = ["role"] as const;

type FilterableColumn = typeof FILTERABLE_COLUMNS[number];

// Helper to get nested value from object
function getNestedValue(obj: User, path: string): string {
    const keys = path.split(".");
    let value: unknown = obj;
    for (const key of keys) {
        value = (value as Record<string, unknown>)?.[key];
    }
    return String(value ?? "");
}

// Column Filter Component
function ColumnFilter({
    columnId,
    columnLabel,
    data,
    selectedValues,
    onFilterChange,
}: {
    columnId: FilterableColumn;
    columnLabel: string;
    data: User[];
    selectedValues: string[];
    onFilterChange: (columnId: FilterableColumn, values: string[]) => void;
}) {
    // Get unique values for this column
    const uniqueValues = useMemo(() => {
        const values = new Set<string>();
        data.forEach((item) => {
            const value = getNestedValue(item, columnId);
            if (value && value !== "undefined" && value !== "null") {
                values.add(value);
            }
        });
        return Array.from(values).sort();
    }, [data, columnId]);

    const hasFilters = selectedValues.length > 0;

    const handleToggle = (value: string) => {
        const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];
        onFilterChange(columnId, newValues);
    };

    const handleClearAll = () => {
        onFilterChange(columnId, []);
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

export function UsersTable({ columns, data, isLoading }: UsersTableProps) {
    const [columnFilters, setColumnFilters] = useState<Record<FilterableColumn, string[]>>({
        role: [],
        // "unit.name": [], // Oculto a pedido do cliente
    });

    // Handle filter changes
    const handleFilterChange = (columnId: FilterableColumn, values: string[]) => {
        setColumnFilters((prev) => ({
            ...prev,
            [columnId]: values,
        }));
    };

    // Filter data based on selected filters
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            return FILTERABLE_COLUMNS.every((columnId) => {
                const selectedValues = columnFilters[columnId];
                if (selectedValues.length === 0) return true;
                const value = getNestedValue(item, columnId);
                return selectedValues.includes(value);
            });
        });
    }, [data, columnFilters]);

    // Check if any filters are active
    const hasActiveFilters = Object.values(columnFilters).some((values) => values.length > 0);

    // Clear all filters
    const clearAllFilters = () => {
        setColumnFilters({
            role: [],
            // "unit.name": [], // Oculto a pedido do cliente
        });
    };

    // Modify columns to include filter headers
    const columnsWithFilters = useMemo((): ColumnDef<User, unknown>[] => {
        return columns.map((col): ColumnDef<User, unknown> => {
            const accessorKey = (col as { accessorKey?: string }).accessorKey;
            if (accessorKey && FILTERABLE_COLUMNS.includes(accessorKey as FilterableColumn)) {
                const columnId = accessorKey as FilterableColumn;
                const originalHeader = col.header as string;
                return {
                    ...col,
                    header: () => (
                        <ColumnFilter
                            columnId={columnId}
                            columnLabel={originalHeader}
                            data={data}
                            selectedValues={columnFilters[columnId]}
                            onFilterChange={handleFilterChange}
                        />
                    ),
                } as ColumnDef<User, unknown>;
            }
            return col;
        });
    }, [columns, data, columnFilters]);

    const table = useReactTable({
        data: filteredData,
        columns: columnsWithFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-4">
            {/* Active filters indicator */}
            {hasActiveFilters && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Filtros ativos:</span>
                    {FILTERABLE_COLUMNS.map((columnId) => {
                        const values = columnFilters[columnId];
                        if (values.length === 0) return null;
                        const label = columnId === "role" ? "Perfil" : columnId;
                        return (
                            <Badge key={columnId} variant="secondary" className="gap-1">
                                {label}: {values.length}
                                <Button onClick={clearAllFilters} variant="ghost" size="icon" className="h-3 w-3 p-0">
                                    <X className="h-3 w-3 cursor-pointer hover:text-destructive"/>
                                </Button>
                            </Badge>
                        );
                    })}
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
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {columns.map((_col, j) => (
                                        <TableCell key={j}>
                                            <Skeleton className="h-6 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
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
                    Mostrando {filteredData.length} de {data.length} registros
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
