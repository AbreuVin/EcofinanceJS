import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const handleLogin = async (req: Request, res: Response) => {
    try {
        const token = await authService.login(req.body.email, req.body.password);
        res.json({ token });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};