import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

import { unitFormSchema, type UnitFormValues } from "../schemas/unit.schema";
import type { Unit } from "@/types/Unit";
import { useCompanies } from "@/features/companies/hooks/useCompanies";

const BR_STATES = [
    { label: 'Acre', value: 'AC' },
    { label: 'Alagoas', value: 'AL' },
    { label: 'Amapá', value: 'AP' },
    { label: 'Amazonas', value: 'AM' },
    { label: 'Bahia', value: 'BA' },
    { label: 'Ceará', value: 'CE' },
    { label: 'Distrito Federal', value: 'DF' },
    { label: 'Espírito Santo', value: 'ES' },
    { label: 'Goiás', value: 'GO' },
    { label: 'Maranhão', value: 'MA' },
    { label: 'Mato Grosso', value: 'MT' },
    { label: 'Mato Grosso do Sul', value: 'MS' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Pará', value: 'PA' },
    { label: 'Paraíba', value: 'PB' },
    { label: 'Paraná', value: 'PR' },
    { label: 'Pernambuco', value: 'PE' },
    { label: 'Piauí', value: 'PI' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Rio Grande do Norte', value: 'RN' },
    { label: 'Rio Grande do Sul', value: 'RS' },
    { label: 'Rondônia', value: 'RO' },
    { label: 'Roraima', value: 'RR' },
    { label: 'Santa Catarina', value: 'SC' },
    { label: 'São Paulo', value: 'SP' },
    { label: 'Sergipe', value: 'SE' },
    { label: 'Tocantins', value: 'TO' }
];

interface UnitFormProps {
    initialData?: Unit | null;
    onSubmit: (values: UnitFormValues) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

export function UnitForm({ initialData, onSubmit, onCancel, isLoading }: UnitFormProps) {
    const { data: companies = [], isLoading: isLoadingCompanies } = useCompanies();

    const form = useForm({
        resolver: zodResolver(unitFormSchema),
        defaultValues: {
            name: "",
            companyId: "",
            city: "",
            state: "",
            country: "Brasil",
            numberOfWorkers: 0,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                companyId: initialData.companyId || "",
                city: initialData.city,
                state: initialData.state,
                country: initialData.country,
                numberOfWorkers: initialData.numberOfWorkers,
            });
        } else {
            form.reset({
                name: "",
                companyId: "",
                city: "",
                state: "",
                country: "Brasil",
                numberOfWorkers: 0,
            });
        }
    }, [initialData, form]);

    return (
        <div className="bg-card p-6 rounded-md border shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
                {initialData ? "Editar Unidade" : "Nova Unidade"}
            </h3>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome da Unidade</FormLabel>
                                    <FormControl><Input placeholder="Ex: Fábrica Matriz" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="companyId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Empresa</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isLoadingCompanies}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione a empresa"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {companies.map((company) => (
                                                <SelectItem key={company.id} value={company.id}>
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cidade</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="UF"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {BR_STATES.map((state) => (
                                                <SelectItem key={state.value} value={state.value}>
                                                    {state.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>País</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="numberOfWorkers"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nº Colaboradores</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...field}
                                            value={(field.value as number) ?? ''}
                                            onChange={(e) => {
                                                const val = e.target.valueAsNumber;
                                                field.onChange(isNaN(val) ? 0 : val);
                                            }}
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
                            {initialData ? "Atualizar" : "Salvar"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}