import * as permissionRepo from '../repositories/permissionRepository';
import { esgRegistry } from '../utils/modelRegistry';

const validateSourceType = (sourceType: string) => {
    if (!esgRegistry[sourceType]) {
        throw new Error(`Invalid source type: '${sourceType}'. Must be one of: ${Object.keys(esgRegistry).join(', ')}`);
    }
};

export const getUserPermissions = async (userId: string) => {
    const perms = await permissionRepo.findByUserId(userId);
    return perms.map(p => p.sourceType); // Return simple array of strings
};

export const grantPermission = async (userId: string, sourceType: string) => {
    validateSourceType(sourceType);

    try {
        return await permissionRepo.addPermission(userId, sourceType);
    } catch (err: any) {
        if (err.code === 'P2002') return;
        throw err;
    }
};

export const revokePermission = async (userId: string, sourceType: string) => {
    return permissionRepo.removePermission(userId, sourceType);
};

export const syncPermissions = async (userId: string, sourceTypes: string[]) => {
    sourceTypes.forEach(validateSourceType);

    const uniqueTypes = [...new Set(sourceTypes)];

    return permissionRepo.replacePermissions(userId, uniqueTypes);
};