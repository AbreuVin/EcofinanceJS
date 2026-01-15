import { z } from 'zod';

// Define the schema strictly
export const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().optional(),
    name: z.string().min(2),
    phone: z.string().optional().nullable(),
    role: z.enum(['MASTER', 'ADMIN', 'USER']).default('USER'),

    // FIX 1: Remove .uuid() to allow 'comp-001' from seed data
    companyId: z.string().min(1).nullable().optional(),

    // FIX 2: Use z.coerce.number() to handle "1" (string) -> 1 (number) conversion
    unitId: z.coerce.number().int().nullable().optional(),

    parentId: z.string().nullable().optional(),
    permissions: z.array(z.string()).optional()
});

// Infer the DTO type from the schema (Single Source of Truth)
export type CreateUserDTO = z.infer<typeof createUserSchema>;