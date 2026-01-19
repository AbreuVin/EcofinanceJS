import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FOREST_SPECIES } from "../../constants/esg-options";

export function PlantedForestFields() {
    const form = useFormContext();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="assetFields.areaId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Identificação da Área (Talhão)</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: Talhão A - Fazenda Norte" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="assetFields.species"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Espécie Padrão</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Selecione..."/></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {FOREST_SPECIES.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </div>
    );
}