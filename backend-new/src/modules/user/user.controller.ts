import { Request, Response } from 'express';
import * as userService from './user.service';

export const list = async (req: Request, res: Response) => {
    const result = await userService.getAll();
    res.json(result);
};

export const getMe = async (req: Request, res: Response) => {
    const id = (req.params.userId as string) === 'me' ? req.user!.id : (req.params.userId as string);
    const result = await userService.getById(id);
    const { password, ...safe } = result;
    res.json(safe);
};

export const create = async (req: Request, res: Response) => {
    const result = await userService.create(req.body);
    const { password, ...safe } = result;
    res.status(201).json(safe);
};

export const update = async (req: Request, res: Response) => {
    const result = await userService.update(req.params.id as string, req.body);
    const { password, ...safe } = result;
    res.json(safe);
};

export const remove = async (req: Request, res: Response) => {
    await userService.remove(req.params.id as string);
    res.status(204).send();
};