import prisma from './prisma';
import { Prisma } from "../../generated/prisma";

export const findTypologies = async (filters: { unitId?: number; sourceType?: string }) => {
    const where: Prisma.AssetTypologyWhereInput = {};
    if (filters.unitId) where.unitId = filters.unitId;
    if (filters.sourceType) where.sourceType = filters.sourceType;

    return prisma.assetTypology.findMany({
        where,
        orderBy: { description: 'asc' }
    });
};

export const createTypology = async (data: Prisma.AssetTypologyCreateInput) => {
    return prisma.assetTypology.create({ data });
};

export const deleteTypology = async (id: number) => {
    return prisma.assetTypology.delete({
        where: { id }
    });
};

export const findOptions = async (fieldKey: string) => {
    return prisma.managedOption.findMany({
        where: { fieldKey },
        orderBy: { value: 'asc' }
    });
};

export const createOption = async (data: Prisma.ManagedOptionCreateInput) => {
    return prisma.managedOption.create({ data });
};