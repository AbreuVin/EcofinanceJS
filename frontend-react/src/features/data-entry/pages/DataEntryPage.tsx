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

    // Filter State
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedUnitId, setSelectedUnitId] = useState<string>("");

    // Sheet State
    const [selectedAsset, setSelectedAsset] = useState<AssetTypology | null>(null);

    // 1. Fetch Assets
    const { data: rawAssets = [], isLoading: loadingAssets } = useAssets();

    // 2. Fetch Entries (Only for Progress Bars)
    // If no unit selected (all units), we might not get data depending on backend.
    // This fetch is strictly for the Table's visual progress.
    const queryUnitId = Number(selectedUnitId) || 0;
    const { data: entries = [] } = useDataEntries(
        moduleType!,
        queryUnitId,
        selectedYear
    );

    // 3. Filter & Parse Assets
    const processedAssets = useMemo(() => {
        if (!moduleType) return [];

        return rawAssets
            .filter(asset => {
                // Filter by Module
                if (asset.sourceType !== moduleType) return false;
                // Filter by Active
                if (!asset.isActive) return false;
                // Filter by Unit (if selected)
                if (selectedUnitId && String(asset.unitId) !== selectedUnitId) return false;
                return true;
            })
            .map(asset => {
                // CRITICAL: Robust JSON Parsing
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
                    assetFields: parsedFields // Ensure Table receives an Object, not String
                };
            });
    }, [rawAssets, moduleType, selectedUnitId]);

    // 4. Calculate Progress
    const assetsWithProgress = useMemo(() => {
        return processedAssets.map(asset => {
            const assetEntries = entries.filter(e => e.sourceDescription === asset.description);
            const isMensal = asset.reportingFrequency?.toLowerCase() === 'mensal';
            const requiredCount = isMensal ? 12 : 1;

            // Count unique periods filled
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

                {/* Sheet manages its own data fetching now */}
                {selectedAsset && (
                    <DataEntrySheet
                        asset={selectedAsset}
                        year={selectedYear}
                        // Use Asset's Unit ID directly, fallback to filter if needed
                        unitId={selectedAsset.unitId}
                        open={!!selectedAsset}
                        onOpenChange={(open) => !open && setSelectedAsset(null)}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}