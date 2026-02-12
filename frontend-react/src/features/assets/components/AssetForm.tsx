import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { ESG_MODULES } from "@/types/enums";
import type { AssetTypology } from "@/types/AssetTypology";
import type { AssetFormValues } from "../schemas/asset.schema";
import { useUnits } from "@/features/units/hooks/useUnits";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useAssetForm } from "../hooks/useAssetForm";
import { AssetDynamicFields } from "./AssetDynamicFields";
import { useWatch } from "react-hook-form";
import { useMemo, useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

// Scope groupings for modules
const SCOPE_MODULES: Record<string, string[]> = {
    escopo_1: [
        'production_sales',
        'stationary_combustion',
        'mobile_combustion',
        'lubricants_ippu',
        'fugitive_emissions',
        'fertilizers',
        'effluents_controlled',
        'domestic_effluents',
        'land_use_change',
        'solid_waste',
    ],
    escopo_2: [
        'electricity_purchase',
    ],
    escopo_3: [
        'purchased_goods',
        'capital_goods',
        'upstream_transport',
        'business_travel_land',
        'downstream_transport',
        'waste_transport',
        'home_office',
        'air_travel',
        'employee_commuting',
        'energy_generation',
        'planted_forest',
        'conservation_area',
    ],
};

const SCOPE_LABELS: Record<string, string> = {
    escopo_1: "Escopo 1",
    escopo_2: "Escopo 2",
    escopo_3: "Escopo 3",
};

// Helper to find scope from module value
function getScopeFromModule(moduleValue: string): string | null {
    for (const [scope, modules] of Object.entries(SCOPE_MODULES)) {
        if (modules.includes(moduleValue)) {
            return scope;
        }
    }
    return null;
}

interface AssetFormProps {
    initialData?: AssetTypology | null;
    onSubmit: (values: AssetFormValues) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
    preSelectedSourceType?: string;
}

export function AssetForm({ initialData, onSubmit, onCancel, isLoading, preSelectedSourceType }: AssetFormProps) {
    const { form } = useAssetForm({ initialData, onSubmit, preSelectedSourceType });
    const user = useAuthStore((state) => state.user);

    const { data: units = [], isLoading: loadingUnits } = useUnits();
    const { data: users = [], isLoading: loadingUsers } = useUsers();

    const selectedUnitId = useWatch({ control: form.control, name: "unitId" });
    const currentSourceType = useWatch({ control: form.control, name: "sourceType" });

    // State for scope selection
    const [selectedScope, setSelectedScope] = useState<string>(() => {
        // Initialize from existing data or preSelectedSourceType
        const moduleValue = initialData?.sourceType || preSelectedSourceType;
        if (moduleValue) {
            return getScopeFromModule(moduleValue) || "";
        }
        return "";
    });

    // Update scope when source type changes externally
    useEffect(() => {
        if (currentSourceType) {
            const scope = getScopeFromModule(currentSourceType);
            if (scope && scope !== selectedScope) {
                setSelectedScope(scope);
            }
        }
    }, [currentSourceType]);

    // Get modules for the selected scope
    const scopeModules = useMemo(() => {
        if (!selectedScope) return [];
        const moduleValues = SCOPE_MODULES[selectedScope] || [];
        return ESG_MODULES
            .filter(mod => moduleValues.includes(mod.value))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [selectedScope]);

    // Lógica para filtrar usuários: Se ID for 0 ou undefined, mostra todos.
    const unitUsers = useMemo(() => {
        if (!selectedUnitId || Number(selectedUnitId) === 0) {
            return users;
        }
        return users.filter((user) => Number(user.unitId) === Number(selectedUnitId));
    }, [users, selectedUnitId]);

    // WRAPPER DE ENVIO: Intercepta o submit para converter 0 -> null e adicionar companyId
    const handleSubmitWrapper = async (values: AssetFormValues) => {
        // Cria uma cópia dos valores tratando o unitId e adicionando companyId
        const payload = {
            ...values,
            unitId: values.unitId === 0 ? null : values.unitId,
            // Use existing companyId when editing, or user's companyId for new assets
            companyId: initialData?.companyId || user?.companyId
        };

        // Envia para a função original (que chama a API)
        // O cast 'as any' ou 'as AssetFormValues' pode ser necessário dependendo da tipagem estrita do TS no onSubmit
        await onSubmit(payload as unknown as AssetFormValues);
    };

    return (
        <div className="bg-card p-6 rounded-md border shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-2">
                {initialData ? "Editar Fonte de Emissão" : "Nova Fonte de Emissão"}
            </h3>
            <h4 className="text-sm text-muted-foreground mb-6 w-3/4">
                {currentSourceType
                    ? ESG_MODULES.find(m => m.value === currentSourceType)?.assetDesc
                    : "Configurações Gerais"}
            </h4>

            <Form {...form}>
                {/* O formulário agora chama o wrapper, não o handleSubmit direto */}
                <form onSubmit={form.handleSubmit(handleSubmitWrapper)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Scope selection dropdown */}
                        <FormItem>
                            <FormLabel>Escopo</FormLabel>
                            <Select
                                onValueChange={(val) => {
                                    setSelectedScope(val);
                                    // Clear sourceType when scope changes
                                    form.setValue("sourceType", "" as any);
                                    form.setValue("assetFields", {});
                                }}
                                value={selectedScope}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o escopo..."/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.entries(SCOPE_LABELS).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>

                        {/* Module selection dropdown - only shows when scope is selected */}
                        <FormField
                            control={form.control}
                            name="sourceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Fonte (Módulo ESG)</FormLabel>
                                    <Select
                                        onValueChange={(val) => {
                                            field.onChange(val);
                                            form.setValue("assetFields", {});
                                        }}
                                        value={field.value}
                                        disabled={!selectedScope}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={selectedScope ? "Selecione o tipo..." : "Selecione o escopo primeiro"}/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-[300px]">
                                            {scopeModules.map((mod) => (
                                                <SelectItem key={mod.value} value={mod.value}>
                                                    {mod.label}
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição / Identificação</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Frota Caminhões, Caldeira 01" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="reportingFrequency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Frequência de Reporte</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full"><SelectValue/></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="mensal">Mensal</SelectItem>
                                            <SelectItem value="anual">Anual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="unitId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unidade Pertencente</FormLabel>
                                    <Select
                                        // Garante que o valor no form seja número
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        // Converte para string para o componente Select entender
                                        value={field.value !== undefined ? String(field.value) : undefined}
                                        disabled={loadingUnits}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione a unidade"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {/* Valor 0 para o Front, será convertido para null no submit */}
                                            <SelectItem value="0">Todas as Unidades (Global)</SelectItem>
                                            {units.map((u) => (
                                                <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="responsibleContactId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Responsável (Opcional)</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ? String(field.value) : undefined}
                                        // Desabilita apenas se não houver usuários carregados
                                        disabled={loadingUsers || unitUsers.length === 0}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={
                                                    loadingUsers
                                                        ? "Carregando..."
                                                        : unitUsers.length === 0
                                                            ? "Nenhum usuário disponível"
                                                            : "Selecione um responsável"
                                                }/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {unitUsers.map((user) => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    {user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="bg-muted/30 p-5 rounded-lg border">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                            Configuração Específica
                        </h4>
                        <AssetDynamicFields/>
                    </div>

                    <div
                        className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-background">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Fonte Ativa</FormLabel>
                            <FormDescription>
                                Desative para ocultar esta fonte dos reportes.
                            </FormDescription>
                        </div>
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
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