import prisma from '../../shared/database/prisma';

// Typologies
export const getTypologies = async (unitId?: number, sourceType?: string) => {
    const where: any = {};
    if (unitId) where.unitId = unitId;
    if (sourceType) where.sourceType = sourceType;
    return prisma.assetTypology.findMany({
        where,
        orderBy: { description: 'asc' },
        include: { unit: true, userContact: true },
    });
};

export const createTypology = async (data: any) => {
    return prisma.assetTypology.create({ data });
};

export const deleteTypology = async (id: number) => {
    return prisma.assetTypology.delete({ where: { id } });
};

export const updateTypology = async (id: number, data: any) => {
    return prisma.assetTypology.update({ where: { id }, data });
}

// Options
export const getOptions = async (fieldKey: string) => {
    return prisma.managedOption.findMany({ where: { fieldKey }, orderBy: { value: 'asc' } });
};

export const createOption = async (data: any) => {
    return prisma.managedOption.create({ data });
};