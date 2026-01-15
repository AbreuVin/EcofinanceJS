import prisma from '../../../shared/database/prisma';
import { esgRegistry } from '../../esg/esg.registry';
import { AppError } from '../../../shared/error/AppError';

const validateSourceType = (sourceType: string) => {
    if (!esgRegistry[sourceType]) {
        throw new AppError(`Invalid source type: '${sourceType}'`, 400);
    }
};

export const getPermissions = async (userId: string) => {
    const perms = await prisma.userPermission.findMany({ where: { userId } });
    return perms.map(p => p.sourceType);
};

export const addPermission = async (userId: string, sourceType: string) => {
    validateSourceType(sourceType);

    try {
        await prisma.userPermission.create({ data: { userId, sourceType } });
    } catch (e: any) {
        if (e.code !== 'P2002') throw e;
    }
};

export const removePermission = async (userId: string, sourceType: string) => {
    await prisma.userPermission.deleteMany({ where: { userId, sourceType } });
};

export const syncPermissions = async (userId: string, sourceTypes: string[]) => {
    sourceTypes.forEach(validateSourceType);
    return prisma.$transaction(async (tx) => {
        await tx.userPermission.deleteMany({ where: { userId } });
        if (sourceTypes.length > 0) {
            await tx.userPermission.createMany({
                data: sourceTypes.map(sourceType => ({ userId, sourceType }))
            });
        }
    });
};