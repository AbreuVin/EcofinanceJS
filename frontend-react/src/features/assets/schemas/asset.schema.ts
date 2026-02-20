import { z } from "zod";

export const assetFormSchema = z.object({
    description: z.string().min(1, "A descrição/identificação é obrigatória."),

    sourceType: z.string().min(1, "Selecione o tipo de fonte (Módulo ESG)."),

    // Removed z.coerce. UI already casts to Number.
    unitId: z.number().min(0, "Selecione a unidade à qual esta fonte pertence."),

    reportingFrequency: z.enum(["mensal", "anual"], "Selecione a frequência de reporte."),

    // Removed .default(true). useForm already handles the default.
    isActive: z.boolean(),

    // Allow empty string gracefully as optional
    responsibleContactId: z.string().optional(),

    // Rastreabilidade Interna (todos opcionais)
    traceabilityResponsible: z.string().optional(),
    traceabilityEmail: z.string().email("E-mail inválido").optional().or(z.literal("")),
    traceabilitySector: z.string().optional(),
    traceabilityLocation: z.string().optional(),
    // traceabilityFiles será tratado separadamente no upload

    // Removed .default({}). useForm provides the default.
    assetFields: z.record(z.string(), z.any()),
}).refine(
    (data) => {
        if (data.sourceType === "fertilizers") {
            const nitrogen = parseFloat(data.assetFields?.nitrogenPercent ?? "0");
            const carbonate = parseFloat(data.assetFields?.carbonatePercent ?? "0");
            const total = nitrogen + carbonate;

            return total === 100;
        }
        return true;
    },
    {
        message: "O Percentual de Nitrogênio + Percentual de Carbonato deve ser exatamente 100%.",
        path: ["assetFields"],
    }
);

export type AssetFormValues = z.infer<typeof assetFormSchema>;