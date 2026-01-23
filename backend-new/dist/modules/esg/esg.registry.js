"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegistryEntry = exports.esgRegistry = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
const schemas = __importStar(require("./esg.schemas"));
const esg_service_1 = require("./esg.service");
const AppError_1 = require("../../shared/error/AppError");
const createService = (delegate, schema) => new esg_service_1.EsgGenericService(delegate, schema);
exports.esgRegistry = {
    // --- Combustion & Energy ---
    'mobile_combustion': {
        service: createService(prisma_1.default.mobileCombustionData, schemas.mobileCombustionSchema),
        schema: schemas.mobileCombustionSchema,
        name: 'Mobile Combustion'
    },
    'stationary_combustion': {
        service: createService(prisma_1.default.stationaryCombustionData, schemas.stationaryCombustionSchema),
        schema: schemas.stationaryCombustionSchema,
        name: 'Stationary Combustion'
    },
    'electricity_purchase': {
        service: createService(prisma_1.default.electricityPurchaseData, schemas.electricityPurchaseSchema),
        schema: schemas.electricityPurchaseSchema,
        name: 'Electricity Purchase'
    },
    'energy_generation': {
        service: createService(prisma_1.default.energyGenerationData, schemas.energyGenerationSchema),
        schema: schemas.energyGenerationSchema,
        name: 'Energy Generation'
    },
    // --- Transport ---
    'upstream_transport': {
        service: createService(prisma_1.default.upstreamTransportData, schemas.upstreamTransportSchema),
        schema: schemas.upstreamTransportSchema,
        name: 'Upstream Transport'
    },
    'downstream_transport': {
        service: createService(prisma_1.default.downstreamTransportData, schemas.downstreamTransportSchema),
        schema: schemas.downstreamTransportSchema,
        name: 'Downstream Transport'
    },
    'waste_transport': {
        service: createService(prisma_1.default.wasteTransportData, schemas.wasteTransportSchema),
        schema: schemas.wasteTransportSchema,
        name: 'Waste Transport'
    },
    'business_travel_land': {
        service: createService(prisma_1.default.businessTravelLandData, schemas.businessTravelLandSchema),
        schema: schemas.businessTravelLandSchema,
        name: 'Business Travel (Land)'
    },
    'air_travel': {
        service: createService(prisma_1.default.airTravelData, schemas.airTravelSchema),
        schema: schemas.airTravelSchema,
        name: 'Air Travel'
    },
    'employee_commuting': {
        service: createService(prisma_1.default.employeeCommutingData, schemas.employeeCommutingSchema),
        schema: schemas.employeeCommutingSchema,
        name: 'Employee Commuting'
    },
    // --- Production & Materials ---
    'production_sales': {
        service: createService(prisma_1.default.productionSalesData, schemas.productionSalesSchema),
        schema: schemas.productionSalesSchema,
        name: 'Production & Sales'
    },
    'purchased_goods': {
        service: createService(prisma_1.default.purchasedGoodsServicesData, schemas.purchasedGoodsServicesSchema),
        schema: schemas.purchasedGoodsServicesSchema,
        name: 'Purchased Goods'
    },
    'capital_goods': {
        service: createService(prisma_1.default.capitalGoodsData, schemas.capitalGoodsSchema),
        schema: schemas.capitalGoodsSchema,
        name: 'Capital Goods'
    },
    // --- Emissions & Waste ---
    'lubricants_ippu': {
        service: createService(prisma_1.default.lubricantsIppuData, schemas.lubricantsIppuSchema),
        schema: schemas.lubricantsIppuSchema,
        name: 'Lubricants & IPPU'
    },
    'fugitive_emissions': {
        service: createService(prisma_1.default.fugitiveEmissionsData, schemas.fugitiveEmissionsSchema),
        schema: schemas.fugitiveEmissionsSchema,
        name: 'Fugitive Emissions'
    },
    'fertilizers': {
        service: createService(prisma_1.default.fertilizersData, schemas.fertilizersSchema),
        schema: schemas.fertilizersSchema,
        name: 'Fertilizers'
    },
    'solid_waste': {
        service: createService(prisma_1.default.solidWasteData, schemas.solidWasteSchema),
        schema: schemas.solidWasteSchema,
        name: 'Solid Waste'
    },
    'effluents_controlled': {
        service: createService(prisma_1.default.effluentsControlledData, schemas.effluentsControlledSchema),
        schema: schemas.effluentsControlledSchema,
        name: 'Controlled Effluents'
    },
    'domestic_effluents': {
        service: createService(prisma_1.default.domesticEffluentsData, schemas.domesticEffluentsSchema),
        schema: schemas.domesticEffluentsSchema,
        name: 'Domestic Effluents'
    },
    // --- Land & Forest ---
    'land_use_change': {
        service: createService(prisma_1.default.landUseChangeData, schemas.landUseChangeSchema),
        schema: schemas.landUseChangeSchema,
        name: 'Land Use Change'
    },
    'planted_forest': {
        service: createService(prisma_1.default.plantedForestData, schemas.plantedForestSchema),
        schema: schemas.plantedForestSchema,
        name: 'Planted Forest'
    },
    'conservation_area': {
        service: createService(prisma_1.default.conservationAreaData, schemas.conservationAreaSchema),
        schema: schemas.conservationAreaSchema,
        name: 'Conservation Area'
    },
    'home_office': {
        service: createService(prisma_1.default.homeOfficeData, schemas.homeOfficeSchema),
        schema: schemas.homeOfficeSchema,
        name: 'Home Office'
    }
};
const getRegistryEntry = (sourceType) => {
    const entry = exports.esgRegistry[sourceType];
    if (!entry)
        throw new AppError_1.AppError(`Invalid source type: ${sourceType}`, 400);
    return entry;
};
exports.getRegistryEntry = getRegistryEntry;
