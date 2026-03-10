import { useFormContext, useWatch } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function FertilizerFields() {
    const form = useFormContext();
    const nitrogen = useWatch({
        control: form.control,
        name: "assetFields.nitrogenPercent",
    });
    const carbonate = useWatch({
        control: form.control,
        name: "assetFields.carbonatePercent",
    });

    const nitrogenNum = parseFloat(nitrogen ?? "0");
    const carbonateNum = parseFloat(carbonate ?? "0");
    const total = nitrogenNum + carbonateNum;
    const isValid = total === 100;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="assetFields.nitrogenPercent"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Percentual de Nitrogênio Padrão (%)</FormLabel>
                        <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field}  required/></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="assetFields.carbonatePercent"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Percentual de Carbonato Padrão (%)</FormLabel>
                        <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field}  required/></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className={`col-span-1 md:col-span-2 p-3 rounded-md border ${
                isValid ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
            }`}>
                <p className={`text-sm font-semibold ${isValid ? 'text-green-700' : 'text-red-700'}`}>
                    Total: {total.toFixed(2)}%
                    {isValid ? ' ✓' : ' (deve ser exatamente 100%)'}
                </p>
            </div>

        </div>
    );
}