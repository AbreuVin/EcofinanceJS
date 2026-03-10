import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GAS_TYPES } from "../../constants/esg-options";

export function FugitiveEmissionsFields() {
    const form = useFormContext();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="assetFields.gasType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Gás Padrão</FormLabel> {/* Renamed */}
                        <Select onValueChange={field.onChange} value={field.value} required>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent className="max-h-[200px]">
                                {GAS_TYPES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

        </div>
    );
}