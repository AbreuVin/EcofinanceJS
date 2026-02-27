import { getSupabase } from '../../../shared/bucket';
import prisma from '../../../shared/database/prisma';
import { getRegistryEntry } from '../esg.registry';
import { v4 as uuidv4 } from 'uuid';

export class EvidenceService {
    private static BUCKET_NAME = 'evidences';

    /**
     * Busca todos os arquivos vinculados a um registro ESG específico.
     */
    static async getFiles(sourceType: string, id: number) {
        const { modelName } = getRegistryEntry(sourceType);
        const prismaModel = (prisma as any)[modelName];

        const entry = await prismaModel.findUnique({
            where: { id },
            select: { evidenceGroupId: true }
        });

        if (!entry || !entry.evidenceGroupId) return [];

        const attachments = await prisma.attachment.findMany({
            where: { evidenceGroupId: entry.evidenceGroupId },
            orderBy: { createdAt: 'desc' }
        });

        return attachments;
    }

    /**
     * Remove um arquivo do Storage e do banco de dados.
     */
    static async deleteFile(attachmentId: string) {
        const supabase = getSupabase();

        const attachment = await prisma.attachment.findUnique({
            where: { id: attachmentId }
        });

        if (!attachment) throw new Error('Arquivo não encontrado.');

        // Remove do Supabase Storage
        const { error } = await supabase.storage
            .from(this.BUCKET_NAME)
            .remove([attachment.storagePath]);

        if (error) {
            console.error('Erro ao remover do storage:', error);
        }

        // Remove do banco
        await prisma.attachment.delete({
            where: { id: attachmentId }
        });

        return { success: true };
    }

    /**
     * Faz upload de arquivos e vincula a um registro ESG.
     */
    static async uploadAndAttach(
        sourceType: string,
        id: number,
        files: Express.Multer.File[]
    ) {
        const supabase = getSupabase();
        // Pega a configuração centralizada
        const { modelName } = getRegistryEntry(sourceType);
        const prismaModel = (prisma as any)[modelName];

        const entry = await prismaModel.findUnique({
            where: { id },
            select: { evidenceGroupId: true }
        });

        if (!entry) throw new Error(`Registro de ${sourceType} com ID ${id} não encontrado.`);

        let groupId = entry.evidenceGroupId;

        if (!groupId) {
            const newGroup = await prisma.evidenceGroup.create({ data: {} });
            groupId = newGroup.id;

            await prismaModel.update({
                where: { id },
                data: { evidenceGroupId: groupId }
            });
        }

        return await Promise.all(
            files.map(async (file) => {
                const fileExt = file.originalname.split('.').pop();
                const storagePath = `${sourceType}/${id}/${uuidv4()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from(this.BUCKET_NAME)
                    .upload(storagePath, file.buffer, {
                        contentType: file.mimetype,
                        upsert: true
                    });

                if (uploadError) throw uploadError;

                try {
                    return await prisma.attachment.create({
                        data: {
                            fileName: file.originalname,
                            storagePath: storagePath,
                            mimeType: file.mimetype,
                            size: file.size,
                            evidenceGroupId: groupId as string
                        }
                    });
                } catch (dbError) {
                    // Limpeza em caso de erro no banco
                    await supabase.storage.from(this.BUCKET_NAME).remove([storagePath]);
                    throw dbError;
                }
            })
        );
    }
}