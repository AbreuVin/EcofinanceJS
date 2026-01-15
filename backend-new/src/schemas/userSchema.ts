import { z } from 'zod';

// Define the schema strictly
export const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2),
    role: z.enum(['MASTER', 'ADMIN', 'USER']).default('USER'),
    phone: z.string().optional().nullable(),
    companyId: z.string().uuid().nullable().optional(),
    unitId: z.number().int().nullable().optional(),
    parentId: z.string().nullable().optional(),
    permissions: z.array(z.string()).optional()
});

// Infer the DTO type from the schema (Single Source of Truth)
export type CreateUserDTO = z.infer<typeof createUserSchema>;