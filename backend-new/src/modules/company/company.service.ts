import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/error/AppError';

export const getAll = async () => {
    return prisma.company.findMany({ orderBy: { name: 'asc' } });
};

export const getPaginatedAdmin = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [companies, total] = await prisma.$transaction([
        prisma.company.findMany({
            skip,
            take: limit,
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { units: true } } // Traz o número de unidades vinculadas
            }
        }),
        prisma.company.count()
    ]);

    return {
        data: companies,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const create = async (data: any) => {
    const exists = await prisma.company.findUnique({ where: { name: data.name } });
    if (exists) throw new AppError('Company already exists', 409);

    return prisma.company.create({ data });
};

export const update = async (id: string, data: any) => {
    return prisma.company.update({ where: { id }, data });
};

export const remove = async (id: string) => {
    return prisma.company.delete({ where: { id } });
};