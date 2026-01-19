import { z } from "zod";

export const unitFormSchema = z.object({
    name: z.string().min(1, "O nome da unidade é obrigatório."),
    companyId: z.string().min(1, "A empresa é obrigatória."),
    city: z.string().min(1, "A cidade é obrigatória."),
    state: z.string().length(2, "Selecione um estado válido."),
    country: z.string().min(1, "O país é obrigatório."),
    numberOfWorkers: z.coerce.number().min(1, "Informe o número de colaboradores."),
});

export type UnitFormValues = z.infer<typeof unitFormSchema>;