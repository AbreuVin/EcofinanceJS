import { useState } from "react";
import { Paperclip, Trash2, Upload, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { evidenceService } from "../api/evidence.service";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface EvidenceManagerProps {
    sourceType: string;
    entryId?: number;
    monthName: string;
}

export function EvidenceManager({ sourceType, entryId, monthName }: EvidenceManagerProps) {
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);

    // React Query para cache persistente — elimina flash ao reabrir
    const { data: files = [], isLoading: loading } = useQuery({
        queryKey: ['evidence', sourceType, entryId],
        queryFn: () => evidenceService.getFiles(sourceType, entryId!),
        enabled: !!entryId,
        staleTime: 30_000, // 30s cache
    });

    const invalidateFiles = () => {
        queryClient.invalidateQueries({ queryKey: ['evidence', sourceType, entryId] });
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0 || !entryId) return;

        setUploading(true);
        try {
            await evidenceService.upload(sourceType, entryId, selectedFiles);
            toast.success("Evidências enviadas com sucesso!");
            invalidateFiles();
        } catch (error) {
            toast.error("Falha no upload dos arquivos.");
        } finally {
            setUploading(false);
            e.target.value = ""; // Reset input
        }
    };

    const handleDelete = async (fileId: string) => {
        try {
            await evidenceService.delete(fileId);
            toast.success("Arquivo removido.");
            invalidateFiles();
        } catch (error) {
            toast.error("Erro ao remover arquivo.");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={!entryId}
                    className={files.length > 0 ? "text-primary" : "text-muted-foreground"}
                >
                    <Paperclip className="h-4 w-4 mr-1" />
                    {files.length > 0 ? files.length : ""}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Evidências - {monthName}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Lista de Arquivos */}
                    <div className="max-h-50 overflow-y-auto space-y-2">
                        {loading ? (
                            <div className="flex justify-center py-4"><Loader2 className="animate-spin h-6 w-6" /></div>
                        ) : files.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma evidência anexada.</p>
                        ) : (
                            files.map((file) => (
                                <div key={file.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <FileText className="h-4 w-4 shrink-0" />
                                        <span className="text-xs truncate">{file.fileName}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(file.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Upload Area */}
                    <div className="pt-4 border-t">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
                                <p className="text-xs text-muted-foreground mt-2">Clique para anexar arquivos</p>
                            </div>
                            <input type="file" className="hidden" multiple onChange={handleUpload} disabled={uploading} />
                        </label>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}