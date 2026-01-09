import { Request, Response } from 'express';
import * as permissionService from '../services/permissionService';
import { z } from 'zod';

// Zod Schema for validation
const permissionListSchema = z.object({
    permissions: z.array(z.string().min(1))
});

const singlePermissionSchema = z.object({
    sourceType: z.string().min(1)
});

export const getPermissions = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const permissions = await permissionService.getUserPermissions(userId);
        res.json({ permissions });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const syncPermissions = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        // Validate Input
        const { permissions } = permissionListSchema.parse(req.body);

        // Execute Sync
        await permissionService.syncPermissions(userId, permissions);

        res.json({ message: "Permissions updated successfully", count: permissions.length });
    } catch (err: any) {
        if (err.errors) return res.status(400).json({ error: "Validation failed", details: err.errors });
        res.status(400).json({ error: err.message });
    }
};

export const addPermission = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { sourceType } = singlePermissionSchema.parse(req.body);

        await permissionService.grantPermission(userId, sourceType);
        res.status(201).json({ message: "Permission granted" });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const removePermission = async (req: Request, res: Response) => {
    try {
        const { userId, sourceType } = req.params;
        await permissionService.revokePermission(userId, sourceType);
        res.status(204).send();
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};