import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserFormValues } from "../schemas/user.schema";
import { UserService } from "../api/user.service";
import { toast } from "sonner";
import { userKeys } from "./useUsers";

export const useUserMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: UserFormValues) => UserService.create(data),
        onSuccess: () => {
            toast.success("Usuário criado com sucesso!");
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Erro ao criar usuário.";
            toast.error(msg);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UserFormValues }) =>
            UserService.update(id, data),
        onSuccess: () => {
            toast.success("Usuário atualizado!");
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
        onError: () => toast.error("Erro ao atualizar usuário."),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => UserService.delete(id),
        onSuccess: () => {
            toast.success("Usuário excluído.");
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
        onError: () => toast.error("Erro ao excluir usuário."),
    });

    return {
        createUser: createMutation.mutateAsync,
        updateUser: updateMutation.mutateAsync,
        deleteUser: deleteMutation.mutateAsync,
        isSaving: createMutation.isPending || updateMutation.isPending,
    };
};