"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EsgGenericService = void 0;
class EsgGenericService {
    constructor(delegate, schema) {
        this.delegate = delegate;
        this.schema = schema;
    }
    async getByUnitAndYear(unitId, year) {
        const where = { unitId };
        if (year)
            where.year = year;
        return this.delegate.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
    }
    async create(data) {
        const cleanData = await this.schema.parseAsync(data);
        return this.delegate.create({ data: cleanData });
    }
    async update(id, data) {
        const cleanData = await this.schema.partial().parseAsync(data);
        return this.delegate.update({
            where: { id },
            data: cleanData
        });
    }
    async delete(id) {
        return this.delegate.delete({ where: { id } });
    }
}
exports.EsgGenericService = EsgGenericService;
