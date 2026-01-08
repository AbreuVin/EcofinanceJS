import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppJwtPayload } from "../types/auth";

declare global {
    namespace Express {
        interface Request {
            user?: AppJwtPayload; // Make optional, populated only after auth
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided or invalid format' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET!) as AppJwtPayload;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};