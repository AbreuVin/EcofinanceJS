import { z } from 'zod';

// --- 1. SHARED PATTERNS (DRY Principle) ---

// Base schema for almost all ESG data tables
const baseEsgSchema = z.object({
    year: z.number().int().min(2000).max(2100),
    period: z.string().min(1, "Period is required"), // e.g., "Janeiro" or "Annual"
    unitId: z.number().int().positive("Unit ID is required"),
    comments: z.string().optional(),
});

// Helper for nullable floats (common in ESG data)
const nullableFloat = z.number().optional().nullable();
const nullableString = z.string().optional().nullable();
const nullableInt = z.number().int().optional().nullable();

// --- 2. CONFIGURATION SCHEMAS ---

export const managedOptionSchema = z.object({
    fieldKey: z.string().min(1),
    value: z.string().min(1),
});

export const assetTypologySchema = z.object({
    unitId: z.number().int().positive(),
    sourceType: z.string().min(1),
    description: z.string().min(1),
    // DX Improvement: Accept object, transform to string for DB
    assetFields: z.record(z.string(), z.any()).transform((val) => JSON.stringify(val)),
    isActive: z.boolean().default(true),
    responsibleContactId: z.number().int().optional().nullable(),
    reportingFrequency: z.enum(['mensal', 'anual']).default('anual'),
});

// --- 3. DATA TABLES (Combustion & Energy) ---

export const mobileCombustionSchema = baseEsgSchema.extend({
    sourceDescription: nullableString,
    isCompanyControlled: z.boolean(),
    inputType: z.enum(['consumo', 'distancia']).optional().nullable(),
    fuelType: nullableString,
    consumption: nullableFloat,
    consumptionUnit: nullableString,
    distance: nullableFloat,
    distanceUnit: nullableString,
    vehicleType: nullableString,
});

export const stationaryCombustionSchema = baseEsgSchema.extend({
    sourceDescription: nullableString,
    fuelType: nullableString,
    consumption: nullableFloat,
    unitMeasure: nullableString,
    isCompanyControlled: z.boolean(),
});

export const electricityPurchaseSchema = baseEsgSchema.extend({
    energySource: nullableString,
    specifySource: nullableString,
    consumption: nullableFloat,
    measureUnit: nullableString,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: z.string().email().optional().nullable(),
    phone: nullableString,
    traceability: nullableString,
});

export const energyGenerationSchema = baseEsgSchema.extend({
    sourceDescription: nullableString,
    generationSource: nullableString,
    totalGeneration: nullableFloat,
    measureUnit: nullableString,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: z.string().email().optional().nullable(),
    phone: nullableString,
});

// --- 4. DATA TABLES (Logistics & Transport) ---

// Base for transport since they share many fields
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
    email: z.string().email().optional().nullable(),
    phone: nullableString,
});

export const upstreamTransportSchema = baseTransportSchema.extend({
    transportMode: nullableString,
    origin: nullableString,
    destination: nullableString,
});

export const downstreamTransportSchema = baseTransportSchema.extend({
    transportMode: nullableString,
    origin: nullableString,
    destination: nullableString,
});

export const wasteTransportSchema = baseTransportSchema; // Matches base exactly

export const businessTravelLandSchema = baseEsgSchema.extend({
    tripDescription: nullableString,
    travelMode: nullableString,
    reportType: nullableString,
    fuel: nullableString,
    consumption: nullableFloat,
    consumptionUnit: nullableString,
    distance: nullableFloat,
    distanceUnit: nullableString,
    kmReimbursed: nullableString, // Boolean-ish string in legacy, keep flexible or strict?
    responsible: nullableString,
    deptResponsible: nullableString,
    email: z.string().email().optional().nullable(),
    phone: nullableString,
});

export const airTravelSchema = baseEsgSchema.extend({
    tripDescription: nullableString,
    airportCodeOrigin: nullableString.refine(v => !v || v.length === 3, "Airport code must be 3 letters"),
    airportCodeDest: nullableString.refine(v => !v || v.length === 3, "Airport code must be 3 letters"),
    tripCount: nullableInt,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: z.string().email().optional().nullable(),
    phone: nullableString,
});

export const employeeCommutingSchema = baseEsgSchema.extend({
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
    email: z.string().email().optional().nullable(),
    phone: nullableString,
});

