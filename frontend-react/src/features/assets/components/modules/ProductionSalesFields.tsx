import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function ProductionSalesFields() {
    const form = useFormContext();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="assetFields.unitMeasure"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Unidade de Medida Padrão</FormLabel>
                        <FormControl><Input placeholder="Ex: Toneladas, Peças" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}