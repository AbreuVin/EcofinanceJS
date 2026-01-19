import { Request, Response } from 'express';
import * as configService from './config.service';

// Typologies
export const listTypologies = async (req: Request, res: Response) => {
    const { unitId, sourceType } = req.query;
    const data = await configService.getTypologies(
        unitId ? Number(unitId) : undefined,
        sourceType ? String(sourceType) : undefined
    );
    res.json(data);
};

export const createTypology = async (req: Request, res: Response) => {
    const result = await configService.createTypology(req.body);
    res.status(201).json(result);
};

export const deleteTypology = async (req: Request, res: Response) => {
    await configService.deleteTypology(Number(req.params.id));
    res.status(204).send();
};

export const updateTypology = async (req: Request, res: Response) => {
    const result = await configService.updateTypology(Number(req.params.id), req.body);
    res.status(201).json(result);
}

// Options
export const listOptions = async (req: Request, res: Response) => {
    const { fieldKey } = req.query;

    if (!fieldKey) throw new Error("fieldKey required");
    const options = await configService.getOptions(String(fieldKey));
    res.json(options);
};

export const createOption = async (req: Request, res: Response) => {
    const result = await configService.createOption(req.body);
    res.status(201).json(result);
};