import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDataEntries, useDataEntryMutation } from "../hooks/useDataEntry";
import { MONTHS } from "@/features/assets/constants/esg-options";
import { normalizeSlugToType } from "../utils/module-mapping";
import type { AssetTypology } from "@/types/AssetTypology";
import { useParams } from "wouter";
import { useExcelImport } from "../hooks/useExcelImport";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { EvidenceManager } from "./EvidenceManager";

interface DataEntrySheetProps {
    asset: AssetTypology;
    year: number;
    unitId?: number | null | undefined;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DataEntrySheet({ asset, year, unitId, open, onOpenChange }: DataEntrySheetProps) {
    const params = useParams();
    const moduleType = normalizeSlugToType(params.module || "");

    // 1. Fetch Data
    const { data: allEntries = [], isLoading } = useDataEntries(moduleType!, unitId, year);

    // 2. Filter for THIS asset
    const existingEntries = useMemo(() => {
        if (!asset || !allEntries.length) return [];
        return allEntries.filter(e => e.sourceDescription === asset.description);
    }, [allEntries, asset?.description]);

    const { mutate, isPending } = useDataEntryMutation(moduleType!, unitId, year);

    const form = useForm({
        defaultValues: { entries: {} as Record<string, any> }
    });

    const { downloadTemplate, handleFileUpload } = useExcelImport({
        asset,
        setValue: form.setValue
    });

    // 3. Populate Form
    useEffect(() => {
        if (open && !isLoading) {
            const formData: Record<string, any> = {};

            if (existingEntries.length > 0) {
                existingEntries.forEach(entry => {
                    formData[entry.period] = {
                        consumption: entry.consumption,
                        distance: entry.distance,
                        quantity: entry.quantity,
                    };
                });
            }

            form.reset({ entries: formData });
        }
    }, [open, isLoading, existingEntries, form]);

    const onSubmit = (data: any) => {
        const assetConfig = typeof asset.assetFields === 'string'
            ? JSON.parse(asset.assetFields)
            : asset.assetFields;

        const enhancedEntries: Record<string, any> = {};

        Object.entries(data.entries).forEach(([period, values]: [string, any]) => {
            const hasValue = Object.values(values).some(v => v !== undefined && v !== "" && v !== null && v !== 0);

            if (hasValue) {
                enhancedEntries[period] = {
                    ...values,
                    fuelType: assetConfig.fuelType,
                    vehicleType: assetConfig.vehicleType,
                    isCompanyControlled: assetConfig.isCompanyControlled === 'true' || assetConfig.isCompanyControlled === true,
                    unitId: Number(asset.units?.[0]?.unitId) || unitId
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
                <SheetHeader className="px-6 py-4 border-b shrink-0">
                    <SheetTitle>{asset.description} <span className="text-muted-foreground font-normal">({year})</span></SheetTitle>
                    <SheetDescription className="sr-only">
                        Formulário para reporte de dados mensais ou anuais da fonte de emissão.
                    </SheetDescription>
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
                        {/* Formulário ocupa o espaço restante e esconde o que passa (overflow-hidden) */}
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0 overflow-hidden">

                            {/* Área rolável nativa do navegador */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {/* Bloco Visual do Excel */}
                                <div className="flex items-stretch gap-4 mb-6 p-4 rounded-lg border border-dashed bg-card/30">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={downloadTemplate}
                                        className="flex flex-col h-auto py-4 px-6 gap-2 bg-background hover:bg-muted shrink-0"
                                    >
                                        <Download className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-xs font-medium">Baixar Modelo</span>
                                    </Button>

                                    <div className="w-px bg-border my-2"></div>

                                    <label className="flex-1 flex flex-col items-center justify-center rounded-md cursor-pointer hover:bg-muted/50 transition-colors border-2 border-transparent hover:border-dashed hover:border-muted-foreground/30 text-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-full shrink-0">
                                                <FileSpreadsheet className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className="text-sm font-medium">Importar dados via Excel</span>
                                                <span className="text-xs text-muted-foreground">Arraste a planilha ou clique para selecionar</span>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".xlsx, .xls, .csv"
                                            onChange={handleFileUpload}
                                        />
                                    </label>
                                </div>

                                {/* Lista de Meses / Anual */}
                                <div className={isMensal ? "grid grid-cols-2 gap-4" : "space-y-4"}>
                                    {periods.map((period) => {
                                        const currentEntry = existingEntries.find(e => e.period === period);

                                        return (
                                            <div key={period} className="space-y-1.5 p-3 rounded-md border bg-card/50 shadow-sm">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-tight">
                                                        {period}
                                                    </div>
                                                    <EvidenceManager
                                                        sourceType={moduleType!}
                                                        entryId={currentEntry?.id}
                                                        monthName={period}
                                                    />
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
                                                                        value={field.value ?? ''}
                                                                        onChange={e => field.onChange(e.target.valueAsNumber)}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Rodapé fixo na base (shrink-0 impede que ele seja achatado) */}
                            <SheetFooter className="px-6 py-4 border-t bg-background shrink-0 mt-auto">
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