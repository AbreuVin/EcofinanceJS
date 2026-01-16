import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UnitFormValues } from "@/features/units/schemas/unit.schema.ts";
import { UnitService } from "@/features/units/api/unit.service.ts";
import { toast } from "sonner";
import { unitKeys } from "@/features/units/hooks/useUnits.ts";

export const useUnitMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: UnitFormValues) => UnitService.create(data),
        onSuccess: () => {
            toast.success("Unidade criada com sucesso!");
            queryClient.invalidateQueries({ queryKey: unitKeys.all });
        },
        onError: () => toast.error("Erro ao criar unidade."),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: UnitFormValues }) =>
            UnitService.update(id, data),
        onSuccess: () => {
            toast.success("Unidade atualizada com sucesso!");
            queryClient.invalidateQueries({ queryKey: unitKeys.all });
        },
        onError: () => toast.error("Erro ao atualizar unidade."),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number | string) => UnitService.delete(id),
        onSuccess: () => {
            toast.success("Unidade excluída.");
            queryClient.invalidateQueries({ queryKey: unitKeys.all });
        },
        onError: () => toast.error("Erro ao excluir unidade."),
    });

    return {
        createUnit: createMutation.mutateAsync,
        updateUnit: updateMutation.mutateAsync,
        deleteUnit: deleteMutation.mutateAsync,
        isSaving: createMutation.isPending || updateMutation.isPending,
    };
};