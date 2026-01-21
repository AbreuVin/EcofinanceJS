import { useFormContext, useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BIOMES, BIOME_PHYTOPHYSIOGNOMIES, YES_NO_OPTIONS } from "../../constants/esg-options";

export function ConservationAreaFields() {
    const { control } = useFormContext();
    const selectedBiome = useWatch({ control, name: "assetFields.biome" });
    // Watch the Boolean field (stored as string 'true'/'false' or boolean in form state)
    const isPlanted = useWatch({ control, name: "assetFields.isPlanted" });

    const phytophysiognomies = selectedBiome ? BIOME_PHYTOPHYSIOGNOMIES[selectedBiome] || [] : [];

    // Check if "Sim" (assuming YES_NO_OPTIONS returns boolean or string "true")
    const showPlantio = isPlanted === "true" || isPlanted === true;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Biome & Phyto (Existing) */}
            <FormField
                control={control}
                name="assetFields.biome"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bioma</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>{BIOMES.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
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
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione o bioma..." /></SelectTrigger></FormControl>
                            <SelectContent>{phytophysiognomies.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
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
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>{YES_NO_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* NEW: Plantio Field */}
            {showPlantio && (
                <FormField
                    control={control}
                    name="assetFields.plantingDetails"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Plantio (Detalhes)</FormLabel>
                            <FormControl><Input placeholder="Descreva o plantio..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
        </div>
    );
}