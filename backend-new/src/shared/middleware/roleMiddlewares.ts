import { Request, Response, NextFunction } from 'express';

export const requireMaster = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'MASTER') {
        return res.status(403).json({ message: 'Forbidden: Acesso restrito a administradores MASTER.' });
    }
    next();
};