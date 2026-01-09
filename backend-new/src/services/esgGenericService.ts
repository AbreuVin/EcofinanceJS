import { CrudDelegate } from "../interfaces/crudDelegate";
import { ZodObject } from "zod";
import { AppJwtPayload } from "../types/auth";

export class EsgGenericService<T> {
    constructor(
        private delegate: CrudDelegate<T>,
        private schema: ZodObject<any, any>
    ) {}

    async getByUnitAndYear(unitId: number, year?: number) {
        const where: any = { unitId };
        if (year) where.year = year;
        return this.delegate.findMany({ where, orderBy: { createdAt: 'desc' } });
    }

    async create(data: any) {
        const cleanData = this.schema.parse(data);

        return this.delegate.create({
            data: cleanData
        });
    }

    async update(id: number, data: any) {
        const cleanData = this.schema.partial().parse(data); // Allow partial updates
        return this.delegate.update({
            where: { id },
            data: cleanData
        });
    }

    async delete(id: number) {
        return this.delegate.delete({
            where: { id }
        });
    }
}