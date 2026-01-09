import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { createUserSchema } from "../schemas/userSchema";

export const createUser = async (req: Request, res: Response) => {
    try {
        const validatedData = createUserSchema.parse(req.body);

        const newUser = await userService.registerUser(validatedData, req.user!);

        const { password, ...safeUser } = newUser;
        res.status(201).json(safeUser);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ errors: error.errors });
        }

        res.status(400).json({ error: error.message });
    }
};

export const getLoggedUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params

        const loggedUser = await userService.fetchLoggedUser(userId);

        const { password, ...safeUser } = loggedUser;
        res.status(200).json(safeUser);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}