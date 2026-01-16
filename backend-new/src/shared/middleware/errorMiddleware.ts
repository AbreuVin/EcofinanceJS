import { Request, Response, NextFunction } from "express";
import { AppError } from "../error/AppError";

import { Prisma } from "../../../generated/prisma"
import { ZodError } from "zod";


export const globalErrorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            status: 'fail',
            message: 'Validation failed',
            errors: err.issues.map(e => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            const target = (err.meta?.target as string[]) || ['field'];
            return res.status(409).json({
                status: 'fail',
                message: `Unique constraint violation on: ${target.join(', ')}`
            });
        }
        // P2025: Record not found
        if (err.code === 'P2025') {
            return res.status(404).json({
                status: 'fail',
                message: 'Record not found'
            });
        }
    }

    console.error('Unexpected Error:', err);
    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
};