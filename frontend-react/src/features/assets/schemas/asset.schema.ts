import { z } from "zod";

export const assetFormSchema = z.object({
    description: z.string().min(1, "A descrição/identificação é obrigatória."),

    sourceType: z.string().min(1, "Selecione o tipo de fonte (Módulo ESG)."),
    unitId: z.coerce.number().min(1, "Selecione a unidade à qual esta fonte pertence."),

    reportingFrequency: z.enum(["mensal", "anual"], "Selecione a frequência de reporte."),

    isActive: z.boolean().default(true),

    responsibleContactId: z.string("Selecione o contato responsável pela fonte."),

    assetFields: z.record(z.string(), z.any()).default({}),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;