import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { AssetFormValues } from "../schemas/asset.schema";

interface AssetTraceabilityProps {
    form: UseFormReturn<AssetFormValues>;
}

export function AssetTraceability({ form }: AssetTraceabilityProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-muted/30 rounded-lg border">
            <button
                type="button"
                onClick={() => setExpanded(prev => !prev)}
                className="w-full flex items-center justify-between p-5 text-left"
            >
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Rastreabilidade Interna <span className="font-normal normal-case">(opcional)</span>
                </h4>
                {expanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
            </button>

            {expanded && (
                <div className="px-5 pb-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="traceabilityResponsible"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Responsável pela Informação</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome do responsável" {...field} value={field.value ?? ""} />
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
                                        <Input type="email" placeholder="email@exemplo.com" {...field} value={field.value ?? ""} />
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
                                        <Input placeholder="Ex: Financeiro, Operações" {...field} value={field.value ?? ""} />
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
                                        <Input placeholder="Ex: Pasta X, Sistema Y" {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
