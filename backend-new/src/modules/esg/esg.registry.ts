import prisma from '../../shared/database/prisma';
import * as schemas from './esg.schemas';
import { EsgGenericService } from './esg.service';
import { AppError } from "../../shared/error/AppError";

type RegistryEntry = {
    service: EsgGenericService<any>;
    schema: any;
    name: string;
};

const createService = (delegate: any, schema: any) =>
    new EsgGenericService(delegate, schema);

export const esgRegistry: Record<string, RegistryEntry> = {
    // --- Combustion & Energy ---
    'mobile_combustion': {
        service: createService(prisma.mobileCombustionData, schemas.mobileCombustionSchema),
        schema: schemas.mobileCombustionSchema,
        name: 'Mobile Combustion'
    },
    'stationary_combustion': {
        service: createService(prisma.stationaryCombustionData, schemas.stationaryCombustionSchema),
        schema: schemas.stationaryCombustionSchema,
        name: 'Stationary Combustion'
    },
    'electricity_purchase': {
        service: createService(prisma.electricityPurchaseData, schemas.electricityPurchaseSchema),
        schema: schemas.electricityPurchaseSchema,
        name: 'Electricity Purchase'
    },
    'energy_generation': {
        service: createService(prisma.energyGenerationData, schemas.energyGenerationSchema),
        schema: schemas.energyGenerationSchema,
        name: 'Energy Generation'
    },

    // --- Transport ---
    'upstream_transport': {
        service: createService(prisma.upstreamTransportData, schemas.upstreamTransportSchema),
        schema: schemas.upstreamTransportSchema,
        name: 'Upstream Transport'
    },
    'downstream_transport': {
        service: createService(prisma.downstreamTransportData, schemas.downstreamTransportSchema),
        schema: schemas.downstreamTransportSchema,
        name: 'Downstream Transport'
    },
    'waste_transport': {
        service: createService(prisma.wasteTransportData, schemas.wasteTransportSchema),
        schema: schemas.wasteTransportSchema,
        name: 'Waste Transport'
    },
    'business_travel_land': {
        service: createService(prisma.businessTravelLandData, schemas.businessTravelLandSchema),
        schema: schemas.businessTravelLandSchema,
        name: 'Business Travel (Land)'
    },
    'air_travel': {
        service: createService(prisma.airTravelData, schemas.airTravelSchema),
        schema: schemas.airTravelSchema,
        name: 'Air Travel'
    },
    'employee_commuting': {
        service: createService(prisma.employeeCommutingData, schemas.employeeCommutingSchema),
        schema: schemas.employeeCommutingSchema,
        name: 'Employee Commuting'
    },

    // --- Production & Materials ---
    'production_sales': {
        service: createService(prisma.productionSalesData, schemas.productionSalesSchema),
        schema: schemas.productionSalesSchema,
        name: 'Production & Sales'
    },
    'purchased_goods': {
        service: createService(prisma.purchasedGoodsServicesData, schemas.purchasedGoodsServicesSchema),
        schema: schemas.purchasedGoodsServicesSchema,
        name: 'Purchased Goods'
    },
    'capital_goods': {
        service: createService(prisma.capitalGoodsData, schemas.capitalGoodsSchema),
        schema: schemas.capitalGoodsSchema,
        name: 'Capital Goods'
    },

    // --- Emissions & Waste ---
    'lubricants_ippu': {
        service: createService(prisma.lubricantsIppuData, schemas.lubricantsIppuSchema),
        schema: schemas.lubricantsIppuSchema,
        name: 'Lubricants & IPPU'
    },
    'fugitive_emissions': {
        service: createService(prisma.fugitiveEmissionsData, schemas.fugitiveEmissionsSchema),
        schema: schemas.fugitiveEmissionsSchema,
        name: 'Fugitive Emissions'
    },
    'fertilizers': {
        service: createService(prisma.fertilizersData, schemas.fertilizersSchema),
        schema: schemas.fertilizersSchema,
        name: 'Fertilizers'
    },
    'solid_waste': {
        service: createService(prisma.solidWasteData, schemas.solidWasteSchema),
        schema: schemas.solidWasteSchema,
        name: 'Solid Waste'
    },
    'effluents_controlled': {
        service: createService(prisma.effluentsControlledData, schemas.effluentsControlledSchema),
        schema: schemas.effluentsControlledSchema,
        name: 'Controlled Effluents'
    },
    'domestic_effluents': {
        service: createService(prisma.domesticEffluentsData, schemas.domesticEffluentsSchema),
        schema: schemas.domesticEffluentsSchema,
        name: 'Domestic Effluents'
    },

    // --- Land & Forest ---
    'land_use_change': {
        service: createService(prisma.landUseChangeData, schemas.landUseChangeSchema),
        schema: schemas.landUseChangeSchema,
        name: 'Land Use Change'
    },
    'planted_forest': {
        service: createService(prisma.plantedForestData, schemas.plantedForestSchema),
        schema: schemas.plantedForestSchema,
        name: 'Planted Forest'
    },
    'conservation_area': {
        service: createService(prisma.conservationAreaData, schemas.conservationAreaSchema),
        schema: schemas.conservationAreaSchema,
        name: 'Conservation Area'
    },
    'home_office': {
        service: createService(prisma.homeOfficeData, schemas.homeOfficeSchema),
        schema: schemas.homeOfficeSchema,
        name: 'Home Office'
    }
}

export const getRegistryEntry = (sourceType: string): RegistryEntry => {
    const entry = esgRegistry[sourceType];
    if (!entry) throw new AppError(`Invalid source type: ${sourceType}`, 400);
    return entry;
};