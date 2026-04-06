import prisma from '../../shared/database/prisma';
import * as schemas from './esg.schemas';
import { EsgGenericService } from './esg.service';

type RegistryEntry = {
    service: EsgGenericService<any>;
    schema: any;
    name: string;
    modelName: string; // Adicionado para rastreabilidade
};

const createService = (delegate: any, schema: any) =>
    new EsgGenericService(delegate, schema);

export const esgRegistry: Record<string, RegistryEntry> = {
    'mobile_combustion': {
        service: createService(prisma.mobileCombustionData, schemas.mobileCombustionSchema),
        schema: schemas.mobileCombustionSchema,
        name: 'Mobile Combustion',
        modelName: 'mobileCombustionData'
    },
    'stationary_combustion': {
        service: createService(prisma.stationaryCombustionData, schemas.stationaryCombustionSchema),
        schema: schemas.stationaryCombustionSchema,
        name: 'Stationary Combustion',
        modelName: 'stationaryCombustionData'
    },
    'electricity_purchase': {
        service: createService(prisma.electricityPurchaseData, schemas.electricityPurchaseSchema),
        schema: schemas.electricityPurchaseSchema,
        name: 'Electricity Purchase',
        modelName: 'electricityPurchaseData'
    },
    'energy_generation': {
        service: createService(prisma.energyGenerationData, schemas.energyGenerationSchema),
        schema: schemas.energyGenerationSchema,
        name: 'Energy Generation',
        modelName: 'energyGenerationData'
    },
    'upstream_transport': {
        service: createService(prisma.upstreamTransportData, schemas.upstreamTransportSchema),
        schema: schemas.upstreamTransportSchema,
        name: 'Upstream Transport',
        modelName: 'upstreamTransportData'
    },
    'business_travel_land': {
        service: createService(prisma.businessTravelLandData, schemas.businessTravelLandSchema),
        schema: schemas.businessTravelLandSchema,
        name: 'Business Travel (Land)',
        modelName: 'businessTravelLandData'
    },
    'downstream_transport': {
        service: createService(prisma.downstreamTransportData, schemas.downstreamTransportSchema),
        schema: schemas.downstreamTransportSchema,
        name: 'Downstream Transport',
        modelName: 'downstreamTransportData'
    },
    'waste_transport': {
        service: createService(prisma.wasteTransportData, schemas.wasteTransportSchema),
        schema: schemas.wasteTransportSchema,
        name: 'Waste Transport',
        modelName: 'wasteTransportData'
    },
    'air_travel': {
        service: createService(prisma.airTravelData, schemas.airTravelSchema),
        schema: schemas.airTravelSchema,
        name: 'Air Travel',
        modelName: 'airTravelData'
    },
    'employee_commuting': {
        service: createService(prisma.employeeCommutingData, schemas.employeeCommutingSchema),
        schema: schemas.employeeCommutingSchema,
        name: 'Employee Commuting',
        modelName: 'employeeCommutingData'
    },
    'purchased_goods': {
        service: createService(prisma.purchasedGoodsServicesData, schemas.purchasedGoodsServicesSchema),
        schema: schemas.purchasedGoodsServicesSchema,
        name: 'Purchased Goods',
        modelName: 'purchasedGoodsData'
    },
    'capital_goods': {
        service: createService(prisma.capitalGoodsData, schemas.capitalGoodsSchema),
        schema: schemas.capitalGoodsSchema,
        name: 'Capital Goods',
        modelName: 'capitalGoodsData'
    },
    'production_sales': {
        service: createService(prisma.productionSalesData, schemas.productionSalesSchema),
        schema: schemas.productionSalesSchema,
        name: 'Production & Sales',
        modelName: 'productionSalesData'
    },
    'lubricants_ippu': {
        service: createService(prisma.lubricantsIppuData, schemas.lubricantsIppuSchema),
        schema: schemas.lubricantsIppuSchema,
        name: 'IPPU Lubricants',
        modelName: 'lubricantsIppuData'
    },
    'fugitive_emissions': {
        service: createService(prisma.fugitiveEmissionsData, schemas.fugitiveEmissionsSchema),
        schema: schemas.fugitiveEmissionsSchema,
        name: 'Fugitive Emissions',
        modelName: 'fugitiveEmissionsData'
    },
    'fertilizers': {
        service: createService(prisma.fertilizersData, schemas.fertilizersSchema),
        schema: schemas.fertilizersSchema,
        name: 'Fertilizers',
        modelName: 'fertilizersData'
    },
    'effluents_controlled': {
        service: createService(prisma.effluentsControlledData, schemas.effluentsControlledSchema),
        schema: schemas.effluentsControlledSchema,
        name: 'Controlled Effluents',
        modelName: 'effluentsControlledData'
    },
    'domestic_effluents': {
        service: createService(prisma.domesticEffluentsData, schemas.domesticEffluentsSchema),
        schema: schemas.domesticEffluentsSchema,
        name: 'Domestic Effluents',
        modelName: 'domesticEffluentsData'
    },
    'land_use_change': {
        service: createService(prisma.landUseChangeData, schemas.landUseChangeSchema),
        schema: schemas.landUseChangeSchema,
        name: 'Land Use Change',
        modelName: 'landUseChangeData'
    },
    'planted_forest': {
        service: createService(prisma.plantedForestData, schemas.plantedForestSchema),
        schema: schemas.plantedForestSchema,
        name: 'Planted Forest',
        modelName: 'plantedForestData'
    },
    'conservation_area': {
        service: createService(prisma.conservationAreaData, schemas.conservationAreaSchema),
        schema: schemas.conservationAreaSchema,
        name: 'Conservation Area',
        modelName: 'conservationAreaData'
    },
    'home_office': {
        service: createService(prisma.homeOfficeData, schemas.homeOfficeSchema),
        schema: schemas.homeOfficeSchema,
        name: 'Home Office',
        modelName: 'homeOfficeData'
    },
    'solid_waste': {
        service: createService(prisma.solidWasteData, schemas.solidWasteSchema),
        schema: schemas.solidWasteSchema,
        name: 'Solid Waste',
        modelName: 'solidWasteData'
    }
}

export const getRegistryEntry = (sourceType: string): RegistryEntry => {
    const entry = esgRegistry[sourceType];
    if (!entry) throw new Error(`Source type ${sourceType} not found in registry`);
    return entry;
};