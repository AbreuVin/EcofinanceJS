import prisma from "../repositories/prisma";
import * as schemas from "../schemas/esgSchemas";
import { EsgGenericService } from "../services/esgGenericService";

// Helper type to define the map structure
type RegistryEntry = {
    service: EsgGenericService<any>;
    name: string; // Display name
};

// Singleton map
export const esgRegistry: Record<string, RegistryEntry> = {
    // --- Combustion & Energy ---
    'mobile_combustion': {
        service: new EsgGenericService(prisma.mobileCombustionData, schemas.mobileCombustionSchema),
        name: 'Mobile Combustion'
    },
    'stationary_combustion': {
        service: new EsgGenericService(prisma.stationaryCombustionData, schemas.stationaryCombustionSchema),
        name: 'Stationary Combustion'
    },
    'electricity_purchase': {
        service: new EsgGenericService(prisma.electricityPurchaseData, schemas.electricityPurchaseSchema),
        name: 'Electricity Purchase'
    },
    'energy_generation': {
        service: new EsgGenericService(prisma.energyGenerationData, schemas.energyGenerationSchema),
        name: 'Energy Generation'
    },

    // --- Transport ---
    'upstream_transport': {
        service: new EsgGenericService(prisma.upstreamTransportData, schemas.upstreamTransportSchema),
        name: 'Upstream Transport'
    },
    'downstream_transport': {
        service: new EsgGenericService(prisma.downstreamTransportData, schemas.downstreamTransportSchema),
        name: 'Downstream Transport'
    },
    'waste_transport': {
        service: new EsgGenericService(prisma.wasteTransportData, schemas.wasteTransportSchema),
        name: 'Waste Transport'
    },
    'business_travel_land': {
        service: new EsgGenericService(prisma.businessTravelLandData, schemas.businessTravelLandSchema),
        name: 'Business Travel (Land)'
    },
    'air_travel': {
        service: new EsgGenericService(prisma.airTravelData, schemas.airTravelSchema),
        name: 'Air Travel'
    },
    'employee_commuting': {
        service: new EsgGenericService(prisma.employeeCommutingData, schemas.employeeCommutingSchema),
        name: 'Employee Commuting'
    },

    // --- Production & Materials ---
    'production_sales': {
        service: new EsgGenericService(prisma.productionSalesData, schemas.productionSalesSchema),
        name: 'Production & Sales'
    },
    'purchased_goods': {
        service: new EsgGenericService(prisma.purchasedGoodsServicesData, schemas.purchasedGoodsServicesSchema),
        name: 'Purchased Goods'
    },
    'capital_goods': {
        service: new EsgGenericService(prisma.capitalGoodsData, schemas.capitalGoodsSchema),
        name: 'Capital Goods'
    },

    // --- Emissions & Waste ---
    'lubricants_ippu': {
        service: new EsgGenericService(prisma.lubricantsIppuData, schemas.lubricantsIppuSchema),
        name: 'Lubricants & IPPU'
    },
    'fugitive_emissions': {
        service: new EsgGenericService(prisma.fugitiveEmissionsData, schemas.fugitiveEmissionsSchema),
        name: 'Fugitive Emissions'
    },
    'fertilizers': {
        service: new EsgGenericService(prisma.fertilizersData, schemas.fertilizersSchema),
        name: 'Fertilizers'
    },
    'solid_waste': {
        service: new EsgGenericService(prisma.solidWasteData, schemas.solidWasteSchema),
        name: 'Solid Waste'
    },
    'effluents_controlled': {
        service: new EsgGenericService(prisma.effluentsControlledData, schemas.effluentsControlledSchema),
        name: 'Controlled Effluents'
    },
    'domestic_effluents': {
        service: new EsgGenericService(prisma.domesticEffluentsData, schemas.domesticEffluentsSchema),
        name: 'Domestic Effluents'
    },

    // --- Land & Forest ---
    'land_use_change': {
        service: new EsgGenericService(prisma.landUseChangeData, schemas.landUseChangeSchema),
        name: 'Land Use Change'
    },
    'planted_forest': {
        service: new EsgGenericService(prisma.plantedForestData, schemas.plantedForestSchema),
        name: 'Planted Forest'
    },
    'conservation_area': {
        service: new EsgGenericService(prisma.conservationAreaData, schemas.conservationAreaSchema),
        name: 'Conservation Area'
    },
    'home_office': {
        service: new EsgGenericService(prisma.homeOfficeData, schemas.homeOfficeSchema),
        name: 'Home Office'
    }
};

export const getServiceOrThrow = (sourceType: string) => {
    const entry = esgRegistry[sourceType];
    if (!entry) throw new Error(`Invalid source type: ${sourceType}`);
    return entry.service;
};