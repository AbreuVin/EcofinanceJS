import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { EsgModuleType } from "@/types/enums";

// --- Import All Sub-Components ---
import { ConservationAreaFields } from "./modules/ConservationAreaFields";
import { PlantedForestFields } from "./modules/PlantedForestFields";
import { PurchasedGoodsFields } from "./modules/PurchasedGoodsFields";
import { StationaryCombustionFields } from "./modules/StationaryCombustionFields";
import { MobileCombustionFields } from "./modules/MobileCombustionFields";
import { ElectricityFields } from "./modules/ElectricityFields";
import { ProductionSalesFields } from "./modules/ProductionSalesFields";
import { EffluentsFields } from "./modules/EffluentsFields";
import { FugitiveEmissionsFields } from "./modules/FugitiveEmissionsFields";
import { FertilizerFields } from "./modules/FertilizerFields";
import { EnergyGenerationFields } from "./modules/EnergyGenerationFields";
import { HomeOfficeFields } from "./modules/HomeOfficeFields";
import { LubricantFields } from "./modules/LubricantFields";
import { TransportFields } from "./modules/TransportFields";
import { LandUseFields } from "./modules/LandUseFields";
import { SolidWasteFields } from "./modules/SolidWasteFields";
import { CommutingFields } from "./modules/CommutingFields";
import { BusinessTravelFields } from "./modules/BusinessTravelFields";
import { NoSpecificConfigNeeded } from "@/features/assets/components/modules/NoSpecificConfigNeeded.tsx";

const MODULE_COMPONENTS: Record<EsgModuleType, React.ComponentType> = {
    conservation_area: ConservationAreaFields,
    planted_forest: PlantedForestFields,
    capital_goods: NoSpecificConfigNeeded,
    purchased_goods: PurchasedGoodsFields,
    stationary_combustion: StationaryCombustionFields,
    mobile_combustion: MobileCombustionFields,
    electricity_purchase: ElectricityFields,
    production_sales: ProductionSalesFields,
    effluents_controlled: EffluentsFields,
    domestic_effluents: EffluentsFields,
    fugitive_emissions: FugitiveEmissionsFields,
    fertilizers: FertilizerFields,
    energy_generation: EnergyGenerationFields,
    home_office: HomeOfficeFields,
    lubricants_ippu: LubricantFields,
    upstream_transport: TransportFields,
    downstream_transport: TransportFields,
    waste_transport: TransportFields,
    land_use_change: LandUseFields,
    solid_waste: SolidWasteFields,
    employee_commuting: CommutingFields,
    business_travel_land: BusinessTravelFields,
    air_travel: NoSpecificConfigNeeded,
};

export function AssetDynamicFields() {
    const { control } = useFormContext();

    const sourceType = useWatch({ control, name: "sourceType" }) as EsgModuleType | undefined;

    if (!sourceType) {
        return <p className="text-sm text-muted-foreground italic">Selecione um tipo de fonte acima.</p>;
    }

    const SpecificComponent = MODULE_COMPONENTS[sourceType];

    if (!SpecificComponent) {
        return (
            <div className="p-4 border border-dashed rounded bg-yellow-50 text-yellow-800 text-sm">
                ⚠️ Configuração não encontrada para: <strong>{sourceType}</strong>
            </div>
        );
    }

    return <SpecificComponent />;
}