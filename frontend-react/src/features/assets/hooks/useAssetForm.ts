import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assetFormSchema, type AssetFormValues } from "../schemas/asset.schema";
import type { AssetTypology } from "@/types/AssetTypology";

interface UseAssetFormProps {
    initialData?: AssetTypology | null;
    onSubmit: (values: AssetFormValues) => Promise<void>;
    preSelectedSourceType?: string;
}

function parseAssetFields(fields: any): Record<string, any> {
    if (!fields) return {};
    try {
        const parsed = typeof fields === 'string' ? JSON.parse(fields) : fields;
        return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
    } catch (e) {
        console.error("Failed to parse assetFields:", e);
        return {};
    }
}

export function useAssetForm({ initialData, onSubmit, preSelectedSourceType }: UseAssetFormProps) {
    const form = useForm<AssetFormValues>({
        resolver: zodResolver(assetFormSchema),
        // Synchronous hydration: Since the parent component uses a 'key' prop,
        // this is evaluated precisely once with the correct data already injected.
        defaultValues: {
            description: initialData?.description || "",
            sourceType: initialData?.sourceType || preSelectedSourceType || "",
            unitId: initialData?.unitId != null ? Number(initialData.unitId) : 0,
            reportingFrequency: (initialData?.reportingFrequency as "mensal" | "anual") || "mensal",
            isActive: initialData?.isActive ?? true,
            responsibleContactId: initialData?.responsibleContactId || "",
            assetFields: parseAssetFields(initialData?.assetFields),
        },
    });

    const handleSubmit = form.handleSubmit(async (values) => {
        await onSubmit(values);
    });

    return { form, handleSubmit };
}