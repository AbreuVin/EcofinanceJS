import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assetFormSchema, type AssetFormValues } from "../schemas/asset.schema";
import type { AssetTypology } from "@/types/AssetTypology";

interface UseAssetFormProps {
    initialData?: AssetTypology | null;
    onSubmit: (values: AssetFormValues) => Promise<void>;
}

export function useAssetForm({ initialData, onSubmit }: UseAssetFormProps) {
    const form = useForm({
        resolver: zodResolver(assetFormSchema),
        defaultValues: {
            description: "",
            sourceType: "",
            unitId: 0,
            reportingFrequency: "mensal",
            isActive: true,
            responsibleContactId: undefined,
            assetFields: {},
        },
    });

    useEffect(() => {
        if (initialData) {
            let parsedFields = {};

            try {
                parsedFields = JSON.parse(initialData.assetFields);
            } catch (e) {
                console.error("Failed to parse assetFields:", e);
                parsedFields = {};
            }

            form.reset({
                description: initialData.description,
                sourceType: initialData.sourceType,
                unitId: Number(initialData.unitId),
                reportingFrequency: initialData.reportingFrequency as "mensal" | "anual",
                isActive: initialData.isActive,
                responsibleContactId: initialData.responsibleContactId,
                assetFields: parsedFields,
            });
        } else {
            form.reset({
                description: "",
                sourceType: "",
                unitId: 0,
                reportingFrequency: "mensal",
                isActive: true,
                responsibleContactId: undefined,
                assetFields: {},
            });
        }
    }, [initialData, form]);

    const handleSubmit = form.handleSubmit(async (values) => {
        await onSubmit(values);
    });

    return { form, handleSubmit };
}