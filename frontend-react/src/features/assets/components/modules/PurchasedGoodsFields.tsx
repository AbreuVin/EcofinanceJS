import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PURCHASE_TYPES, YES_NO_OPTIONS, PURCHASE_UNITS} from "../../constants/esg-options";

export function PurchasedGoodsFields() {
    const { control, setValue, getValues } = useFormContext();
    const itemType = useWatch({ control, name: "assetFields.itemType" });

    useEffect(() => {
        if (!getValues("assetFields.itemType")) {
            setValue("assetFields.itemType", "Serviço");
        }
    }, [setValue, getValues]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={control}
                name="assetFields.itemType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipo (Produto ou Serviço) Padrão</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || "Serviço"}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{PURCHASE_TYPES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {itemType === "Produto" && (
                <FormField
                    control={control}
                    name="assetFields.unitMeasure"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Unidade de Medida Padrão</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                <SelectContent>{PURCHASE_UNITS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            <FormField
                control={control}
                name="assetFields.isPurchasedByThirdParty"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bens comprados por terceiros?</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>{YES_NO_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}