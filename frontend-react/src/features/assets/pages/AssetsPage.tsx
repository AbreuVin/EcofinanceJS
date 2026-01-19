import { useMemo } from "react";
import { Leaf, Plus } from "lucide-react";

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { GenericTable } from "@/shared/components/ui/GenericTable";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { useCrud } from "@/shared/hooks/useCrud";

import { useAssets } from "../hooks/useAssets";

import { AssetForm } from "../components/AssetForm";
import { getAssetColumns } from "../components/AssetColumns";
import { useAssetMutations } from "../hooks/useAssetMutations";

export default function AssetsPage() {
    // 1. Fetch Data
    const { data: assets = [], isLoading } = useAssets();
    const { createAsset, updateAsset, deleteAsset, isSaving } = useAssetMutations();

    // 2. Setup CRUD Logic
    const {
        isFormOpen,
        editingItem,
        toggleForm,
        handleCancel,
        handleEdit,
        handleDelete,
        handleSubmit,
    } = useCrud({
        createFn: createAsset,
        updateFn: updateAsset,
        deleteFn: deleteAsset,
        itemLabel: "a fonte de emissão",
    });

    // 3. Configure Columns
    const columns = useMemo(
        () => getAssetColumns({ onEdit: handleEdit, onDelete: handleDelete }),
        [handleEdit, handleDelete]
    );

    return (
        <DashboardLayout>
            <div className="space-y-6 container mx-auto max-w-8xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Leaf className="size-6 text-primary"/>
                            Fontes de Emissão
                        </h1>
                        <p className="text-muted-foreground">
                            Cadastre e configure os ativos que geram emissões (veículos, máquinas, uso do solo, etc.).
                        </p>
                    </div>

                    {!isFormOpen && (
                        <Button onClick={toggleForm}>
                            <Plus className="mr-2 size-4"/> Nova Fonte
                        </Button>
                    )}
                </div>

                {/* Collapsible Form Area */}
                <Collapsible open={isFormOpen} onOpenChange={(open) => !open && handleCancel()}>
                    <CollapsibleContent className="animate-in slide-in-from-top-2 fade-in duration-300">
                        <AssetForm
                            initialData={editingItem}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isLoading={isSaving}
                        />
                    </CollapsibleContent>
                </Collapsible>

                {/* Data Table */}
                <GenericTable
                    columns={columns}
                    data={assets}
                    isLoading={isLoading}
                />
            </div>
        </DashboardLayout>
    );
}