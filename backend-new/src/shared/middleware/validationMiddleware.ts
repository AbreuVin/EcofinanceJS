import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validate = (schema: ZodObject<any, any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            next(error);
        }
    }