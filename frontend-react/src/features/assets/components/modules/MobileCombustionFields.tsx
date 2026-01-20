import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { MOBILE_REPORT_TYPES, YES_NO_OPTIONS } from "../../constants/esg-options";

export function MobileCombustionFields() {
    const form = useFormContext();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="assetFields.reportType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Como os dados serão reportados?</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue
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
                name="assetFields.isCompanyControlled"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Controlado pela Empresa?</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue
                                placeholder="Selecione..."/></SelectTrigger></FormControl>
                            <SelectContent>
                                {YES_NO_OPTIONS.map(opt => (
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