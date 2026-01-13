import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import type { ManagerType } from "./useManagerConfig";
import { toast } from "sonner";

const ENDPOINT_MAP: Record<ManagerType, string> = {
    companies: "/admin/companies",
    units: "/admin/units",
    users: "/users",
    sources: "/esg/config/typologies"
};

export const useManagerMutations = (type: ManagerType, onCloseModal?: () => void) => {
    const queryClient = useQueryClient();
    const endpoint = ENDPOINT_MAP[type];

    // --- CREATE ---
    const createMutation = useMutation({
        mutationFn: async (payload: any) => {
            const response = await api.post(endpoint, payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [type] });
            toast.success("Registro criado com sucesso!");
            if (onCloseModal) onCloseModal();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Erro ao criar registro.");
        }
    });

    // --- UPDATE ---
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string | number; data: any }) => {
            const response = await api.put(`${endpoint}/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [type] });
            toast.success("Registro atualizado com sucesso!");
            if (onCloseModal) onCloseModal();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Erro ao atualizar registro.");
        }
    });

    return {
        createItem: createMutation.mutateAsync,
        updateItem: updateMutation.mutateAsync,
        isSaving: createMutation.isPending || updateMutation.isPending
    };
};