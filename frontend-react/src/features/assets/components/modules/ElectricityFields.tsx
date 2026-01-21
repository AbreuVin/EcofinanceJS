import { useFormContext, useWatch } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ELECTRICITY_SOURCE_TYPES, ELECTRICITY_UNITS, GENERATION_SOURCES } from "../../constants/esg-options";

export function ElectricityFields() {
    const { control } = useFormContext();
    const sourceType = useWatch({ control, name: "assetFields.sourceType" });

    const isGrid = sourceType === "GRID";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={control}
                name="assetFields.sourceType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fonte de Energia (Descrição)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {ELECTRICITY_SOURCE_TYPES.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {!isGrid && sourceType && (
                <FormField
                    control={control}
                    name="assetFields.specificSource"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Especificar Fonte Padrão</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {GENERATION_SOURCES.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                    {sourceType === "ACL_CONV" && <SelectItem value="Outros tipos de fonte">Outros tipos de fonte</SelectItem>}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            <FormField
                control={control}
                name="assetFields.unitMeasure"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Unidade de Medida Padrão</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {ELECTRICITY_UNITS.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}