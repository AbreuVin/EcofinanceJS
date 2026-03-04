import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { AssetFormValues } from "../schemas/asset.schema";

interface AssetTraceabilityProps {
    form: UseFormReturn<AssetFormValues>;
}

export function AssetTraceability({ form }: AssetTraceabilityProps) {
    return (
        <div className="bg-muted/30 p-5 rounded-lg border">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                Rastreabilidade Interna
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="traceabilityResponsible"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Responsável pela Informação</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome do responsável" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="traceabilityEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="email@exemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="traceabilitySector"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Setor</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Financeiro, Operações" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="traceabilityLocation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Localização da Informação</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Pasta X, Sistema Y" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}