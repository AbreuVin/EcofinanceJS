import { Request, Response } from 'express';
import * as permService from './permission.service';

export const list = async (req: Request, res: Response) => {
    const permissions = await permService.getPermissions(req.params.userId as string);
    res.json({ permissions });
};

export const sync = async (req: Request, res: Response) => {
    await permService.syncPermissions(req.params.userId as string, req.body.permissions);
    res.json({ message: "Permissions updated" });
};

export const add = async (req: Request, res: Response) => {
    await permService.addPermission(req.params.userId as string, req.body.sourceType);
    res.status(201).json({ message: "Permission granted" });
};

export const remove = async (req: Request, res: Response) => {
    await permService.removePermission(req.params.userId as string, req.params.sourceType as string);
    res.status(204).send();
};