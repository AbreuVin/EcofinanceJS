import { useFormContext, useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    EFFLUENT_DESTINATION_TYPES,
    EFFLUENT_TREATMENT_TYPES,
    EFFLUENT_FINAL_DESTINATIONS,
    WORKER_TYPES,
    YES_NO_OPTIONS,
    EFFLUENT_PARAMETER_UNITS // <--- Importar a nova lista
} from "../../constants/esg-options";

export function EffluentsFields() {
    const { control } = useFormContext();
    const sourceType = useWatch({ control, name: "sourceType" });
    const treatmentOrDest = useWatch({ control, name: "assetFields.treatmentOrDest" });

    const isDomestic = sourceType === 'domestic_effluents';

    if (isDomestic) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="assetFields.workerType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de Trabalhador</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {WORKER_TYPES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="assetFields.hasSepticTank"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fossa séptica na propriedade da empresa?</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {YES_NO_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        );
    }

    // Efluentes Controlados
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={control}
                name="assetFields.treatmentOrDest"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tratamento ou Destino Final?</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {EFFLUENT_DESTINATION_TYPES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {treatmentOrDest === 'Tratamento' && (
                <FormField
                    control={control}
                    name="assetFields.treatmentType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de Tratamento</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent className="max-h-[200px]">
                                    {EFFLUENT_TREATMENT_TYPES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {treatmentOrDest === 'Destino Final' && (
                <FormField
                    control={control}
                    name="assetFields.finalDestType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de Destino Final</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent className="max-h-[200px]">
                                    {EFFLUENT_FINAL_DESTINATIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {/* NOVO CAMPO: Unidade Padrão */}
            <FormField
                control={control}
                name="assetFields.standardUnit"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Unidade Padrão</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {EFFLUENT_PARAMETER_UNITS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}