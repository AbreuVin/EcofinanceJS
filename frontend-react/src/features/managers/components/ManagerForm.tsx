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

    const { data: companiesData } = useManagerData('companies');
    const { data: unitsData } = useManagerData('units');

    useEffect(() => {
        if (initialData) {
            const formatted = { ...initialData };
            if (formatted.permissions && Array.isArray(formatted.permissions)) {
                formatted.permissions = formatted.permissions.map((p: any) =>
                    typeof p === 'object' ? p.sourceType : p
                );
            }
            reset(formatted);
        } else {
            reset({ permissions: [] });
        }
    }, [initialData, reset]);

    const getOptions = (field: FieldConfig) => {
        if (field.options) return field.options;

        if (field.dynamicOptions === 'companies') {
            return companiesData?.map((c: any) => ({
                label: c.name,
                value: c.id
            })) || [];
        }

        if (field.dynamicOptions === 'units') {
            return unitsData?.map((u: any) => ({
                label: u.name,
                value: u.id
            })) || [];
        }

        return [];
    };

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
                            <SelectValue placeholder="Selecione..."/>
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
                            <SelectValue placeholder="Selecione..."/>
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

            case "permissions-matrix":
                const currentPerms = (watch(field.name) as string[]) || [];

                return (
                    <div className="col-span-1 md:col-span-2 border rounded-md p-4 bg-muted/20">
                        <Label className="mb-4 block text-base">{field.label}</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {field.options?.map((option) => {
                                const isChecked = currentPerms.includes(String(option.value));
                                return (
                                    <div key={option.value} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`perm-${option.value}`}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            checked={isChecked}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                const val = String(option.value);
                                                const newPerms = checked
                                                    ? [...currentPerms, val]
                                                    : currentPerms.filter((p) => p !== val);
                                                setValue(field.name, newPerms);
                                            }}
                                        />
                                        <label
                                            htmlFor={`perm-${option.value}`}
                                            className="text-sm font-medium leading-none cursor-pointer"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
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
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    {isLoading ? "Salvando..." : "Salvar Registro"}
                </Button>
            </div>
        </form>
    );
}