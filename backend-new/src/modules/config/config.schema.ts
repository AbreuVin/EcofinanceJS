import { z } from 'zod';

export const createOptionSchema = z.object({
    fieldKey: z.string().min(1),
    value: z.string().min(1),
});

export const createTypologySchema = z.object({
    unitIds: z.array(z.number().int().positive()).default([]),
    sourceType: z.string().min(1),
    description: z.string().min(1),
    assetFields: z.record(z.string(), z.any()).transform((val) => JSON.stringify(val)),
    isActive: z.boolean().default(true),
    responsibleContactId: z.string().optional().nullable(),
    reportingFrequency: z.enum(['mensal', 'anual']).default('anual'),

    // --- Traceability Validation ---
    traceabilityResponsible: z.string().min(1, "Responsável é obrigatório"),
    traceabilityEmail: z.string().email("E-mail inválido").min(1),
    traceabilitySector: z.string().min(1, "Setor é obrigatório"),
    traceabilityLocation: z.string().min(1, "Localização é obrigatória"),
});

export const updateTypologySchema = createTypologySchema.partial();