import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { FieldConfig } from "../hooks/useManagerConfig";
import { useManagerData } from "../hooks/useManagerData"; // Import the data hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface ManagerFormProps {
    fields: FieldConfig[];
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    isLoading: boolean;
    onCancel: () => void;
}

export function ManagerForm({
                                fields,
                                initialData,
                                onSubmit,
                                isLoading,
                                onCancel,
                            }: ManagerFormProps) {
    // 1. Initialize Form
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: initialData || {},
    });

    // 2. Load Dynamic Data (Companies & Units)
    // We fetch these regardless of the current page to ensure dropdowns always have data.
    // React Query will cache this, so it's efficient.
    const { data: companiesData } = useManagerData('companies');
    const { data: unitsData } = useManagerData('units');

    // 3. Reset form when opening/closing or changing selection
    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({}); // Clear form for "New" mode
        }
    }, [initialData, reset]);

    // 4. Helper to resolve options
    const getOptions = (field: FieldConfig) => {
        // Priority 1: Static Options (defined in config)
        if (field.options) return field.options;

        // Priority 2: Dynamic Companies
        if (field.dynamicOptions === 'companies') {
            return companiesData?.map((c: any) => ({
                label: c.name,
                value: c.id
            })) || [];
        }

        // Priority 3: Dynamic Units
        if (field.dynamicOptions === 'units') {
            return unitsData?.map((u: any) => ({
                label: u.name,
                value: u.id
            })) || [];
        }

        return [];
    };

    // 5. Render Helper
    const renderField = (field: FieldConfig) => {
        const options = getOptions(field);

        const currentValue = watch(field.name);

        switch (field.type) {
            case "select":
                return (
                    <Select
                        value={currentValue ? String(currentValue) : undefined}
                        onValueChange={(val) => setValue(field.name, val)}
                        defaultValue={
                            initialData?.[field.name]
                                ? String(initialData[field.name])
                                : undefined
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                            {options.length > 0 ? (
                                options.map((opt: any) => (
                                    <SelectItem key={opt.value} value={String(opt.value)}>
                                        {opt.label}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="p-2 text-sm text-gray-500 text-center">
                                    Nenhum item disponível
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                );

            case "boolean":
                return (
                    <Select
                        value={currentValue !== undefined ? String(currentValue) : undefined}
                        onValueChange={(val) => setValue(field.name, val === "true")}
                        defaultValue={
                            initialData?.[field.name] !== undefined
                                ? String(initialData[field.name])
                                : undefined
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Sim (Ativo)</SelectItem>
                            <SelectItem value="false">Não (Inativo)</SelectItem>
                        </SelectContent>
                    </Select>
                );

            case "number":
                return (
                    <Input
                        type="number"
                        placeholder={field.label}
                        {...register(field.name, {
                            required: field.required,
                            valueAsNumber: true // Important for Zod validation
                        })}
                    />
                );

            default: // text, email, password
                return (
                    <Input
                        type={field.type}
                        placeholder={field.label}
                        {...register(field.name, { required: field.required })}
                    />
                );
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                        <Label htmlFor={field.name} className="text-sm font-medium">
                            {field.label}{" "}
                            {field.required && <span className="text-red-500">*</span>}
                        </Label>

                        {renderField(field)}

                        {errors[field.name] && (
                            <span className="text-xs text-red-500">Campo obrigatório</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
                <Button variant="outline" type="button" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Salvando..." : "Salvar Registro"}
                </Button>
            </div>
        </form>
    );
}