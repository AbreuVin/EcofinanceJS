import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataEntryService, type EsgDataRecord } from "../api/data-entry.service";
import type { EsgModuleType } from "@/types/enums";
import { toast } from "sonner";

export const dataEntryKeys = {
    byContext: (module: string, unitId: number, year: number) =>
        ["data-entry", module, unitId, year] as const,
};

export function useDataEntries(module: EsgModuleType, unitId: number, year: number) {
    return useQuery({
        queryKey: dataEntryKeys.byContext(module, unitId, year),
        queryFn: () => DataEntryService.getByContext(module, unitId, year),
        enabled: !!module && !!unitId && !!year,
    });
}

export function useDataEntryMutation(module: EsgModuleType, unitId: number, year: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (values: {
            assetDescription: string;
            entries: Record<string, any> // Key is period (e.g., "Janeiro"), Value is the data object
            existingRecords: EsgDataRecord[]
        }) => {
            const { assetDescription, entries, existingRecords } = values;
            const promises: Promise<any>[] = [];

            // Loop through the form entries (e.g., 12 months)
            for (const [period, formData] of Object.entries(entries)) {

                // Find if we already have a record for this Period + Description
                const existing = existingRecords.find(r =>
                    r.period === period &&
                    r.sourceDescription === assetDescription
                );

                const payload = {
                    ...formData,
                    year,
                    unitId,
                    period,
                    sourceDescription: assetDescription
                };

                if (existing) {
                    // Update existing
                    promises.push(DataEntryService.update(module, existing.id, payload));
                } else {
                    // Create new
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