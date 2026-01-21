import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    MOBILE_FUELS,
    MOBILE_FUEL_UNITS_MAP,
    VEHICLE_TYPES,
    REPORT_TYPES_LOGISTICS
} from "../../constants/esg-options";

export function TransportFields() {
    const { control, setValue } = useFormContext();
    const reportType = useWatch({ control, name: "assetFields.reportType" });
    const fuelType = useWatch({ control, name: "assetFields.fuelType" });

    useEffect(() => {
        if (reportType === "Consumo" && fuelType && MOBILE_FUEL_UNITS_MAP[fuelType]) {
            setValue("assetFields.unitMeasure", MOBILE_FUEL_UNITS_MAP[fuelType]);
        }
    }, [fuelType, reportType, setValue]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Report Type */}
            <FormField
                control={control}
                name="assetFields.reportType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Forma de Reporte Padrão</FormLabel>
                        <Select onValueChange={(val) => {
                            field.onChange(val);
                            setValue("assetFields.fuelType", undefined);
                            setValue("assetFields.vehicleType", undefined);
                        }} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {REPORT_TYPES_LOGISTICS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* 2. Logic A: Consumo */}
            {reportType === "Consumo" && (
                <>
                    <FormField
                        control={control}
                        name="assetFields.fuelType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Combustível Padrão</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                    <SelectContent className="max-h-[200px]">
                                        {MOBILE_FUELS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Auto Unit */}
                    <FormField
                        control={control}
                        name="assetFields.unitMeasure"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Unidade de Consumo</FormLabel>
                                <FormControl>
                                    <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed">
                                        {field.value || "-"}
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </>
            )}

            {/* 3. Logic B: Distance */}
            {reportType === "Distância" && (
                <FormField
                    control={control}
                    name="assetFields.vehicleType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de Veículo Padrão</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                <SelectContent className="max-h-[200px]">
                                    {VEHICLE_TYPES.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
        </div>
    );
}