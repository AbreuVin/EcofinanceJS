import { Request, Response } from 'express';
import * as unitService from './unit.service';

export const list = async (req: Request, res: Response) => {
    const result = await unitService.getAll();
    res.json(result);
};

export const create = async (req: Request, res: Response) => {
    const result = await unitService.create(req.body);
    res.status(201).json(result);
};

export const update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await unitService.update(id, req.body);
    res.json(result);
};

export const remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await unitService.remove(id);
    res.status(204).send();
};