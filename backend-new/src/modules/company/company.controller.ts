import { Request, Response } from 'express';
import * as companyService from './company.service';

export const list = async (req: Request, res: Response) => {
    const result = await companyService.getAll();
    res.json(result);
};

export const create = async (req: Request, res: Response) => {
    const result = await companyService.create(req.body);
    res.status(201).json(result);
};

export const update = async (req: Request, res: Response) => {
    const result = await companyService.update(req.params.id, req.body);
    res.json(result);
};

export const remove = async (req: Request, res: Response) => {
    await companyService.remove(req.params.id);
    res.status(204).send();
};