import { z } from 'zod';

export const createCompanySchema = z.object({
    name: z.string().min(2, "Company name is required"),
    cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "Invalid CNPJ format").optional().nullable(),
});

export const updateCompanySchema = createCompanySchema.partial();