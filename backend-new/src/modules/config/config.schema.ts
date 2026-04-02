import { z } from 'zod';

export const createOptionSchema = z.object({
    fieldKey: z.string().min(1),
    value: z.string().min(1),
});

export const createTypologySchema = z.object({
    companyId: z.string().min(1, "Empresa é obrigatória"),
    unitIds: z.array(z.number().int().positive()).default([]),
    sourceType: z.string().min(1),
    description: z.string().min(1),
    assetFields: z.union([z.record(z.string(), z.any()), z.string()]).transform((val) => {
        if (typeof val === "string") return val;
        return JSON.stringify(val ?? {});
    }),
    isActive: z.boolean().default(true),
    responsibleContactId: z.string().optional().nullable(),
    reportingFrequency: z.enum(['mensal', 'anual']).default('anual'),

    // --- Traceability Validation ---
    traceabilityResponsible: z.string().optional().nullable().or(z.literal('')),
    traceabilityEmail: z.string().email("E-mail inválido").optional().nullable().or(z.literal('')),
    traceabilitySector: z.string().optional().nullable().or(z.literal('')),
    traceabilityLocation: z.string().optional().nullable().or(z.literal('')),
});

export const updateTypologySchema = createTypologySchema.partial();