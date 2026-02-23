import prisma from '../../shared/database/prisma';

// Typologies
export const getTypologies = async (unitId?: number, sourceType?: string) => {
    const where: any = {};
    if (unitId) where.units = { some: { unitId } };
    if (sourceType) where.sourceType = sourceType;
    return prisma.assetTypology.findMany({
        where,
        orderBy: { description: 'asc' },
        include: { units: { include: { unit: true } }, userContact: true },
    });
};

export const createTypology = async (data: any) => {
    const { unitIds = [], ...rest } = data;
    return prisma.assetTypology.create({
        data: {
            ...rest,
            units: {
                create: unitIds.map((unitId: number) => ({ unitId })),
            },
        },
        include: { units: { include: { unit: true } }, userContact: true },
    });
};

export const deleteTypology = async (id: number) => {
    return prisma.assetTypology.delete({ where: { id } });
};

export const updateTypology = async (id: number, data: any) => {
    const { unitIds, ...rest } = data;
    return prisma.$transaction(async (tx) => {
        if (unitIds !== undefined) {
            await tx.assetTypologyUnit.deleteMany({ where: { assetTypologyId: id } });
            if (unitIds.length > 0) {
                await tx.assetTypologyUnit.createMany({
                    data: unitIds.map((unitId: number) => ({ assetTypologyId: id, unitId })),
                });
            }
        }
        return tx.assetTypology.update({
            where: { id },
            data: rest,
            include: { units: { include: { unit: true } }, userContact: true },
        });
    });
}

// Options
export const getOptions = async (fieldKey: string) => {
    return prisma.managedOption.findMany({ where: { fieldKey }, orderBy: { value: 'asc' } });
};

export const createOption = async (data: any) => {
    return prisma.managedOption.create({ data });
};