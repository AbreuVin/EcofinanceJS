import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LAND_USE_PREVIOUS_TYPES } from "../../constants/esg-options";

export function LandUseFields() {
    const form = useFormContext();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="assetFields.previousLandUse"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Uso Anterior do Solo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue
                                placeholder="Selecione..."/></SelectTrigger></FormControl>
                            <SelectContent>
                                {LAND_USE_PREVIOUS_TYPES.map(opt => <SelectItem key={opt.value}
                                                                                value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </div>
    );
}