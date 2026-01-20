import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LUBRICANT_TYPES, LUBRICANT_UNITS } from "../../constants/esg-options";

export function LubricantFields() {
    const { control, setValue } = useFormContext();

    const selectedType = useWatch({ control, name: "assetFields.lubricantType" });

    useEffect(() => {
        if (selectedType === "Lubrificante") {
            setValue("assetFields.unitMeasure", "Litros");
        } else if (selectedType === "Graxa") {
            setValue("assetFields.unitMeasure", "kg");
        }
    }, [selectedType, setValue]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={control}
                name="assetFields.lubricantType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipo de Produto</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {LUBRICANT_TYPES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="assetFields.unitMeasure"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Unidade de Medida</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {LUBRICANT_UNITS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}