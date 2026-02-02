import { useMemo, useState, useEffect } from "react";
import { useParams } from "wouter";
import { Leaf, Plus } from "lucide-react";

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { GenericTable } from "@/shared/components/ui/GenericTable";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { useCrud } from "@/shared/hooks/useCrud";

import { useAssets } from "../hooks/useAssets";

import { AssetForm } from "../components/AssetForm";
import { getAssetColumns, SPECIFIC_COLUMNS } from "../components/AssetColumns";
import { useAssetMutations } from "../hooks/useAssetMutations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ESG_MODULES } from "@/types/enums";
import { normalizeSlugToType } from "../../data-entry/utils/module-mapping";

export default function AssetsPage() {
    const params = useParams();
    const moduleSlug = params.module || "";
    const moduleType = moduleSlug ? normalizeSlugToType(moduleSlug) : null;

    const { data: rawAssets = [], isLoading } = useAssets();
    const { createAsset, updateAsset, deleteAsset, isSaving } = useAssetMutations();
    const [selectedType, setSelectedType] = useState<string | "all">("all");

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

    // Se vir da URL com um módulo específico, pre-seleciona e abre o formulário
    useEffect(() => {
        if (moduleType) {
            setSelectedType(moduleType);
            // Abre o formulário para cadastro da fonte específica
            if (!isFormOpen) {
                toggleForm();
            }
        }
    }, [moduleType, isFormOpen, toggleForm]);

    const assets = useMemo(() => {
        return rawAssets.map(asset => {
            let parsed = {};
            try {
                parsed = typeof asset.assetFields === 'string'
                    ? JSON.parse(asset.assetFields)
                    : asset.assetFields;
            } catch (e) { console.error(e); }

            return { ...asset, assetFields: parsed };
        });
    }, [rawAssets]);

    const filteredData = useMemo(() => {
        if (selectedType === "all") return assets;
        return assets.filter(a => a.sourceType === selectedType);
    }, [assets, selectedType]);

    const columns = useMemo(() => {
        const base = getAssetColumns({ onEdit: handleEdit, onDelete: handleDelete });

        if (selectedType !== "all" && SPECIFIC_COLUMNS[selectedType]) {
            const specific = SPECIFIC_COLUMNS[selectedType];

            return [
                base[0], // Description
                base[1], // Unit
                ...specific,
                ...base.slice(2) // The rest
            ];
        }

        return base;
    }, [selectedType, handleEdit, handleDelete]);

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
                </div>

                {/* Collapsible Form Area */}
                <Collapsible open={isFormOpen} onOpenChange={(open) => !open && handleCancel()}>
                    <CollapsibleContent className="animate-in slide-in-from-top-2 fade-in duration-300">
                        <AssetForm
                            initialData={editingItem}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isLoading={isSaving}
                            preSelectedSourceType={!editingItem && moduleType ? moduleType : undefined}
                        />
                    </CollapsibleContent>
                </Collapsible>

                <div className="flex justify-between mb-4">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-[500px]">
                            <SelectValue placeholder="Filtrar por Tipo de Fonte" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Visão Geral (Todas)</SelectItem>
                            {ESG_MODULES.map(m => <SelectItem value={m.value}>{m.label}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    {!isFormOpen && (
                        <Button onClick={toggleForm}>
                            <Plus className="mr-2 size-4"/> Nova Fonte
                        </Button>
                    )}
                </div>

                {/* Data Table */}
                <GenericTable
                    columns={columns}
                    data={filteredData}
                    isLoading={isLoading}
                />
            </div>
        </DashboardLayout>
    );
}