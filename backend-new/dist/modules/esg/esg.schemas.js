"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeOfficeSchema = exports.conservationAreaSchema = exports.plantedForestSchema = exports.landUseChangeSchema = exports.domesticEffluentsSchema = exports.effluentsControlledSchema = exports.solidWasteSchema = exports.fertilizersSchema = exports.fugitiveEmissionsSchema = exports.lubricantsIppuSchema = exports.capitalGoodsSchema = exports.purchasedGoodsServicesSchema = exports.productionSalesSchema = exports.employeeCommutingSchema = exports.airTravelSchema = exports.businessTravelLandSchema = exports.wasteTransportSchema = exports.downstreamTransportSchema = exports.upstreamTransportSchema = exports.energyGenerationSchema = exports.electricityPurchaseSchema = exports.stationaryCombustionSchema = exports.mobileCombustionSchema = void 0;
const zod_1 = require("zod");
const baseEsgSchema = zod_1.z.object({
    year: zod_1.z.number().int().min(2000).max(2100),
    period: zod_1.z.string().min(1, "Period is required"), // e.g., "Janeiro" or "Annual"
    unitId: zod_1.z.number().int().positive("Unit ID is required"),
    comments: zod_1.z.string().optional(),
});
const nullableFloat = zod_1.z.number().optional().nullable();
const nullableString = zod_1.z.string().optional().nullable();
const nullableInt = zod_1.z.number().int().optional().nullable();
exports.mobileCombustionSchema = baseEsgSchema.extend({
    sourceDescription: nullableString,
    isCompanyControlled: zod_1.z.boolean(),
    inputType: zod_1.z.enum(['consumo', 'distancia']).optional().nullable(),
    fuelType: nullableString,
    consumption: nullableFloat,
    consumptionUnit: nullableString,
    distance: nullableFloat,
    distanceUnit: nullableString,
    vehicleType: nullableString,
});
exports.stationaryCombustionSchema = baseEsgSchema.extend({
    sourceDescription: nullableString,
    fuelType: nullableString,
    consumption: nullableFloat,
    unitMeasure: nullableString,
    isCompanyControlled: zod_1.z.boolean(),
});
exports.electricityPurchaseSchema = baseEsgSchema.extend({
    energySource: nullableString,
    specifySource: nullableString,
    consumption: nullableFloat,
    measureUnit: nullableString,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: zod_1.z.string().email().optional().nullable(),
    phone: nullableString,
    traceability: nullableString,
});
exports.energyGenerationSchema = baseEsgSchema.extend({
    sourceDescription: nullableString,
    generationSource: nullableString,
    totalGeneration: nullableFloat,
    measureUnit: nullableString,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: zod_1.z.string().email().optional().nullable(),
    phone: nullableString,
});
const baseTransportSchema = baseEsgSchema.extend({
    transportedItem: nullableString,
    reportType: nullableString,
    fuel: nullableString,
    consumption: nullableFloat,
    consumptionUnit: nullableString,
    vehicleClass: nullableString,
    distance: nullableFloat,
    distanceUnit: nullableString,
    transportedLoad: nullableFloat,
    tripCount: nullableInt,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: zod_1.z.string().email().optional().nullable(),
    phone: nullableString,
});
exports.upstreamTransportSchema = baseTransportSchema.extend({
    transportMode: nullableString,
    origin: nullableString,
    destination: nullableString,
});
exports.downstreamTransportSchema = baseTransportSchema.extend({
    transportMode: nullableString,
    origin: nullableString,
    destination: nullableString,
});
exports.wasteTransportSchema = baseTransportSchema; // Matches base exactly
exports.businessTravelLandSchema = baseEsgSchema.extend({
    tripDescription: nullableString,
    travelMode: nullableString,
    reportType: nullableString,
    fuel: nullableString,
    consumption: nullableFloat,
    consumptionUnit: nullableString,
    distance: nullableFloat,
    distanceUnit: nullableString,
    kmReimbursed: nullableString,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: zod_1.z.string().email().optional().nullable(),
    phone: nullableString,
});
exports.airTravelSchema = baseEsgSchema.extend({
    tripDescription: nullableString,
    airportCodeOrigin: nullableString.refine(v => !v || v.length === 3, "Airport code must be 3 letters"),
    airportCodeDest: nullableString.refine(v => !v || v.length === 3, "Airport code must be 3 letters"),
    tripCount: nullableInt,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: zod_1.z.string().email().optional().nullable(),
    phone: nullableString,
});
exports.employeeCommutingSchema = baseEsgSchema.extend({
    identifier: nullableString,
    methodUsed: nullableString,
    reportType: nullableString,
    fuelType: nullableString,
    consumption: nullableFloat,
    consumptionUnit: nullableString,
    distanceKm: nullableFloat,
    employeeAddress: nullableString,
    workAddress: nullableString,
    daysCommuted: nullableInt,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: zod_1.z.string().email().optional().nullable(),
    phone: nullableString,
});
exports.productionSalesSchema = baseEsgSchema.extend({
    product: zod_1.z.string().min(1),
    quantitySold: zod_1.z.number().int(),
    measureUnit: zod_1.z.string().min(1),
});
exports.purchasedGoodsServicesSchema = baseEsgSchema.extend({
    itemDescription: nullableString,
    itemType: nullableString,
    quantity: nullableFloat,
    unitMeasure: nullableString,
    acquisitionValue: nullableFloat,
    thirdPartyGoods: nullableString,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: zod_1.z.string().email().optional().nullable(),
    phone: nullableString,
});
exports.capitalGoodsSchema = baseEsgSchema.extend({
    capitalGood: nullableString,
    quantity: nullableInt,
    unitMeasure: nullableString,
    acquisitionValue: nullableFloat,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: zod_1.z.string().email().optional().nullable(),
    phone: nullableString,
});
exports.lubricantsIppuSchema = baseEsgSchema.extend({
    emissionSource: nullableString,
    lubricantType: nullableString,
    consumption: nullableFloat,
    unitMeasure: nullableString,
    isCompanyControlled: zod_1.z.boolean(),
});
exports.fugitiveEmissionsSchema = baseEsgSchema.extend({
    emissionSource: nullableString,
    gasType: nullableString,
    quantityReplaced: nullableFloat,
    unitMeasure: nullableString,
    isCompanyControlled: zod_1.z.boolean(),
});
exports.fertilizersSchema = baseEsgSchema.extend({
    fertilizerType: nullableString,
    quantityKg: nullableFloat,
    unitMeasure: nullableString,
    percentNitrogen: nullableFloat.refine(val => !val || (val >= 0 && val <= 100), "Percentage must be 0-100"),
    percentCarbonate: nullableFloat.refine(val => !val || (val >= 0 && val <= 100), "Percentage must be 0-100"),
    isCompanyControlled: zod_1.z.boolean(),
});
exports.solidWasteSchema = baseEsgSchema.extend({
    finalDestination: nullableString,
    wasteType: nullableString,
    quantityGenerated: nullableFloat,
    unitMeasure: nullableString,
    cityStateDest: nullableString,
    locationControlled: nullableString,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: zod_1.z.string().email().optional().nullable(),
    phone: nullableString,
    internalTracking: nullableString,
});
exports.effluentsControlledSchema = baseEsgSchema.extend({
    treatmentOrDest: zod_1.z.string().min(1),
    treatmentType: nullableString,
    finalDestType: nullableString,
    qtyEffluentM3: zod_1.z.number(),
    unitEffluent: zod_1.z.string(),
    qtyOrganic: zod_1.z.number(),
    unitOrganic: zod_1.z.string(),
    qtyNitrogen: zod_1.z.number(),
    unitNitrogen: zod_1.z.string(),
    organicRemovedSludge: nullableFloat,
    unitSludge: nullableString,
});
exports.domesticEffluentsSchema = baseEsgSchema.extend({
    workerType: zod_1.z.string().min(1),
    numWorkers: zod_1.z.number().int(),
    avgWorkHours: zod_1.z.number(),
    septicTankOwner: zod_1.z.string(),
});
exports.landUseChangeSchema = baseEsgSchema.extend({
    prevLandUse: zod_1.z.string().min(1),
    biome: nullableString,
    phytophysiognomy: nullableString,
    areaType: nullableString,
    areaHectares: zod_1.z.number(),
});
exports.plantedForestSchema = baseEsgSchema.extend({
    areaId: nullableString,
    speciesName: nullableString,
    areaPrePreLast: nullableFloat,
    agePrePreLast: nullableInt,
    agePreLast: nullableInt,
    areaHarvestedPreLast: nullableFloat,
    currentArea: nullableFloat,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: zod_1.z.string().email().optional().nullable(),
    phone: nullableString,
});
exports.conservationAreaSchema = baseEsgSchema.extend({
    description: nullableString,
    biome: nullableString,
    phytophysiognomy: nullableString,
    plantedArea: nullableString,
    plantingStatus: nullableString,
    areaStartYear: nullableFloat,
    areaEndYear: nullableFloat,
    changeReason: nullableString,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: zod_1.z.string().email().optional().nullable(),
    phone: nullableString,
});
exports.homeOfficeSchema = baseEsgSchema.extend({
    workRegime: nullableString,
    numEmployees: nullableInt,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: zod_1.z.string().email().optional().nullable(),
    phone: nullableString,
});
