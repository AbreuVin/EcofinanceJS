"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = exports.syncPermissionsSchema = exports.permissionSchema = void 0;
const zod_1 = require("zod");
exports.permissionSchema = zod_1.z.object({
    sourceType: zod_1.z.string().min(1, "Source Type is required"),
});
exports.syncPermissionsSchema = zod_1.z.object({
    permissions: zod_1.z.array(zod_1.z.string().min(1)),
});
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters").optional(),
    name: zod_1.z.string().min(2, "Name is required"),
    phone: zod_1.z.string().nullable().optional(),
    role: zod_1.z.enum(['MASTER', 'ADMIN', 'USER']).default('USER'),
    unitId: zod_1.z.coerce.number().int().nullable().optional(),
    companyId: zod_1.z.string().nullable().optional(),
    parentId: zod_1.z.string().nullable().optional(),
    permissions: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateUserSchema = exports.createUserSchema.partial().omit({ email: true });
