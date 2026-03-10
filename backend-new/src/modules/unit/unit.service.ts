import prisma from '../../shared/database/prisma';
import { AppError } from "../../shared/error/AppError";

export const getAll = async () => {
    return prisma.unit.findMany({
        include: { company: true },
        orderBy: { name: 'asc' }
    });
};

export const getPaginatedByCompany = async (companyId: string, page: number, limit: number, search?: string) => {
    // Task 3.1: Valida se a empresa existe
    const companyExists = await prisma.company.findUnique({ where: { id: companyId } });
    if (!companyExists) {
        throw new AppError('Empresa não encontrada', 404);
    }

    const skip = (page - 1) * limit;

    // Task 3.3: Constrói a query base com suporte a pesquisa por texto
    const whereClause: any = { companyId };

    if (search) {
        whereClause.name = {
            contains: search,
            mode: 'insensitive'
        };
    }

    // Task 3.2: Transação paralela para busca e contagem (Paginação)
    const [units, total] = await prisma.$transaction([
        prisma.unit.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { name: 'asc' }
        }),
        prisma.unit.count({ where: whereClause })
    ]);

    return {
        data: units,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
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