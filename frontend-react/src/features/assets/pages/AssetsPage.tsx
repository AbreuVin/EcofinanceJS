import { useMemo, useState, useEffect } from "react";
import { useParams } from "wouter";
import { ChevronDown, Leaf, Plus } from "lucide-react";

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { useCrud } from "@/shared/hooks/useCrud";

import { useAssets } from "../hooks/useAssets";

import { AssetForm } from "../components/AssetForm";
import { getAssetColumns, SPECIFIC_COLUMNS } from "../components/AssetColumns";
import { AssetsTable } from "../components/AssetsTable";
import { useAssetMutations } from "../hooks/useAssetMutations";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ESG_MODULES } from "@/types/enums";
import { normalizeSlugToType } from "../../data-entry/utils/module-mapping";

// Scope groupings for modules
const SCOPE_MODULES: Record<string, string[]> = {
    escopo_1: [
        'production_sales',
        'stationary_combustion',
        'mobile_combustion',
        'lubricants_ippu',
        'fugitive_emissions',
        'fertilizers',
        'effluents_controlled',
        'domestic_effluents',
        'land_use_change',
        'solid_waste',
    ],
    escopo_2: [
        'electricity_purchase',
    ],
    escopo_3: [
        'purchased_goods',
        'capital_goods',
        'upstream_transport',
        'business_travel_land',
        'downstream_transport',
        'waste_transport',
        'home_office',
        'air_travel',
        'employee_commuting',
        'energy_generation',
        'planted_forest',
        'conservation_area',
    ],
};

const SCOPE_LABELS: Record<string, string> = {
    escopo_1: "Escopo 1",
    escopo_2: "Escopo 2",
    escopo_3: "Escopo 3",
};

// Get modules for a specific scope, sorted alphabetically
function getScopeModules(scopeKey: string) {
    const moduleValues = SCOPE_MODULES[scopeKey] || [];
    return ESG_MODULES
        .filter(mod => moduleValues.includes(mod.value))
        .sort((a, b) => a.label.localeCompare(b.label));
}

// Get label for selected type
function getSelectedTypeLabel(selectedType: string) {
    if (selectedType === "all") return "Visão Geral (Todas)";
    const module = ESG_MODULES.find(m => m.value === selectedType);
    return module?.label || selectedType;
}

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
                            Cadastro de Fontes
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
                            key={editingItem ? `edit-${editingItem.id}` : "new"}
                            preSelectedSourceType={!editingItem && moduleType ? moduleType : undefined}
                        />
                    </CollapsibleContent>
                </Collapsible>

                <div className="flex justify-between mb-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-[500px] justify-between">
                                {getSelectedTypeLabel(selectedType)}
                                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[500px]">
                            <DropdownMenuItem onClick={() => setSelectedType("all")}>
                                Visão Geral (Todas)
                            </DropdownMenuItem>
                            
                            {Object.entries(SCOPE_LABELS).map(([scopeKey, scopeLabel]) => (
                                <DropdownMenuSub key={scopeKey}>
                                    <DropdownMenuSubTrigger>
                                        {scopeLabel}
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="max-h-[300px] overflow-y-auto">
                                        {getScopeModules(scopeKey).map((mod) => (
                                            <DropdownMenuItem 
                                                key={mod.value} 
                                                onClick={() => setSelectedType(mod.value)}
                                            >
                                                {mod.label}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {!isFormOpen && (
                        <Button onClick={toggleForm}>
                            <Plus className="mr-2 size-4"/> Nova Fonte
                        </Button>
                    )}
                </div>

                {/* Data Table */}
                <AssetsTable
                    columns={columns}
                    data={filteredData}
                    isLoading={isLoading}
                />
            </div>
        </DashboardLayout>
    );
}