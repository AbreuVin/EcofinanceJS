import { z } from 'zod';

export const createUnitSchema = z.object({
    name: z.string().min(2, "Unit name is required"),
    city: z.string().trim().min(1, "City is required"),
    state: z.string().optional(),
    country: z.string().default('Brasil'),
    numberOfWorkers: z.number().int().min(0).nullable().optional(),
    companyId: z.string("Invalid Company ID"),
});

export const updateUnitSchema = createUnitSchema.partial().omit({ companyId: true });