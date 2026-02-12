import { useMemo, useState } from "react";
import { useParams } from "wouter";
import { Loader2 } from "lucide-react";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { useAssets } from "@/features/assets/hooks/useAssets";
import { useDataEntries } from "../hooks/useDataEntry";
import { DataEntryTable } from "../components/DataEntryTable";
import { DataEntrySheet } from "../components/DataEntrySheet";
import { DataEntryFilters } from "../components/DataEntryFilters";
import { getModuleLabel, normalizeSlugToType } from "../utils/module-mapping";
import type { AssetTypology } from "@/types/AssetTypology";

export default function DataEntryPage() {
    const params = useParams();
    const moduleSlug = params.module || "";
    const moduleType = normalizeSlugToType(moduleSlug);

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedUnitId, setSelectedUnitId] = useState<string>("all_units");

    const [selectedAsset, setSelectedAsset] = useState<AssetTypology | null>(null);

    const { data: rawAssets = [], isLoading: loadingAssets } = useAssets();

    const queryUnitId = selectedUnitId === "all_units" ? undefined : Number(selectedUnitId);
    const { data: entries = [] } = useDataEntries(
        moduleType!,
        queryUnitId,
        selectedYear
    );

    const processedAssets = useMemo(() => {
        if (!moduleType) return [];

        return rawAssets
            .filter(asset => {
                if (asset.sourceType !== moduleType) return false;
                if (!asset.isActive) return false;

                if (selectedUnitId === "all_units") return true;

                const assetUnitId = asset.unitId ? String(asset.unitId) : "0";

                return !(assetUnitId !== selectedUnitId && assetUnitId !== "0");
            })
            .map(asset => {
                let parsedFields = {};
                try {
                    parsedFields = typeof asset.assetFields === 'string'
                        ? JSON.parse(asset.assetFields)
                        : asset.assetFields;
                } catch (e) {
                    console.error("Error parsing assetFields for asset:", asset.id, e);
                }

                return {
                    ...asset,
                    assetFields: parsedFields
                };
            });
    }, [rawAssets, moduleType, selectedUnitId]);

    const assetsWithProgress = useMemo(() => {
        return processedAssets.map(asset => {
            const assetEntries = entries.filter(e => e.sourceDescription === asset.description);
            const isMensal = asset.reportingFrequency?.toLowerCase() === 'mensal';
            const requiredCount = isMensal ? 12 : 1;

            const filledMonths = [...new Set(assetEntries.map(e => e.period))];

            return {
                ...asset,
                progress: {
                    current: filledMonths.length,
                    total: requiredCount,
                    filledMonths
                }
            };
        });
    }, [processedAssets, entries]);

    if (!moduleType) {
        return <DashboardLayout><div>Módulo não encontrado</div></DashboardLayout>;
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 container mx-auto max-w-8xl flex flex-col h-[calc(100vh-4rem)]">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-bold">{getModuleLabel(moduleType)}</h1>
                        <p className="text-muted-foreground">Reporte de dados operacionais</p>
                    </div>
                    <DataEntryFilters
                        year={selectedYear}
                        unitId={selectedUnitId}
                        onYearChange={setSelectedYear}
                        onUnitChange={setSelectedUnitId}
                    />
                </div>

                {loadingAssets ? (
                    <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin" /></div>
                ) : (
                    <DataEntryTable
                        assets={assetsWithProgress}
                        module={moduleType}
                        onReport={setSelectedAsset}
                    />
                )}

                {selectedAsset && (
                    <DataEntrySheet
                        asset={selectedAsset}
                        year={selectedYear}
                        unitId={selectedAsset.unitId}
                        open={!!selectedAsset}
                        onOpenChange={(open) => !open && setSelectedAsset(null)}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}