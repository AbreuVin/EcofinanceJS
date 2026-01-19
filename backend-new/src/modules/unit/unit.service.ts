import prisma from '../../shared/database/prisma';

export const getAll = async () => {
    return prisma.unit.findMany({
        include: { company: true },
        orderBy: { name: 'asc' }
    });
};

export const create = async (data: any) => {
    const { companyId, ...rest } = data;
    return prisma.unit.create({
        data: {
            ...rest,
            company: { connect: { id: companyId } }
        }
    });
};

export const update = async (id: number, data: any) => {
    return prisma.unit.update({ where: { id }, data });
};

export const remove = async (id: number) => {
    return prisma.unit.delete({ where: { id } });
};