/**
 * Dropdown de ações Excel na página de Reporte de Dados.
 * Permite baixar template e importar dados para o módulo atual.
 * Inclui feedback de progresso durante a importação.
 */

import { useRef } from "react";
import { FileSpreadsheet, Download, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateEsgExcelTemplate } from "@/features/esg/utils/excelTemplateGenerator";
import { useExcelBulkImport } from "@/features/esg/hooks/useExcelBulkImport";
import type { AssetTypology } from "@/types/AssetTypology";

interface ExcelActionsDropdownProps {
    sourceType: string;
    assets: AssetTypology[];
    reports: any[];
    currentYear: number;
    unitId?: number;
    unitName?: string;
    units?: { id: number; name: string }[];
}

export function ExcelActionsDropdown({
    sourceType,
    assets,
    reports,
    currentYear,
    unitId,
    unitName,
    units,
}: ExcelActionsDropdownProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { handleFileUpload, isImporting, progress } = useExcelBulkImport({
        sourceType,
        assets,
        currentYear,
        unitId,
    });

    const handleDownload = () => {
        generateEsgExcelTemplate({
            assets,
            reports,
            currentYear,
            sourceType,
            unitId,
            unitName,
            units,
        });
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        disabled={isImporting}
                    >
                        {isImporting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <FileSpreadsheet className="h-4 w-4" />
                        )}
                        Excel
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                        onClick={handleDownload}
                        className="gap-2 cursor-pointer"
                        disabled={assets.length === 0}
                    >
                        <Download className="h-4 w-4" />
                        Baixar Template
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleImportClick}
                        className="gap-2 cursor-pointer"
                        disabled={isImporting || assets.length === 0}
                    >
                        <Upload className="h-4 w-4" />
                        Importar Dados
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={handleFileUpload}
            />

            {/* Progress indicator */}
            {isImporting && (
                <span className="text-xs text-muted-foreground animate-pulse">
                    {progress.message}
                </span>
            )}
        </div>
    );
}
