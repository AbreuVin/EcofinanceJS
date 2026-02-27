import { useState, useCallback } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Trash2, FileUp } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { AssetFormValues } from "../schemas/asset.schema";

interface AssetTraceabilityProps {
    form: UseFormReturn<AssetFormValues>;
}

export function AssetTraceability({ form }: AssetTraceabilityProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = useCallback((files: FileList | File[]) => {
        const newFiles = Array.from(files);
        setSelectedFiles(prev => [...prev, ...newFiles]);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const removeFile = useCallback((index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }, []);

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

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

            {/* Área de Upload de Documentos */}
            <div className="mt-5">
                <FormLabel className="text-sm font-medium mb-2 block">Documentos Comprobatórios</FormLabel>

                {/* Dropzone */}
                <label
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
                        flex flex-col items-center justify-center w-full min-h-[120px] 
                        border-2 border-dashed rounded-lg cursor-pointer 
                        transition-colors duration-200
                        ${isDragging
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                        }
                    `}
                >
                    <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                        <div className={`rounded-full p-3 mb-3 ${isDragging ? "bg-primary/10" : "bg-muted"}`}>
                            <FileUp className={`h-6 w-6 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                            {isDragging ? "Solte os arquivos aqui" : "Arraste arquivos ou clique para selecionar"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            PDF, imagens, planilhas ou documentos (máx. 10MB cada)
                        </p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv,.doc,.docx"
                        onChange={(e) => {
                            if (e.target.files) handleFiles(e.target.files);
                            e.target.value = "";
                        }}
                    />
                </label>

                {/* Lista de Arquivos Selecionados */}
                {selectedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                            {selectedFiles.length} arquivo(s) selecionado(s)
                        </p>
                        {selectedFiles.map((file, index) => (
                            <div
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between p-2.5 bg-background rounded-md border shadow-sm"
                            >
                                <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                                    <div className="rounded-md bg-muted p-1.5 shrink-0">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="overflow-hidden min-w-0">
                                        <p className="text-sm truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
                                    onClick={() => removeFile(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}