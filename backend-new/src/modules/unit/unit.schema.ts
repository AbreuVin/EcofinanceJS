import { z } from 'zod';

export const createUnitSchema = z.object({
    name: z.string().min(2, "Unit name is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    country: z.string().default('Brasil'),
    numberOfWorkers: z.coerce.number().int().min(1),
    companyId: z.string("Invalid Company ID"),
});

export const updateUnitSchema = createUnitSchema.partial().omit({ companyId: true });