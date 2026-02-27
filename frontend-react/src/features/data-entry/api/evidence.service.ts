import api from "@/api/api";

export interface Attachment {
    id: string;
    fileName: string;
    storagePath: string;
    mimeType: string;
    size: number;
    createdAt: string;
}

export const evidenceService = {
    // Faz o upload de arquivos para uma entrada específica
    upload: async (sourceType: string, id: number, files: File[]): Promise<Attachment[]> => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        const { data } = await api.post<Attachment[]>(
            `/managers/esg/evidence/${sourceType}/${id}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return data;
    },

    // Busca os arquivos vinculados a um grupo de evidência (precisaremos de uma rota GET para isso)
    // Se ainda não criou a rota GET, recomendo adicionar no backend depois
    getFiles: async (sourceType: string, id: number): Promise<Attachment[]> => {
        const { data } = await api.get<Attachment[]>(`/managers/esg/evidence/${sourceType}/${id}`);
        return data;
    },

    delete: async (attachmentId: string) => {
        await api.delete(`/managers/esg/evidence/attachment/${attachmentId}`);
    }
};