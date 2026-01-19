import { useMemo } from "react";
import { Building2, Plus } from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible.tsx";
import { Button } from "@/components/ui/button.tsx";
import { GenericTable } from "@/shared/components/ui/GenericTable.tsx";
import DashboardLayout from "@/shared/layouts/DashboardLayout.tsx";
import { useCrud } from "@/shared/hooks/useCrud.ts";

// Unit Imports
import { useUnits } from "../hooks/useUnits.ts";
import { UnitForm } from "../components/UnitForm.tsx";
import { getUnitColumns } from "../components/UnitColumns";
import { useUnitMutations } from "@/features/units/hooks/useUnitMutations.ts";
import type { Unit } from "@/types/Unit.ts";
import type { UnitFormValues } from "@/features/units/schemas/unit.schema.ts";

export default function UnitsPage() {
    const { data: units = [], isLoading } = useUnits();
    const { createUnit, updateUnit, deleteUnit, isSaving } = useUnitMutations();

    const {
        isFormOpen,
        editingItem,
        toggleForm,
        handleCancel,
        handleEdit,
        handleDelete,
        handleSubmit,
    } = useCrud<Unit, UnitFormValues>({
        createFn: createUnit,
        updateFn: updateUnit,
        deleteFn: deleteUnit,
        itemLabel: "a unidade",
    });

    const columns = useMemo(
        () => getUnitColumns({ onEdit: handleEdit, onDelete: handleDelete }),
        [handleEdit, handleDelete]
    );

    return (
        <DashboardLayout>
            <div className="space-y-6 container mx-auto max-w-8xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Building2 className="size-6 text-primary" />
                            Unidades Empresariais
                        </h1>
                        <p className="text-muted-foreground">
                            Cadastre as unidades operacionais e vincule-as às empresas.
                        </p>
                    </div>

                    {!isFormOpen && (
                        <Button onClick={toggleForm}>
                            <Plus className="mr-2 size-4" /> Nova Unidade
                        </Button>
                    )}
                </div>

                <Collapsible open={isFormOpen} onOpenChange={(open) => !open && handleCancel()}>
                    <CollapsibleContent className="animate-in slide-in-from-top-2 fade-in duration-300">
                        <UnitForm
                            initialData={editingItem}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isLoading={isSaving}
                        />
                    </CollapsibleContent>
                </Collapsible>

                <GenericTable columns={columns} data={units} isLoading={isLoading} />
            </div>
        </DashboardLayout>
    );
}