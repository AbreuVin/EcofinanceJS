import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CompanyFormValues } from "@/features/companies/schemas/company.schema.ts";
import { CompanyService } from "@/features/companies/api/company.service.ts";
import { toast } from "sonner";
import { companyKeys } from "@/features/companies/hooks/useCompanies.ts";

export const useCompanyMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: CompanyFormValues) => CompanyService.create(data),
        onSuccess: () => {
            toast.success("Empresa criada com sucesso!");
            queryClient.invalidateQueries({ queryKey: companyKeys.all });
        },
        onError: (error: any) => {
            toast.error("Erro ao criar empresa.");
            console.error(error);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: CompanyFormValues }) =>
            CompanyService.update(id, data),
        onSuccess: () => {
            toast.success("Empresa atualizada com sucesso!");
            queryClient.invalidateQueries({ queryKey: companyKeys.all });
        },
        onError: (error: any) => {
            toast.error("Erro ao atualizar empresa.");
            console.error(error);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => CompanyService.delete(id),
        onSuccess: () => {
            toast.success("Empresa excluída.");
            queryClient.invalidateQueries({ queryKey: companyKeys.all });
        },
        onError: (error: any) => {
            toast.error("Erro ao excluir empresa.");
            console.error(error);
        },
    });

    return {
        createCompany: createMutation.mutateAsync,
        updateCompany: updateMutation.mutateAsync,
        deleteCompany: deleteMutation.mutateAsync,
        isSaving: createMutation.isPending || updateMutation.isPending,
    };
};