import { useMemo } from "react";
import { Building, Plus } from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { GenericTable } from "@/shared/components/ui/GenericTable";
import DashboardLayout from "@/shared/layouts/DashboardLayout";

import { CompanyForm } from "../components/CompanyForm";
import { getCompanyColumns } from "../components/CompanyColumns";
import { useCrud } from "@/shared/hooks/useCrud";
import type { Company } from "@/types/Company.ts";
import type { CompanyFormValues } from "@/features/companies/schemas/company.schema.ts";
import { useCompanyMutations } from "@/features/companies/hooks/useCompanyMutations.ts";
import { useCompanies } from "@/features/companies/hooks/useCompanies.ts"; // Import the new hook

export default function CompaniesPage() {
    const { data: companies = [], isLoading } = useCompanies();
    const { createCompany, updateCompany, deleteCompany, isSaving } = useCompanyMutations();

    const {
        isFormOpen,
        editingItem,
        toggleForm,
        handleCancel,
        handleEdit,
        handleDelete,
        handleSubmit,
    } = useCrud<Company, CompanyFormValues>({
        createFn: createCompany,
        updateFn: updateCompany,
        deleteFn: deleteCompany,
        itemLabel: "a empresa",
    });

    const columns = useMemo(
        () => getCompanyColumns({ onEdit: handleEdit, onDelete: handleDelete }),
        [handleEdit, handleDelete]
    );

    return (
        <DashboardLayout>
            <div className="space-y-6 container mx-auto max-w-8xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Building className="size-6 text-primary" />
                            Gerenciamento de Empresas
                        </h1>
                        <p className="text-muted-foreground">
                            Visualize e gerencie as empresas (Tenants) registradas no sistema.
                        </p>
                    </div>

                    {!isFormOpen && (
                        <Button onClick={toggleForm}>
                            <Plus className="mr-2 size-4" /> Nova Empresa
                        </Button>
                    )}
                </div>

                <Collapsible open={isFormOpen} onOpenChange={(open) => !open && handleCancel()}>
                    <CollapsibleContent className="animate-in slide-in-from-top-2 fade-in duration-300">
                        <CompanyForm
                            initialData={editingItem}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isLoading={isSaving}
                        />
                    </CollapsibleContent>
                </Collapsible>

                <GenericTable columns={columns} data={companies} isLoading={isLoading} />
            </div>
        </DashboardLayout>
    );
}