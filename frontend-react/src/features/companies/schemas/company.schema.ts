import { z } from "zod";

export const companyFormSchema = z.object({
    name: z.string().min(1, "O nome da empresa é obrigatório."),
    cnpj: z
        .string()
        .min(14, "O CNPJ deve ter pelo menos 14 caracteres.")
        .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/, "Formato de CNPJ inválido"),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;