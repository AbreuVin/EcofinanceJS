import { z } from 'zod';

export const permissionSchema = z.object({
    sourceType: z.string().min(1, "Source Type is required"),
});

export const syncPermissionsSchema = z.object({
    permissions: z.array(z.string().min(1)),
});

export const createUserSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    name: z.string().min(2, "Name is required"),
    phone: z.string().nullable().optional(),
    role: z.enum(['MASTER', 'ADMIN', 'USER']).default('USER'),
    unitId: z.coerce.number().int().nullable().optional(),
    companyId: z.string().uuid().nullable().optional(),
    parentId: z.string().nullable().optional(),
    permissions: z.array(z.string()).optional(),
});

export const updateUserSchema = createUserSchema.partial().omit({ email: true });