import { useFormContext, useWatch } from "react-hook-form"; // Added useWatch
import { useEffect } from "react"; // Added useEffect
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATIONARY_FUELS, STATIONARY_UNITS, YES_NO_OPTIONS, FUEL_UNIT_MAP } from "../../constants/esg-options";

export function StationaryCombustionFields() {
    const { control, setValue } = useFormContext();

    // Watch fuel selection
    const selectedFuel = useWatch({ control, name: "assetFields.fuelType" });

    // Logic: Auto-populate unit when fuel changes
    useEffect(() => {
        if (selectedFuel && FUEL_UNIT_MAP[selectedFuel]) {
            setValue("assetFields.unitMeasure", FUEL_UNIT_MAP[selectedFuel]);
        }
    }, [selectedFuel, setValue]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={control}
                name="assetFields.fuelType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Combustível Padrão</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent className="max-h-[200px]">
                                {STATIONARY_FUELS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
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
                        <FormLabel>Unidade de Consumo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {STATIONARY_UNITS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* NEW FIELD: Controlado pela empresa */}
            <FormField
                control={control}
                name="assetFields.isCompanyControlled"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Controlado pela Empresa?</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {YES_NO_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}