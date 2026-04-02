import { z } from "zod";

export const assetFormSchema = z.object({
    companyId: z.string().min(1, "Empresa é obrigatória"),
    description: z.string().min(1, "A descrição/identificação é obrigatória."),

    sourceType: z.string().min(1, "Selecione o tipo de fonte (Módulo ESG)."),

    // Multi-unit: array of unit IDs (empty = global)
    unitIds: z.array(z.number()),

    reportingFrequency: z.enum(["mensal", "anual"], "Selecione a frequência de reporte."),

    // Removed .default(true). useForm already handles the default.
    isActive: z.boolean(),

    // Allow empty string gracefully as optional
    responsibleContactId: z.string().optional(),

    // Rastreabilidade Interna (agora opcionais)
    traceabilityResponsible: z.string().optional().nullable().or(z.literal('')),
    traceabilityEmail: z.string().email("E-mail inválido").optional().nullable().or(z.literal('')),
    traceabilitySector: z.string().optional().nullable().or(z.literal('')),
    traceabilityLocation: z.string().optional().nullable().or(z.literal('')),
    // traceabilityFiles será tratado separadamente no upload

    // Removed .default({}). useForm provides the default.
    assetFields: z.any(),
}).refine(
    (data) => {
        if (data.sourceType === "fertilizers") {
            const nitrogen = parseFloat(data.assetFields?.nitrogenPercent ?? "0");
            const carbonate = parseFloat(data.assetFields?.carbonatePercent ?? "0");
            const total = nitrogen + carbonate;

            return total >= 0 && total <= 100;
        }
        return true;
    },
    {
        message: "A soma do Percentual de Nitrogênio e Carbonato deve estar entre 0% e 100%.",
        path: ["assetFields"],
    }
);

export type AssetFormValues = z.infer<typeof assetFormSchema>;