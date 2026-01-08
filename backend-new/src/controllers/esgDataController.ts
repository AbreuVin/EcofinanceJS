import { Request, Response } from 'express';
import { getServiceOrThrow } from '../utils/modelRegistry';

export const getByUnit = async (req: Request, res: Response) => {
    try {
        const { sourceType } = req.params;
        const { unitId, year } = req.query;

        if (!unitId) return res.status(400).json({ error: "unitId is required" });

        const service = getServiceOrThrow(sourceType);
        const data = await service.getByUnitAndYear(Number(unitId), year ? Number(year) : undefined);

        res.json(data);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const createEntry = async (req: Request, res: Response) => {
    try {
        const { sourceType } = req.params;
        const service = getServiceOrThrow(sourceType);

        const result = await service.create(req.body);
        res.status(201).json(result);
    } catch (err: any) {
        // Zod validation error handling
        if (err.errors) {
            return res.status(400).json({ error: "Validation failed", details: err.errors });
        }
        res.status(400).json({ error: err.message });
    }
};

export const updateEntry = async (req: Request, res: Response) => {
    try {
        const { sourceType, id } = req.params;
        const service = getServiceOrThrow(sourceType);

        const result = await service.update(Number(id), req.body);
        res.json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteEntry = async (req: Request, res: Response) => {
    try {
        const { sourceType, id } = req.params;
        const service = getServiceOrThrow(sourceType);

        await service.delete(Number(id));
        res.status(204).send();
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};