import { useFormContext, useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    LAND_USE_PREVIOUS_TYPES,
    BIOMES,
    BIOME_PHYTOPHYSIOGNOMIES,
    LAND_VEGETATION_TYPES
} from "../../constants/esg-options";

export function LandUseFields() {
    const { control } = useFormContext();
    const previousUse = useWatch({ control, name: "assetFields.previousLandUse" });
    const selectedBiome = useWatch({ control, name: "assetFields.biome" });

    const isVegetation = previousUse === "Vegetação Natural";
    const phytophysiognomies = selectedBiome ? BIOME_PHYTOPHYSIOGNOMIES[selectedBiome] || [] : [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={control}
                name="assetFields.previousLandUse"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Uso do Solo Anterior (Padrão)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {LAND_USE_PREVIOUS_TYPES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {isVegetation && (
                <>
                    <FormField
                        control={control}
                        name="assetFields.biome"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bioma Padrão</FormLabel>
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
                                <FormLabel>Fitofisionomia Padrão</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedBiome}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                    <SelectContent>{phytophysiognomies.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="assetFields.vegetationType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Área Padrão</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                    <SelectContent>{LAND_VEGETATION_TYPES.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
            )}
        </div>
    );
}