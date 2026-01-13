import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as authService from '../services/authService';
import * as userService from '../services/userService';
import { AppJwtPayload } from "../types/auth";

dotenv.config();

export const handleLogin = async (req: Request, res: Response) => {
    try {
        const token = await authService.login(req.body.email, req.body.password);
        const { id } = jwt.verify(token, process.env.JWT_SECRET!) as AppJwtPayload;

        const user = await userService.fetchLoggedUser(id);

        res.json({ token, user });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};