import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as authService from './auth.service';
import * as userService from '../user/user.service';
import { AppJwtPayload } from "./auth.types";

dotenv.config();

export const handleLogin = async (req: Request, res: Response) => {
    const token = await authService.login(req.body.email, req.body.password);

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AppJwtPayload;

    const user = await userService.getById(payload.id);

    res.json({ token, user });
};