import type { AssetTypology } from "./AssetTypology";
import type { Company } from "./Company";
import type { User } from "@/types/User.ts";
import type {
    AirTravelData,
    BusinessTravelLandData,
    CapitalGoodsData,
    ConservationAreaData, DomesticEffluentsData, DownstreamTransportData, EffluentsControlledData,
    ElectricityPurchaseData, EmployeeCommutingData,
    EnergyGenerationData,
    FertilizersData,
    FugitiveEmissionsData, HomeOfficeData, LandUseChangeData,
    LubricantsIppuData,
    MobileCombustionData, PlantedForestData, ProductionSalesData, PurchasedGoodsServicesData, SolidWasteData,
    StationaryCombustionData, UpstreamTransportData, WasteTransportData
} from "./EsgData";

export interface Unit {
    id: string;
    name: string;
    city: string;
    state: string;
    country: string;
    numberOfWorkers: number;

    // Foreign Keys
    companyId: string;

    // Parent Relations (Upwards)
    company?: Company;

    // Child Relations (Downwards - Users)
    users?: User[];

    // --- ESG DATA RELATIONS (Downwards - Data) ---
    // These are optional arrays because you might not include them in every Prisma query.

    assetTypologies?: AssetTypology[];

    // Scope 1 & 2
    mobileCombustionDatas?: MobileCombustionData[];
    stationaryCombustionDatas?: StationaryCombustionData[];
    fugitiveEmissionsDatas?: FugitiveEmissionsData[];
    lubricantsIppuDatas?: LubricantsIppuData[];
    fertilizersDatas?: FertilizersData[];
    energyGenerationDatas?: EnergyGenerationData[];
    electricityPurchaseDatas?: ElectricityPurchaseData[];
    landUseChangeDatas?: LandUseChangeData[];
    plantedForestDatas?: PlantedForestData[];
    conservationAreaDatas?: ConservationAreaData[];

    // Scope 3 & Value Chain
    productionSalesDatas?: ProductionSalesData[];
    purchasedGoodsServicesDatas?: PurchasedGoodsServicesData[];
    capitalGoodsDatas?: CapitalGoodsData[];
    upstreamTransportDatas?: UpstreamTransportData[];
    downstreamTransportDatas?: DownstreamTransportData[];
    businessTravelLandDatas?: BusinessTravelLandData[];
    airTravelDatas?: AirTravelData[];
    employeeCommutingDatas?: EmployeeCommutingData[];
    wasteTransportDatas?: WasteTransportData[];
    homeOfficeDatas?: HomeOfficeData[];

    // Waste & Effluents
    solidWasteDatas?: SolidWasteData[];
    effluentsControlledDatas?: EffluentsControlledData[];
    domesticEffluentsDatas?: DomesticEffluentsData[];

    createdAt: Date;
}