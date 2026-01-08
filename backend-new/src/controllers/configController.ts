import { Request, Response } from 'express';
import * as configService from '../services/configService';

// --- ASSET TYPOLOGIES ---

export const getTypologies = async (req: Request, res: Response) => {
    try {
        const { unitId, sourceType } = req.query;

        const data = await configService.getTypologies(
            unitId ? Number(unitId) : undefined,
            sourceType ? String(sourceType) : undefined
        );

        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createTypology = async (req: Request, res: Response) => {
    try {
        const result = await configService.createTypology(req.body);
        res.status(201).json(result);
    } catch (err: any) {
        // Distinguish Zod validation errors from Server errors
        if (err.errors) {
            return res.status(400).json({ error: "Validation failed", details: err.errors });
        }
        res.status(400).json({ error: err.message });
    }
};

export const deleteTypology = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

        await configService.deleteTypology(id);
        res.status(204).send();
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

// --- MANAGED OPTIONS ---

export const getOptions = async (req: Request, res: Response) => {
    try {
        const { fieldKey } = req.query;
        if (!fieldKey) return res.status(400).json({ error: "fieldKey required" });

        const options = await configService.getOptions(String(fieldKey));
        res.json(options);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createOption = async (req: Request, res: Response) => {
    try {
        const result = await configService.createOption(req.body);
        res.status(201).json(result);
    } catch (err: any) {
        if (err.errors) {
            return res.status(400).json({ error: "Validation failed", details: err.errors });
        }
        res.status(400).json({ error: err.message });
    }
};