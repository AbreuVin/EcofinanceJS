"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getAll = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
const AppError_1 = require("../../shared/error/AppError");
const getAll = async () => {
    return prisma_1.default.company.findMany({ orderBy: { name: 'asc' } });
};
exports.getAll = getAll;
const create = async (data) => {
    const exists = await prisma_1.default.company.findUnique({ where: { name: data.name } });
    if (exists)
        throw new AppError_1.AppError('Company already exists', 409);
    return prisma_1.default.company.create({ data });
};
exports.create = create;
const update = async (id, data) => {
    return prisma_1.default.company.update({ where: { id }, data });
};
exports.update = update;
const remove = async (id) => {
    return prisma_1.default.company.delete({ where: { id } });
};
exports.remove = remove;
