import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AssetFormValues } from "../schemas/asset.schema";
import { AssetService } from "../api/asset.service";
import { toast } from "sonner";
import { assetKeys } from "@/features/assets/hooks/useAssets.ts";

export const useAssetMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: AssetFormValues) => AssetService.create(data),
        onSuccess: () => {
            toast.success("Fonte cadastrada com sucesso!");
            queryClient.invalidateQueries({ queryKey: assetKeys.all });
        },
        onError: (error: any) => {
            console.error(error);
            toast.error("Erro ao cadastrar fonte. Verifique os dados.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: AssetFormValues }) =>
            AssetService.update(id, data),
        onSuccess: () => {
            toast.success("Fonte atualizada com sucesso!");
            queryClient.invalidateQueries({ queryKey: assetKeys.all });
        },
        onError: (error: any) => {
            console.error(error);
            toast.error("Erro ao atualizar fonte.");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => AssetService.delete(id),
        onSuccess: () => {
            toast.success("Fonte excluída.");
            queryClient.invalidateQueries({ queryKey: assetKeys.all });
        },
        onError: (error: any) => {
            console.error(error);
            toast.error("Erro ao excluir fonte.");
        },
    });

    return {
        createAsset: createMutation.mutateAsync,
        updateAsset: updateMutation.mutateAsync,
        deleteAsset: deleteMutation.mutateAsync,
        isSaving: createMutation.isPending || updateMutation.isPending,
    };
};