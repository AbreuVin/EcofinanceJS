import { Loader2, Upload, X, FileText } from "lucide-react";
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
import { useMemo, useState } from "react";
import { useAuthStore } from "@/store/authStore";

// --- REINTRODUCED SCOPE CONSTANTS ---
const SCOPE_MODULES: Record<string, string[]> = {
    escopo_1: [
        'production_sales', 'stationary_combustion', 'mobile_combustion',
        'lubricants_ippu', 'fugitive_emissions', 'fertilizers',
        'effluents_controlled', 'domestic_effluents', 'land_use_change', 'solid_waste',
    ],
    escopo_2: ['electricity_purchase'],
    escopo_3: [
        'purchased_goods', 'capital_goods', 'upstream_transport', 'business_travel_land',
        'downstream_transport', 'waste_transport', 'home_office', 'air_travel',
        'employee_commuting', 'energy_generation', 'planted_forest', 'conservation_area',
    ],
};

const SCOPE_LABELS: Record<string, string> = {
    escopo_1: "Escopo 1",
    escopo_2: "Escopo 2",
    escopo_3: "Escopo 3",
};

function getScopeFromModule(moduleValue: string): string | null {
    for (const [scope, modules] of Object.entries(SCOPE_MODULES)) {
        if (modules.includes(moduleValue)) return scope;
    }
    return null;
}
// -------------------------------------

// Tipos de arquivos aceitos para rastreabilidade
const ACCEPTED_FILE_TYPES = ".xlsx,.xls,.pdf,.doc,.docx";
const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Componente de Rastreabilidade Interna
function TraceabilitySection({ form }: { form: ReturnType<typeof useAssetForm>["form"] }) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setFileError(null);

        // Validar tamanho de cada arquivo
        const invalidFiles = files.filter(f => f.size > MAX_FILE_SIZE_BYTES);
        if (invalidFiles.length > 0) {
            setFileError(`Alguns arquivos excedem o limite de ${MAX_FILE_SIZE_MB}MB`);
            return;
        }

        setSelectedFiles(prev => [...prev, ...files]);
        e.target.value = ""; // Reset input para permitir selecionar o mesmo arquivo novamente
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const getFileIcon = (_fileName: string) => {
        // TODO: Implementar icones diferentes por tipo de arquivo (xlsx, pdf, docx)
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="bg-muted/30 p-5 rounded-lg border">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                Rastreabilidade Interna
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="traceabilityResponsible"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Responsável pela Informação</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome do responsável" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="traceabilityEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="email@exemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="traceabilitySector"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Setor</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Financeiro, Operações" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="traceabilityLocation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Localização da Informação</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Pasta X, Sistema Y" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Upload de Arquivos */}
            <div className="mt-4">
                <FormLabel>Arquivos de Evidência</FormLabel>
                <p className="text-xs text-muted-foreground mb-2">
                    Formatos aceitos: Excel, PDF, Word. Máximo {MAX_FILE_SIZE_MB}MB por arquivo.
                </p>
                
                <div className="flex flex-col gap-3">
                    {/* Área de upload */}
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold">Clique para selecionar</span> ou arraste arquivos
                            </p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            multiple
                            accept={ACCEPTED_FILE_TYPES}
                            onChange={handleFileChange}
                        />
                    </label>

                    {fileError && (
                        <p className="text-sm text-destructive">{fileError}</p>
                    )}

                    {/* Lista de arquivos selecionados */}
                    {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                            {selectedFiles.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="flex items-center justify-between p-2 bg-background rounded-md border"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        {getFileIcon(file.name)}
                                        <span className="text-sm truncate">{file.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            ({formatFileSize(file.size)})
                                        </span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 shrink-0"
                                        onClick={() => removeFile(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
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

    // Synchronous state initialization (Safe because of the 'key' prop on the parent)
    const [selectedScope, setSelectedScope] = useState<string>(() => {
        const initialSource = initialData?.sourceType || preSelectedSourceType;
        if (initialSource) {
            return getScopeFromModule(initialSource) || "";
        }
        return "";
    });

    // Derive available modules based on the selected scope
    const scopeModules = useMemo(() => {
        if (!selectedScope) return [];
        const moduleValues = SCOPE_MODULES[selectedScope] || [];
        return ESG_MODULES
            .filter(mod => moduleValues.includes(mod.value))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [selectedScope]);

    const unitUsers = useMemo(() => {
        if (!selectedUnitId || Number(selectedUnitId) === 0) {
            return users;
        }
        return users.filter((user) => Number(user.unitId) === Number(selectedUnitId));
    }, [users, selectedUnitId]);

    const handleSubmitWrapper = async (values: AssetFormValues) => {
        const payload = {
            ...values,
            unitId: values.unitId === 0 ? null : values.unitId,
            companyId: initialData?.companyId || user?.companyId
        };
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
                <form onSubmit={form.handleSubmit(handleSubmitWrapper)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* REINTRODUCED SCOPE SELECT */}
                        <FormItem>
                            <FormLabel>Escopo</FormLabel>
                            <Select
                                value={selectedScope || ""}
                                onValueChange={(val) => {
                                    setSelectedScope(val);
                                    // Cascade reset dependent fields
                                    form.setValue("sourceType", "");
                                    form.setValue("assetFields", {});
                                }}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o escopo..." />
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
                                        value={field.value || ""}
                                        disabled={!selectedScope} // Block interaction if no scope is selected
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={selectedScope ? "Selecione o tipo..." : "Selecione o escopo primeiro"} />
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
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <FormControl>
                                            <SelectTrigger className="w-full"><SelectValue placeholder="Selecione..."/></SelectTrigger>
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
                                    <FormLabel>Unidade Empresarial</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value != null ? String(field.value) : "0"}
                                        disabled={loadingUnits}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione a unidade"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
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
                                    <FormLabel>Responsável pelo Cadastro (Opcional)</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
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

                    {/* Seção de Rastreabilidade Interna */}
                    <TraceabilitySection form={form} />

                    <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-background">
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