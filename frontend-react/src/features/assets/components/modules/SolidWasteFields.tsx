import { useFormContext, useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { WASTE_TYPES, WASTE_DESTINATIONS, WEIGHT_UNITS, YES_NO_OPTIONS } from "../../constants/esg-options";

export function SolidWasteFields() {
    const { control } = useFormContext();

    // Watch destination to conditionally show City/UF
    const destination = useWatch({ control, name: "assetFields.wasteDestination" });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={control}
                name="assetFields.wasteType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipo de Resíduo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent className="max-h-[200px]">
                                {WASTE_TYPES.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="assetFields.wasteDestination"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Destinação Final</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {WASTE_DESTINATIONS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Condicional: Apenas se Aterro */}
            {destination === 'Aterro' && (
                <FormField
                    control={control}
                    name="assetFields.destinationLocation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cidade/UF de destino</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Porto Alegre/RS" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            <FormField
                control={control}
                name="assetFields.unitMeasure"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Unidade de Peso</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {WEIGHT_UNITS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Novo Campo: Controlado pela Empresa */}
            <FormField
                control={control}
                name="assetFields.isCompanyControlled"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Controlado pela Empresa?</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {YES_NO_OPTIONS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}