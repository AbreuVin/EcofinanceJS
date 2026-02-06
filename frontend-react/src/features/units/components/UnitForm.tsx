import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types/enums";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

import { unitFormSchema, type UnitFormValues } from "../schemas/unit.schema";
import type { Unit } from "@/types/Unit";
import { useCompanies } from "@/features/companies/hooks/useCompanies";

const COUNTRIES = [
    { label: 'Brasil', value: 'Brasil' },
    { label: 'Argentina', value: 'Argentina' },
    { label: 'Canadá', value: 'Canadá' },
    { label: 'Chile', value: 'Chile' },
    { label: 'Colômbia', value: 'Colômbia' },
    { label: 'Estados Unidos', value: 'Estados Unidos' },
    { label: 'México', value: 'México' },
    { label: 'Outros', value: 'Outros' },
];

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
    const [hasError, setHasError] = useState(false);
    const { data: companies = [], isLoading: isLoadingCompanies, error: companiesError } = useCompanies();

    const user = useAuthStore(state => state.user);
    const isMaster = user?.role === UserRole.MASTER;

    if (companiesError) {
        return (
            <div className="bg-red-50 p-6 rounded-md border border-red-200 shadow-sm mb-6">
                <h3 className="text-lg font-semibold mb-4 text-red-800">Erro ao carregar formulário</h3>
                <p className="text-red-700">Não foi possível carregar a lista de empresas.</p>
                <Button onClick={onCancel} className="mt-4">Fechar</Button>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="bg-red-50 p-6 rounded-md border border-red-200 shadow-sm mb-6">
                <h3 className="text-lg font-semibold mb-4 text-red-800">Erro ao renderizar formulário</h3>
                <p className="text-red-700">Houve um erro ao inicializar o formulário.</p>
                <Button onClick={() => {
                    setHasError(false);
                    onCancel();
                }} className="mt-4">Fechar</Button>
            </div>
        );
    }

    let form;
    try {
        form = useForm({
            resolver: zodResolver(unitFormSchema),
            defaultValues: {
                name: "",
                companyId: "",
                country: "Brasil",
                state: "",
                city: "",
                numberOfWorkers: undefined,
            },
        });
    } catch (err) {
        setHasError(true);
        return null;
    }

    const selectedCountry = form.watch("country");

    useEffect(() => {
        try {
            const defaultCompanyId = !isMaster && user?.companyId ? user.companyId : "";

            if (initialData) {
                form.reset({
                    name: initialData.name || "",
                    companyId: initialData.companyId || defaultCompanyId,
                    country: initialData.country || "Brasil",
                    state: initialData.state || "",
                    city: initialData.city || "",
                    numberOfWorkers: initialData.numberOfWorkers || undefined,
                });
            } else {
                form.reset({
                    name: "",
                    companyId: defaultCompanyId,
                    country: "Brasil",
                    state: "",
                    city: "",
                    numberOfWorkers: undefined,
                });
            }
        } catch (err) {
            setHasError(true);
        }
    }, [initialData, form, isMaster, user]);

    const handleSubmitWrapper = async (values: UnitFormValues) => {
        try {
            await onSubmit(values);
        } catch (err) {
            setHasError(true);
        }
    };

    return (
        <div className="bg-card p-6 rounded-md border shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
                {initialData ? "Editar Unidade" : "Nova Unidade"}
            </h3>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitWrapper)} className="space-y-4">
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
                                        disabled={isLoadingCompanies || !isMaster}
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
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>País</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione o país"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {COUNTRIES.map((country) => (
                                                <SelectItem key={country.value} value={country.value}>
                                                    {country.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {selectedCountry === 'Brasil' && (
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <Select 
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione o estado"/>
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
                        )}

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
                            name="numberOfWorkers"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nº Colaboradores</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={field.value ? String(field.value) : ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === '') {
                                                    field.onChange(undefined);
                                                } else {
                                                    const numVal = parseInt(val, 10);
                                                    field.onChange(isNaN(numVal) ? undefined : numVal);
                                                }
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