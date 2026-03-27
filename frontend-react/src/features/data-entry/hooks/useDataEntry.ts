import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataEntryService, type EsgDataRecord } from "../api/data-entry.service";
import type { EsgModuleType } from "@/types/enums";
import { toast } from "sonner";

export const dataEntryKeys = {
    byContext: (module: string, unitId: number | null | undefined, year: number) =>
        ["data-entry", module, unitId, year] as const,
};

export function useDataEntries(module: EsgModuleType, unitId: number | null | undefined, year: number) {
    return useQuery({
        queryKey: dataEntryKeys.byContext(module, unitId, year),
        queryFn: () => DataEntryService.getByContext(module, unitId, year),
        enabled: !!module && !!year,
    });
}

export function useDataEntryMutation(module: EsgModuleType, unitId: number | null | undefined, year: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (values: {
            assetDescription: string;
            entries: Record<string, any>;
            existingRecords: EsgDataRecord[];
        }) => {
            const { assetDescription, entries, existingRecords } = values;
            const promises: Promise<any>[] = [];

            // Helper: normalize period to match DB records (handles Annual/Anual mismatch)
            const periodsMatch = (a: string, b: string) =>
                a === b ||
                (a === "Anual" && b === "Annual") ||
                (a === "Annual" && b === "Anual");

            for (const [period, formData] of Object.entries(entries)) {

                const existing = existingRecords.find(r =>
                    periodsMatch(r.period, period) &&
                    r.sourceDescription === assetDescription
                );

                const payload = {
                    year,
                    unitId,
                    period,
                    sourceDescription: assetDescription,
                    ...formData
                };

                if (existing) {
                    promises.push(DataEntryService.update(module, existing.id, payload));
                } else {
                    promises.push(DataEntryService.create(module, payload));
                }
            }

            await Promise.all(promises);
        },
        onSuccess: () => {
            toast.success("Dados salvos com sucesso!");
            queryClient.invalidateQueries({
                queryKey: dataEntryKeys.byContext(module, unitId, year)
            });
        },
        onError: (err) => {
            console.error(err);
            toast.error("Erro ao salvar dados.");
        }
    });
}