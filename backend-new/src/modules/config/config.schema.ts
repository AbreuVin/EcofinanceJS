import { z } from 'zod';

export const createOptionSchema = z.object({
    fieldKey: z.string().min(1),
    value: z.string().min(1),
});

export const createTypologySchema = z.object({
    companyId: z.string().min(1),
    unitId: z.number().int().positive().nullable(),
    sourceType: z.string().min(1),
    description: z.string().min(1),
    assetFields: z.record(z.string(), z.any()).transform((val) => JSON.stringify(val)),
    isActive: z.boolean().default(true),
    responsibleContactId: z.string().optional().nullable(),
    reportingFrequency: z.enum(['mensal', 'anual']).default('anual'),
});

export const updateTypologySchema = createTypologySchema.partial();