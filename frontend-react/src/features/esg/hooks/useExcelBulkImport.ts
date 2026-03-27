/**
 * Hook que orquestra o fluxo completo de importação de Excel ESG:
 * 1. Lê o arquivo
 * 2. Valida metadata e estrutura
 * 3. Parseia dados (Wide → Long)
 * 4. Submete via bulk-upsert
 * 5. Fornece feedback de progresso
 */

import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { parseEsgExcelTemplate } from "../utils/excelTemplateParser";
import { DataEntryService } from "@/features/data-entry/api/data-entry.service";
import type { EsgModuleType } from "@/types/enums";

type ImportStep = "idle" | "reading" | "validating" | "submitting" | "done" | "error";

interface ImportProgress {
    step: ImportStep;
    message: string;
}

interface Asset {
    id: number;
    description: string;
    sourceType: string;
    reportingFrequency: string;
    assetFields: string | Record<string, any>;
    unitId?: number;
}

interface UseExcelBulkImportProps {
    sourceType: string;
    assets: Asset[];
    currentYear: number;
    unitId?: number;
}

export function useExcelBulkImport({
    sourceType,
    assets,
    currentYear,
    unitId,
}: UseExcelBulkImportProps) {
    const [progress, setProgress] = useState<ImportProgress>({
        step: "idle",
        message: "",
    });
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    const triggerFileInput = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;

            setIsImporting(true);

            try {
                // Step 1: Reading
                setProgress({ step: "reading", message: "Lendo planilha..." });

                // Step 2: Validating & Parsing
                setProgress({ step: "validating", message: "Validando e extraindo dados..." });

                const result = await parseEsgExcelTemplate(
                    file,
                    assets,
                    sourceType,
                    currentYear,
                    unitId
                );

                // Show warnings
                result.warnings.forEach(w => toast.warning(w));

                // Check for errors
                if (result.errors.length > 0) {
                    result.errors.forEach(e => toast.error(e));
                    setProgress({ step: "error", message: "Importação falhou." });
                    return;
                }

                if (result.payloads.length === 0) {
                    toast.info("Nenhum dado válido encontrado na planilha.");
                    setProgress({ step: "done", message: "Nenhum dado para importar." });
                    return;
                }

                // Step 3: Submitting
                setProgress({
                    step: "submitting",
                    message: `Enviando ${result.payloads.length} registros...`,
                });

                const response = await DataEntryService.bulkUpsert(
                    sourceType as EsgModuleType,
                    result.payloads
                );

                // Step 4: Done
                setProgress({ step: "done", message: "Concluído!" });
                toast.success(
                    `✅ ${response.message}` +
                    (result.warnings.length > 0
                        ? ` (${result.warnings.length} avisos)`
                        : "")
                );

                // Invalidate queries to refresh data
                await queryClient.invalidateQueries({ queryKey: ["esg-data"] });

            } catch (error: any) {
                console.error("Erro na importação Excel:", error);
                const msg = error?.response?.data?.message || error?.message || "Erro desconhecido.";
                toast.error(`Falha na importação: ${msg}`);
                setProgress({ step: "error", message: msg });
            } finally {
                setIsImporting(false);
                // Clear the input so the same file can be re-uploaded
                event.target.value = "";

                // Reset progress after a delay
                setTimeout(() => {
                    setProgress({ step: "idle", message: "" });
                }, 3000);
            }
        },
        [assets, sourceType, currentYear, unitId, queryClient]
    );

    return {
        fileInputRef,
        triggerFileInput,
        handleFileUpload,
        progress,
        isImporting,
    };
}
