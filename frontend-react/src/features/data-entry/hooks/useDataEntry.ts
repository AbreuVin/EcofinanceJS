import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataEntryService, type EsgDataRecord } from "../api/data-entry.service";
import type { EsgModuleType } from "@/types/enums";
import { toast } from "sonner";

export const dataEntryKeys = {
    // Aceita number ou undefined para a chave de cache
    byContext: (module: string, unitId: number | undefined, year: number) =>
        ["data-entry", module, unitId, year] as const,
};

export function useDataEntries(module: EsgModuleType, unitId: number | undefined, year: number) {
    return useQuery({
        queryKey: dataEntryKeys.byContext(module, unitId, year),
        queryFn: () => DataEntryService.getByContext(module, unitId, year),
        // CORREÇÃO: Removemos '!!unitId' para permitir busca global (quando unitId é undefined)
        enabled: !!module && !!year,
    });
}

export function useDataEntryMutation(module: EsgModuleType, unitId: number | undefined, year: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (values: {
            assetDescription: string;
            entries: Record<string, any>; // Key is period, Value is data object
            existingRecords: EsgDataRecord[];
        }) => {
            const { assetDescription, entries, existingRecords } = values;
            const promises: Promise<any>[] = [];

            for (const [period, formData] of Object.entries(entries)) {

                const existing = existingRecords.find(r =>
                    r.period === period &&
                    r.sourceDescription === assetDescription
                );

                // Nota: Se unitId for undefined aqui, o backend pode rejeitar dependendo da validação.
                // Mas isso geralmente é resolvido pelo DataEntrySheet passando o ID da unidade do Ativo, não do Filtro.
                const payload = {
                    ...formData,
                    year,
                    unitId,
                    period,
                    sourceDescription: assetDescription
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
            // Invalida a query atual para forçar recarregamento
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