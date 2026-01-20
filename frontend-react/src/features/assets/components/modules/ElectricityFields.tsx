import { useFormContext, useWatch } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ELECTRICITY_UNITS, ENERGY_SOURCES, SPECIFIC_ENERGY_SOURCES } from "../../constants/esg-options";

export function ElectricityFields() {
    const { control } = useFormContext();
    const energySource = useWatch({ control, name: "assetFields.energySource" });
    const showSpecification = energySource && energySource !== "Sistema Interligado Nacional";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={control}
                name="assetFields.energySource"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fonte de Energia</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue
                                placeholder="Selecione..."/></SelectTrigger></FormControl>
                            <SelectContent>
                                {ENERGY_SOURCES.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            {showSpecification && (
                <FormField
                    control={control}
                    name="assetFields.specificSource"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Especificação da Fonte</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue
                                    placeholder="Selecione..."/></SelectTrigger></FormControl>
                                <SelectContent>
                                    {SPECIFIC_ENERGY_SOURCES.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            )}

            <FormField
                control={control}
                name="assetFields.unitMeasure"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Unidade de Medida</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue
                                placeholder="Selecione..."/></SelectTrigger></FormControl>
                            <SelectContent>
                                {ELECTRICITY_UNITS.map(opt => (
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