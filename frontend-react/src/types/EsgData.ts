import type { Unit } from "@/types/Unit.ts";

interface BaseEsgData {
    id: number;
    year: number;
    period: string;
    unitId: number;
    comments: string | null;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    unit?: Unit;

    // Common Responsibility Fields (Present in most, but not all. Optional here)
    responsible?: string | null;
    deptResponsible?: string | null;
    email?: string | null;
    phone?: string | null;
}

// 1. Mobile Combustion
export interface MobileCombustionData extends BaseEsgData {
    sourceDescription: string | null;
    isCompanyControlled: boolean;
    inputType: string | null;
    fuelType: string | null;
    consumption: number | null;
    consumptionUnit: string | null;
    distance: number | null;
    distanceUnit: string | null;
    vehicleType: string | null;
}

// 2. Stationary Combustion
export interface StationaryCombustionData extends BaseEsgData {
    sourceDescription: string | null;
    fuelType: string | null;
    consumption: number | null;
    unitMeasure: string | null;
    isCompanyControlled: boolean;
}

// 3. Production & Sales
export interface ProductionSalesData extends BaseEsgData {
    product: string;
    quantitySold: number;
    measureUnit: string;
}

// 4. Lubricants & IPPU
export interface LubricantsIppuData extends BaseEsgData {
    emissionSource: string | null;
    lubricantType: string | null;
    consumption: number | null;
    unitMeasure: string | null;
    isCompanyControlled: boolean;
}

// 5. Fugitive Emissions
export interface FugitiveEmissionsData extends BaseEsgData {
    emissionSource: string | null;
    gasType: string | null;
    quantityReplaced: number | null;
    unitMeasure: string | null;
    isCompanyControlled: boolean;
}

// 6. Fertilizers
export interface FertilizersData extends BaseEsgData {
    fertilizerType: string | null;
    quantityKg: number | null;
    unitMeasure: string | null;
    percentNitrogen: number | null;
    percentCarbonate: number | null;
    isCompanyControlled: boolean;
}

// 7. Controlled Effluents
export interface EffluentsControlledData extends BaseEsgData {
    treatmentOrDest: string;
    treatmentType: string | null;
    finalDestType: string | null;
    qtyEffluentM3: number;
    unitEffluent: string;
    qtyOrganic: number;
    unitOrganic: string;
    qtyNitrogen: number;
    unitNitrogen: string;
    organicRemovedSludge: number | null;
    unitSludge: string | null;
}

// 8. Domestic Effluents
export interface DomesticEffluentsData extends BaseEsgData {
    workerType: string;
    numWorkers: number;
    avgWorkHours: number;
    septicTankOwner: string;
}

// 9. Land Use Change
export interface LandUseChangeData extends BaseEsgData {
    prevLandUse: string;
    biome: string | null;
    phytophysiognomy: string | null;
    areaType: string | null;
    areaHectares: number;
}

// 10. Solid Waste
export interface SolidWasteData extends BaseEsgData {
    finalDestination: string | null;
    wasteType: string | null;
    quantityGenerated: number | null;
    unitMeasure: string | null;
    cityStateDest: string | null;
    locationControlled: string | null;
    internalTracking: string | null;
}

// 11. Electricity Purchase
export interface ElectricityPurchaseData extends BaseEsgData {
    energySource: string | null;
    specifySource: string | null;
    consumption: number | null;
    measureUnit: string | null;
    traceability: string | null;
}

// 12. Purchased Goods & Services
export interface PurchasedGoodsServicesData extends BaseEsgData {
    itemDescription: string | null;
    itemType: string | null;
    quantity: number | null;
    unitMeasure: string | null;
    acquisitionValue: number | null;
    thirdPartyGoods: string | null;
}

// 13. Capital Goods
export interface CapitalGoodsData extends BaseEsgData {
    capitalGood: string | null;
    quantity: number | null;
    unitMeasure: string | null;
    acquisitionValue: number | null;
}

// 14. Upstream Transport
export interface UpstreamTransportData extends BaseEsgData {
    transportedItem: string | null;
    transportMode: string | null;
    reportType: string | null;
    fuel: string | null;
    consumption: number | null;
    consumptionUnit: string | null;
    vehicleClass: string | null;
    distance: number | null;
    distanceUnit: string | null;
    transportedLoad: number | null;
    tripCount: number | null;
    origin: string | null;
    destination: string | null;
}

// 15. Business Travel (Land)
export interface BusinessTravelLandData extends BaseEsgData {
    tripDescription: string | null;
    travelMode: string | null;
    reportType: string | null;
    fuel: string | null;
    consumption: number | null;
    consumptionUnit: string | null;
    distance: number | null;
    distanceUnit: string | null;
    kmReimbursed: string | null;
}

// 16. Downstream Transport
// (Identical to Upstream in structure, separated for domain clarity)
export interface DownstreamTransportData extends UpstreamTransportData {}

// 17. Waste Transport
export interface WasteTransportData extends BaseEsgData {
    transportedItem: string | null;
    reportType: string | null;
    fuel: string | null;
    consumption: number | null;
    consumptionUnit: string | null;
    vehicleClass: string | null;
    distance: number | null;
    distanceUnit: string | null;
    transportedLoad: number | null;
    tripCount: number | null;
}

// 18. Home Office
export interface HomeOfficeData extends BaseEsgData {
    workRegime: string | null;
    numEmployees: number | null;
}

// 19. Air Travel
export interface AirTravelData extends BaseEsgData {
    tripDescription: string | null;
    airportCodeOrigin: string | null;
    airportCodeDest: string | null;
    tripCount: number | null;
}

// 20. Employee Commuting
export interface EmployeeCommutingData extends BaseEsgData {
    identifier: string | null;
    methodUsed: string | null;
    reportType: string | null;
    fuelType: string | null;
    consumption: number | null;
    consumptionUnit: string | null;
    distanceKm: number | null;
    employeeAddress: string | null;
    workAddress: string | null;
    daysCommuted: number | null;
}

// 21. Energy Generation
export interface EnergyGenerationData extends BaseEsgData {
    sourceDescription: string | null;
    generationSource: string | null;
    totalGeneration: number | null;
    measureUnit: string | null;
}

// 22. Planted Forest
export interface PlantedForestData extends BaseEsgData {
    areaId: string | null;
    speciesName: string | null;
    areaPrePreLast: number | null;
    agePrePreLast: number | null;
    agePreLast: number | null;
    areaHarvestedPreLast: number | null;
    currentArea: number | null;
}

// 23. Conservation Area
export interface ConservationAreaData extends BaseEsgData {
    description: string | null;
    biome: string | null;
    phytophysiognomy: string | null;
    plantedArea: string | null;
    plantingStatus: string | null;
    areaStartYear: number | null;
    areaEndYear: number | null;
    changeReason: string | null;
}