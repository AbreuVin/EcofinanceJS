import { Request, Response } from 'express';
import { getRegistryEntry } from './esg.registry';

export const list = async (req: Request, res: Response) => {
    const { sourceType } = req.params;
    const { unitId, year } = req.query;

    const parsedUnitId = unitId && unitId !== 'undefined' && unitId !== 'null' && unitId !== '0'
        ? Number(unitId)
        : undefined;

    const { service } = getRegistryEntry(sourceType as string);

    const data = await service.getByUnitAndYear(parsedUnitId, year ? Number(year) : undefined);

    res.json(data);
};

export const create = async (req: Request, res: Response) => {
    const { sourceType } = req.params;
    const { service, schema } = getRegistryEntry(sourceType as string);

    const cleanBody = await schema.parseAsync(req.body);

    const result = await service.create(cleanBody);
    res.status(201).json(result);
};

export const update = async (req: Request, res: Response) => {
    const { sourceType, id } = req.params;
    const { service, schema } = getRegistryEntry(sourceType as string);

    const cleanBody = await schema.partial().parseAsync(req.body);

    const result = await service.update(Number(id), cleanBody);
    res.json(result);
};

export const remove = async (req: Request, res: Response) => {
    const { sourceType, id } = req.params;
    const { service } = getRegistryEntry(sourceType as string);

    await service.delete(Number(id));
    res.status(204).send();
};