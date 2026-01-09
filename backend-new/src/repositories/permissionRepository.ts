import prisma from './prisma';

export const findByUserId = async (userId: string) => {
    return prisma.userPermission.findMany({
        where: { userId },
        select: { sourceType: true } // We only need the string values
    });
};

export const addPermission = async (userId: string, sourceType: string) => {
    return prisma.userPermission.create({
        data: { userId, sourceType }
    });
};

export const removePermission = async (userId: string, sourceType: string) => {
    return prisma.userPermission.deleteMany({ // deleteMany avoids error if it doesn't exist
        where: { userId, sourceType }
    });
};

// The "Update" Logic: Atomic Transaction
export const replacePermissions = async (userId: string, sourceTypes: string[]) => {
    return prisma.$transaction(async (tx) => {
        // 1. Clear existing
        await tx.userPermission.deleteMany({
            where: { userId }
        });

        // 2. Insert new (if list is not empty)
        if (sourceTypes.length > 0) {
            await tx.userPermission.createMany({
                data: sourceTypes.map(type => ({ userId, sourceType: type }))
            });
        }

        return sourceTypes;
    });
};