import { z } from "zod";

export const userFormSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório."),
    email: z.string().email("E-mail inválido."),
    phone: z.string()
        .max(15, "Telefone inválido")
        .optional()
        .refine(val => !val || val.length >= 14, { message: "Telefone incompleto" }),
    role: z.enum(["MASTER", "ADMIN", "USER"], "Selecione um perfil válido."),
    companyId: z.string().optional().transform(val => val === "" ? undefined : val),
    unitId: z.coerce.number().optional(),
    permissions: z.array(z.string()).default([]),
});

export type UserFormValues = z.infer<typeof userFormSchema>;