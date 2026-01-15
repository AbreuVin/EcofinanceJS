import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import type { ManagerType } from "./useManagerConfig";
import { toast } from "sonner";

// 1. Map "Manager Types" to "API Endpoints"
const ENDPOINT_MAP: Record<ManagerType, string> = {
    companies: "/companies",       // <--- NEW
    units: "/units",               // <--- NEW
    users: "/users",               // (Unchanged)
    sources: "/config/typologies"  // <--- NEW
};

export const useManagerData = (type: ManagerType) => {
    const queryClient = useQueryClient();
    const endpoint = ENDPOINT_MAP[type];

    // --- FETCH (READ) ---
    const { data, isLoading, isError, error } = useQuery({
        queryKey: [type], // e.g., ['users'], ['units']
        queryFn: async () => {
            const response = await api.get(endpoint);
            return response.data;
        },
    });

    // --- DELETE ---
    const deleteMutation = useMutation({
        mutationFn: async (id: number | string) => {
            await api.delete(`${endpoint}/${id}`);
        },
        onSuccess: () => {
            // 1. Refetch the list automatically
            queryClient.invalidateQueries({ queryKey: [type] });
            toast.success("Registro excluído com sucesso.");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Erro ao excluir registro.");
        },
    });

    return {
        data: data || [], // Always return array to avoid crashes
        isLoading,
        isError,
        error,
        deleteItem: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending
    };
};