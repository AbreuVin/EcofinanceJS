import { Request, Response } from 'express';
import * as adminService from '../services/adminService';

// Generic error handler
export const handle = (fn: Function) => async (req: Request, res: Response) => {
    try {
        console.log(`Handling ${req.method} ${req.originalUrl}`);
        console.log('Request Body:', req.body);
        const result = await fn(req);
        res.json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const getCompanies = handle(() => adminService.getCompanies());
export const createCompany = handle((req: Request) => adminService.createCompany(req.body));
export const updateCompany = handle((req: Request) => adminService.updateCompany(req.params.id, req.body));
export const deleteCompany = handle((req: Request) => adminService.deleteCompany(req.params.id));

export const getUnits = handle(() => adminService.getUnits());
export const createUnit = handle((req: Request) => adminService.createUnit(req.body));
export const updateUnit = handle((req: Request) => adminService.updateUnit(Number(req.params.id), req.body));
export const deleteUnit = handle((req: Request) => adminService.deleteUnit(Number(req.params.id)));