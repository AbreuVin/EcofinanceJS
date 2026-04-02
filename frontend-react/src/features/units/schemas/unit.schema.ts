import { z } from "zod";

export const unitFormSchema = z.object({
    name: z.string().min(1, "O nome da unidade é obrigatório."),
    companyId: z.string().min(1, "A empresa é obrigatória."),
    country: z.string().min(1, "O país é obrigatório."),
    state: z.string().optional().nullable(),
    city: z.string().trim().min(1, "A cidade é obrigatória."),
    numberOfWorkers: z.number().min(0).nullable().optional(),
});

export type UnitFormValues = z.infer<typeof unitFormSchema>;