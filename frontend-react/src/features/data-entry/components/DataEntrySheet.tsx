import { useEffect, useMemo } from "react"; // + Import useMemo
import { useForm } from "react-hook-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDataEntries, useDataEntryMutation } from "../hooks/useDataEntry";
import { MONTHS } from "@/features/assets/constants/esg-options";
import { normalizeSlugToType } from "../utils/module-mapping";
import type { AssetTypology } from "@/types/AssetTypology";
import { useParams } from "wouter";
import { Loader2 } from "lucide-react";

interface DataEntrySheetProps {
    asset: AssetTypology;
    year: number;
    unitId?: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DataEntrySheet({ asset, year, unitId, open, onOpenChange }: DataEntrySheetProps) {
    const params = useParams();
    const moduleType = normalizeSlugToType(params.module || "");

    // 1. Fetch Data
    // We fetch all data for this Unit/Year/Module context
    const { data: allEntries = [], isLoading } = useDataEntries(moduleType!, unitId, year);

    // 2. Filter for THIS asset (FIXED: Wrapped in useMemo)
    // This prevents the array from being recreated on every render, stopping the useEffect loop.
    const existingEntries = useMemo(() => {
        if (!asset || !allEntries.length) return [];
        return allEntries.filter(e => e.sourceDescription === asset.description);
    }, [allEntries, asset?.description]); // Only recalculate if source data or asset changes

    const { mutate, isPending } = useDataEntryMutation(moduleType!, unitId, year);

    const form = useForm({
        defaultValues: { entries: {} as Record<string, any> }
    });

    // 3. Populate Form (Now safe because existingEntries is stable)
    useEffect(() => {
        if (open && !isLoading) {
            const formData: Record<string, any> = {};

            // If we have data, populate it. If not, the form remains empty (default).
            if (existingEntries.length > 0) {
                existingEntries.forEach(entry => {
                    formData[entry.period] = {
                        consumption: entry.consumption,
                        distance: entry.distance,
                        quantity: entry.quantity,
                        // Map other specific fields if necessary
                    };
                });
            }

            // We use reset to set the new values.
            // React Hook Form will handle the diffing, but we only want to do this when open/data changes.
            form.reset({ entries: formData });
        }
    }, [open, isLoading, existingEntries, form]);

    const onSubmit = (data: any) => {
        const assetConfig = typeof asset.assetFields === 'string'
            ? JSON.parse(asset.assetFields)
            : asset.assetFields;

        const enhancedEntries: Record<string, any> = {};

        Object.entries(data.entries).forEach(([period, values]: [string, any]) => {
            // Check if user entered any value
            const hasValue = Object.values(values).some(v => v !== undefined && v !== "" && v !== null && v !== 0);

            if (hasValue) {
                enhancedEntries[period] = {
                    ...values,
                    fuelType: assetConfig.fuelType,
                    vehicleType: assetConfig.vehicleType,
                    isCompanyControlled: assetConfig.isCompanyControlled === 'true' || assetConfig.isCompanyControlled === true,
                    unitId: Number(unitId)
                };
            }
        });

        mutate({
            assetDescription: asset.description,
            entries: enhancedEntries,
            existingRecords: existingEntries
        }, {
            onSuccess: () => onOpenChange(false)
        });
    };

    const isMensal = asset.reportingFrequency?.toLowerCase() === "mensal";
    const periods = isMensal ? MONTHS : ["Annual"];

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl w-full flex flex-col h-full p-0" side="right">
                <SheetHeader className="px-6 py-4 border-b">
                    <SheetTitle>{asset.description} <span className="text-muted-foreground font-normal">({year})</span></SheetTitle>
                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded flex items-center gap-2">
                        <span className="font-semibold uppercase tracking-wider">{isMensal ? "Mensal" : "Anual"}</span>
                        <span>•</span>
                        <span>{(asset.assetFields as any)?.unitMeasure || "Unidades"}</span>
                    </div>
                </SheetHeader>

                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="animate-spin size-8 text-primary" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
                            <ScrollArea className="flex-1 p-6">
                                <div className={isMensal ? "grid grid-cols-2 gap-4" : "space-y-4"}>
                                    {periods.map((period) => (
                                        <div key={period} className="space-y-1.5 p-3 rounded-md border bg-card/50 shadow-sm">
                                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-tight mb-1">
                                                {period}
                                            </div>
                                            <div className="space-y-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`entries.${period}.consumption`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="0.00"
                                                                    className="h-8 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                    {...field}
                                                                    value={field.value ?? ''} // Ensure controlled input
                                                                    onChange={e => field.onChange(e.target.valueAsNumber)}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            <SheetFooter className="px-6 py-4 border-t bg-background mt-auto">
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isPending} className="min-w-[120px]">
                                    {isPending ? "Salvando..." : "Salvar Alterações"}
                                </Button>
                            </SheetFooter>
                        </form>
                    </Form>
                )}
            </SheetContent>
        </Sheet>
    );
}