import { GenericTable } from "@/shared/components/ui/GenericTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ClipboardEdit } from "lucide-react";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { MONTHS } from "@/features/assets/constants/esg-options";
import type { AssetTypology } from "@/types/AssetTypology.ts";
import type { EsgModuleType } from "@/types/enums.ts";
import { useMemo } from "react";
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

export function DataEntryTable({ assets, onReport, module }: DataEntryTableProps) {
    const columns = useMemo<ColumnDef<AssetWithProgress>[]>(() => {
        const sourceCols = (SPECIFIC_COLUMNS[module] || []) as ColumnDef<AssetWithProgress>[];

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

            // 2. Inject Dynamic Columns Here
            ...sourceCols.map(col => ({
                ...col,
                cell: (info: CellContext<AssetWithProgress, unknown>) => {
                    const value = info.getValue();
                    // Fallback: If value is null, try to grab it directly from assetFields
                    // This handles cases where accessorFn might be misbehaving or context is weird
                    const rawValue = value ?? (info.row.original.assetFields as any)?.[col.id as string];

                    return (
                        <span className="text-sm text-muted-foreground">
                            {rawValue !== null && rawValue !== undefined ? String(rawValue) : '-'}
                        </span>
                    );
                }
            })),

            {
                accessorKey: "reportingFrequency",
                header: "Frequência",
                cell: ({ row }) => (
                    <Badge variant="outline" className="capitalize">
                        {row.original.reportingFrequency}
                    </Badge>
                )
            },
            {
                header: "Progresso",
                minSize: 200,
                cell: ({ row }) => {
                    const { current, total, filledMonths } = row.original.progress;
                    const percentage = Math.round((current / total) * 100);
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
    }, [module, onReport]);

    return <GenericTable columns={columns} data={assets}/>;
}