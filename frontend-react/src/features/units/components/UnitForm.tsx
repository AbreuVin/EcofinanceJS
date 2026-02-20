import { useEffect, useState, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types/enums";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxList,
    ComboboxItem,
} from "@/components/ui/combobox";

import { unitFormSchema, type UnitFormValues } from "../schemas/unit.schema";
import type { Unit } from "@/types/Unit";
import { useCompanies } from "@/features/companies/hooks/useCompanies";
import { WORLD_COUNTRIES } from "@/constants/countries";

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
    const { data: companies = [], isLoading: isLoadingCompanies, error: companiesError } = useCompanies();

    const user = useAuthStore(state => state.user);
    const isMaster = user?.role === UserRole.MASTER;

    const defaultCompanyId = !isMaster && user?.companyId ? user.companyId : "";

    // Inicialização Síncrona Rigorosa. React Hook Form assume o estado exato da propriedade `initialData` no primeiro render.
    const form = useForm<UnitFormValues>({
        resolver: zodResolver(unitFormSchema),
        defaultValues: {
            name: initialData?.name || "",
            companyId: initialData?.companyId || defaultCompanyId,
            country: initialData?.country || "Brasil",
            state: initialData?.state || "",
            city: initialData?.city || "",
            numberOfWorkers: initialData?.numberOfWorkers || undefined,
        },
    });

    const selectedCountry = useWatch({ control: form.control, name: "country" });

    // Hidratação segura SOMENTE para novos registros (fallback caso a store de auth atrase no mount)
    useEffect(() => {
        if (!initialData && defaultCompanyId && !form.getValues("companyId")) {
            form.setValue("companyId", defaultCompanyId);
        }
    }, [defaultCompanyId, initialData, form]);

    // Filtragem Controlada do Combobox
    const [countryQuery, setCountryQuery] = useState("");
    const filteredCountries = useMemo(() => {
        if (!countryQuery) return WORLD_COUNTRIES;
        const lowerQuery = countryQuery.toLowerCase();
        return WORLD_COUNTRIES.filter((c) =>
            c.label.toLowerCase().includes(lowerQuery)
        );
    }, [countryQuery]);

    if (companiesError) {
        return (
            <div className="bg-red-50 p-6 rounded-md border border-red-200 shadow-sm mb-6">
                <h3 className="text-lg font-semibold mb-4 text-red-800">Erro ao carregar formulário</h3>
                <p className="text-red-700">Não foi possível carregar a lista de empresas.</p>
                <Button onClick={onCancel} className="mt-4">Fechar</Button>
            </div>
        );
    }

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
                                        value={field.value || ""}
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
                                <FormItem className="flex flex-col mt-2">
                                    <FormLabel>País</FormLabel>
                                    <Combobox
                                        value={field.value || ""}
                                        onValueChange={(value) => {
                                            field.onChange(value as string);
                                            setCountryQuery("");
                                        }}
                                        inputValue={countryQuery}
                                        onInputValueChange={setCountryQuery}
                                    >
                                        <FormControl>
                                            <ComboboxInput
                                                placeholder="Pesquisar país..."
                                                className="w-full"
                                            />
                                        </FormControl>
                                        <ComboboxContent>
                                            <ComboboxList>
                                                {filteredCountries.length === 0 ? (
                                                    <div className="py-2 text-center text-sm text-muted-foreground">
                                                        Nenhum país encontrado
                                                    </div>
                                                ) : (
                                                    filteredCountries.map((country) => (
                                                        <ComboboxItem
                                                            key={country.value}
                                                            value={country.value}
                                                            className="[&[hidden]]:hidden"
                                                        >
                                                            {country.label}
                                                        </ComboboxItem>
                                                    ))
                                                )}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox>
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