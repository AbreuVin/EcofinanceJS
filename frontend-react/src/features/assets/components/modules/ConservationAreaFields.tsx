import { useFormContext, useWatch } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BIOME_PHYTOPHYSIOGNOMIES, BIOMES, YES_NO_OPTIONS } from "../../constants/esg-options";

export function ConservationAreaFields() {
    const { control } = useFormContext();
    const selectedBiome = useWatch({ control, name: "assetFields.biome" });

    // Get options specific to the selected biome
    const phytophysiognomies = selectedBiome ? BIOME_PHYTOPHYSIOGNOMIES[selectedBiome] || [] : [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={control}
                name="assetFields.biome"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bioma</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue
                                placeholder="Selecione..."/></SelectTrigger></FormControl>
                            <SelectContent>{BIOMES.map(o => <SelectItem key={o.value}
                                                                        value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="assetFields.phytophysiognomy"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fitofisionomia</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedBiome}>
                            <FormControl><SelectTrigger><SelectValue
                                placeholder="Selecione o bioma primeiro"/></SelectTrigger></FormControl>
                            <SelectContent>
                                {phytophysiognomies.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="assetFields.isPlanted"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Área de conservação plantada?</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue
                                placeholder="Selecione..."/></SelectTrigger></FormControl>
                            <SelectContent>{YES_NO_OPTIONS.map(o => <SelectItem key={o.value}
                                                                                value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </div>
    );
}