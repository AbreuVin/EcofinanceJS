import { useFormContext, useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LOGISTICS_MODES, REPORT_TYPES_LOGISTICS } from "../../constants/esg-options";

export function TransportFields() {
    const { control } = useFormContext();
    const sourceType = useWatch({ control, name: "sourceType" });

    const isWasteTransport = sourceType === 'waste_transport';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isWasteTransport && (
                <FormField
                    control={control}
                    name="assetFields.transportMode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Modal de Transporte Padrão</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {LOGISTICS_MODES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            <FormField
                control={control}
                name="assetFields.reportType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Forma de Reporte Padrão</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {REPORT_TYPES_LOGISTICS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}