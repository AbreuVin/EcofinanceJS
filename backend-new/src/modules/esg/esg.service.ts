import { ZodSchema } from 'zod';

export interface PrismaDelegate<T> {
    findMany(args?: any): Promise<T[]>;
    create(args: { data: any }): Promise<T>;
    update(args: { where: any; data: any }): Promise<T>;
    delete(args: { where: any }): Promise<T>;
}

export class EsgGenericService<T> {
    constructor(
        private delegate: PrismaDelegate<T>,
        private schema: ZodSchema
    ) {}

    async getByUnitAndYear(unitId: number, year?: number) {
        const where: any = { unitId };
        if (year) where.year = year;

        return this.delegate.findMany({
            where,
            orderBy: { createdAt: 'desc' }
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