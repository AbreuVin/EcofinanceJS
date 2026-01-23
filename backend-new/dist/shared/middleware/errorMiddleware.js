"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const AppError_1 = require("../error/AppError");
const prisma_1 = require("../../../generated/prisma");
const zod_1 = require("zod");
const globalErrorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            status: 'fail',
            message: 'Validation failed',
            errors: err.issues.map(e => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
    }
    if (err instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            const target = err.meta?.target || ['field'];
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
exports.globalErrorHandler = globalErrorHandler;
