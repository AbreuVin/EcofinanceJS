import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BUSINESS_TRAVEL_MODES, MOBILE_REPORT_TYPES, YES_NO_OPTIONS } from "../../constants/esg-options";

export function BusinessTravelFields() {
    const form = useFormContext();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="assetFields.reportType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipo de Reporte</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className="w-full"><SelectValue
                                placeholder="Selecione..."/></SelectTrigger></FormControl>
                            <SelectContent>
                                {MOBILE_REPORT_TYPES.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="assetFields.reimbursement"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Reembolso de Km (Padrão)?</FormLabel>
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

            <FormField
                control={form.control}
                name="assetFields.transportMode"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Modal Utilizado</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className="w-full"><SelectValue
                                placeholder="Selecione..."/></SelectTrigger></FormControl>
                            <SelectContent className="max-h-[200px]">
                                {BUSINESS_TRAVEL_MODES.map(opt => (
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