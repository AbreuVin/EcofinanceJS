import { ZodSchema } from 'zod';

export interface PrismaDelegate<T> {
    findMany(args?: any): Promise<T[]>;
    findUnique(args?: any): Promise<T | null>;
    count(args?: any): Promise<number>;
    create(args: { data: any }): Promise<T>;
    update(args: { where: any; data: any }): Promise<T>;
    delete(args: { where: any }): Promise<T>;
}

export class EsgGenericService<T> {
    constructor(
        private delegate: PrismaDelegate<T>,
        private schema: ZodSchema
    ) { }

    async getByUnitAndYear(unitId?: number, year?: number) {
        const where: any = {};

        if (unitId) {
            where.unitId = unitId;
        }

        if (year) {
            where.year = year;
        }

        return this.delegate.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { unit: true }
        });
    }

    async getPaginatedAdminByUnit(unitId: number, page: number, limit: number) {
        const skip = (page - 1) * limit;
        const where = { unitId };

        const [data, total] = await Promise.all([
            this.delegate.findMany({
                where,
                skip,
                take: limit,
                orderBy: { year: 'desc' } // Ordena pelo ano de reporte
            }),
            this.delegate.count({ where })
        ]);

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
        };
    }

    async getAllByCompany(companyId: string) {
        return this.delegate.findMany({
            where: { unit: { companyId } },
            orderBy: { year: 'desc' },
            include: { unit: { select: { id: true, name: true } } }
        });
    }

    async getById(id: number) {
        return this.delegate.findUnique({
            where: { id }
        });
    }

    async create(data: any) {
        const cleanData = await this.schema.parseAsync(data);
        return this.delegate.create({ data: cleanData });
    }

    async update(id: number, data: any) {
        const cleanData = await (this.schema as any).partial().parseAsync(data);
        return this.delegate.update({
            where: { id },
            data: cleanData
        });
    }

    async delete(id: number) {
        return this.delegate.delete({ where: { id } });
    }
}