import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";

import { companyFormSchema, type CompanyFormValues } from "../schemas/company.schema";
import type { Company } from "@/types/Company";

interface CompanyFormProps {
    initialData?: Company | null;
    onSubmit: (values: CompanyFormValues) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

const formatCNPJ = (value: string | undefined) => {
    if (!value) return ""

    return value
        .replace(/\D/g, "") // Remove tudo o que não é dígito
        .replace(/(\d{2})(\d)/, "$1.$2") // Coloca ponto após os 2 primeiros dígitos
        .replace(/(\d{3})(\d)/, "$1.$2") // Coloca ponto após os 3 próximos dígitos
        .replace(/(\d{3})(\d)/, "$1/$2") // Coloca barra após os 3 próximos dígitos
        .replace(/(\d{4})(\d)/, "$1-$2") // Coloca hífen antes dos 2 últimos dígitos
        .replace(/(-\d{2})\d+?$/, "$1") // Impede entrada de mais de 14 dígitos (18 com pontuação)
}

export function CompanyForm({
                                initialData,
                                onSubmit,
                                onCancel,
                                isLoading,
                            }: CompanyFormProps) {
    const form = useForm<CompanyFormValues>({
        resolver: zodResolver(companyFormSchema),
        defaultValues: {
            name: "",
            cnpj: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                cnpj: initialData.cnpj || "",
            });
        } else {
            form.reset({ name: "", cnpj: "" });
        }
    }, [initialData, form]);

    return (
        <div className="bg-card p-6 rounded-md border shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
                {initialData ? "Editar Empresa" : "Nova Empresa"}
            </h3>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome Empresarial</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: EcoFinance Ltda" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* CNPJ Field */}
                        <FormField
                            control={form.control}
                            name="cnpj"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CNPJ</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="00.000.000/0000-00"
                                            {...field} // Passa as props padrão (ref, onBlur, value, etc)
                                            onChange={(e) => {
                                                // 1. Pega o valor digitado e aplica a máscara
                                                const { value } = e.target
                                                const formatted = formatCNPJ(value)

                                                // 2. Atualiza o estado do react-hook-form com o valor mascarado
                                                field.onChange(formatted)
                                            }}
                                            maxLength={18} // Limita visualmente a 18 caracteres
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {initialData ? "Atualizar Registro" : "Salvar Registro"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}