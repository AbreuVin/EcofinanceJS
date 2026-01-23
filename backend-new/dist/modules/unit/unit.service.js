"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getAll = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
const getAll = async () => {
    return prisma_1.default.unit.findMany({
        include: { company: true },
        orderBy: { name: 'asc' }
    });
};
exports.getAll = getAll;
const create = async (data) => {
    const { companyId, ...rest } = data;
    return prisma_1.default.unit.create({
        data: {
            ...rest,
            company: { connect: { id: companyId } }
        }
    });
};
exports.create = create;
const update = async (id, data) => {
    return prisma_1.default.unit.update({ where: { id }, data });
};
exports.update = update;
const remove = async (id) => {
    return prisma_1.default.unit.delete({ where: { id } });
};
exports.remove = remove;