// --- 5. DATA TABLES (Production & Materials) ---

export const productionSalesSchema = baseEsgSchema.extend({
    product: z.string().min(1),
    quantitySold: z.number().int(),
    measureUnit: z.string().min(1),
});

export const purchasedGoodsServicesSchema = baseEsgSchema.extend({
    itemDescription: nullableString,
    itemType: nullableString,
    quantity: nullableFloat,
    unitMeasure: nullableString,
    acquisitionValue: nullableFloat,
    thirdPartyGoods: nullableString,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: z.string().email().optional().nullable(),
    phone: nullableString,
});

export const capitalGoodsSchema = baseEsgSchema.extend({
    capitalGood: nullableString,
    quantity: nullableInt,
    unitMeasure: nullableString,
    acquisitionValue: nullableFloat,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: z.string().email().optional().nullable(),
    phone: nullableString,
});

// --- 6. DATA TABLES (Emissions & Waste) ---

export const lubricantsIppuSchema = baseEsgSchema.extend({
    emissionSource: nullableString,
    lubricantType: nullableString,
    consumption: nullableFloat,
    unitMeasure: nullableString,
    isCompanyControlled: z.boolean(),
});

export const fugitiveEmissionsSchema = baseEsgSchema.extend({
    emissionSource: nullableString,
    gasType: nullableString,
    quantityReplaced: nullableFloat,
    unitMeasure: nullableString,
    isCompanyControlled: z.boolean(),
});

export const fertilizersSchema = baseEsgSchema.extend({
    fertilizerType: nullableString,
    quantityKg: nullableFloat,
    unitMeasure: nullableString,
    percentNitrogen: nullableFloat.refine(val => !val || (val >= 0 && val <= 100), "Percentage must be 0-100"),
    percentCarbonate: nullableFloat.refine(val => !val || (val >= 0 && val <= 100), "Percentage must be 0-100"),
    isCompanyControlled: z.boolean(),
});

export const solidWasteSchema = baseEsgSchema.extend({
    finalDestination: nullableString,
    wasteType: nullableString,
    quantityGenerated: nullableFloat,
    unitMeasure: nullableString,
    cityStateDest: nullableString,
    locationControlled: nullableString,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: z.string().email().optional().nullable(),
    phone: nullableString,
    internalTracking: nullableString,
});

export const effluentsControlledSchema = baseEsgSchema.extend({
    treatmentOrDest: z.string().min(1),
    treatmentType: nullableString,
    finalDestType: nullableString,
    qtyEffluentM3: z.number(),
    unitEffluent: z.string(),
    qtyOrganic: z.number(),
    unitOrganic: z.string(),
    qtyNitrogen: z.number(),
    unitNitrogen: z.string(),
    organicRemovedSludge: nullableFloat,
    unitSludge: nullableString,
});

export const domesticEffluentsSchema = baseEsgSchema.extend({
    workerType: z.string().min(1),
    numWorkers: z.number().int(),
    avgWorkHours: z.number(),
    septicTankOwner: z.string(), // "Sim", "Não" or specific owner
});

// --- 7. DATA TABLES (Land Use & Forestry) ---

export const landUseChangeSchema = baseEsgSchema.extend({
    prevLandUse: z.string().min(1),
    biome: nullableString,
    phytophysiognomy: nullableString,
    areaType: nullableString,
    areaHectares: z.number(),
});

export const plantedForestSchema = baseEsgSchema.extend({
    areaId: nullableString,
    speciesName: nullableString,
    areaPrePreLast: nullableFloat,
    agePrePreLast: nullableInt,
    agePreLast: nullableInt,
    areaHarvestedPreLast: nullableFloat,
    currentArea: nullableFloat,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: z.string().email().optional().nullable(),
    phone: nullableString,
});

export const conservationAreaSchema = baseEsgSchema.extend({
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
    email: z.string().email().optional().nullable(),
    phone: nullableString,
});

export const homeOfficeSchema = baseEsgSchema.extend({
    workRegime: nullableString,
    numEmployees: nullableInt,
    responsible: nullableString,
    deptResponsible: nullableString,
    email: z.string().email().optional().nullable(),
    phone: nullableString,
});

// --- TYPES EXPORT ---
// Example usage: type MobileCombustionInput = z.infer<typeof mobileCombustionSchema>;