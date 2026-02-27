import { Request, Response } from 'express';
import { EvidenceService } from './evidence.service';

export const getFiles = async (req: Request, res: Response) => {
    try {
        const { sourceType, id } = req.params;
        const attachments = await EvidenceService.getFiles(sourceType, Number(id));
        res.json(attachments);
    } catch (error: any) {
        console.error('Get Files Error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteFile = async (req: Request, res: Response) => {
    try {
        const { attachmentId } = req.params;
        const result = await EvidenceService.deleteFile(attachmentId);
        res.json(result);
    } catch (error: any) {
        console.error('Delete File Error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const upload = async (req: Request, res: Response) => {
    try {
        const { sourceType, id } = req.params;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        }

        const attachments = await EvidenceService.uploadAndAttach(
            sourceType,
            Number(id),
            files
        );

        res.status(201).json(attachments);
    } catch (error: any) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: error.message });
    }
};