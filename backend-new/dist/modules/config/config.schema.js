"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTypologySchema = exports.createTypologySchema = exports.createOptionSchema = void 0;
const zod_1 = require("zod");
exports.createOptionSchema = zod_1.z.object({
    fieldKey: zod_1.z.string().min(1),
    value: zod_1.z.string().min(1),
});
exports.createTypologySchema = zod_1.z.object({
    unitId: zod_1.z.number().int().positive(),
    sourceType: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    assetFields: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).transform((val) => JSON.stringify(val)),
    isActive: zod_1.z.boolean().default(true),
    responsibleContactId: zod_1.z.string().optional().nullable(),
    reportingFrequency: zod_1.z.enum(['mensal', 'anual']).default('anual'),
});
exports.updateTypologySchema = exports.createTypologySchema.partial();
