"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
const password_utils_1 = require("../auth/password.utils");
const AppError_1 = require("../../shared/error/AppError");
const getAll = async () => {
    return prisma_1.default.user.findMany({
        select: {
            id: true, name: true, email: true, role: true, phone: true,
            unitId: true, companyId: true, createdAt: true,
            company: { select: { name: true } },
            unit: { select: { name: true } },
            permissions: { select: { sourceType: true } }
        },
        orderBy: { name: 'asc' }
    });
};
exports.getAll = getAll;
const getById = async (id) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id },
        include: {
            company: true,
            permissions: { select: { sourceType: true } }
        }
    });
    if (!user)
        throw new AppError_1.AppError('User not found', 404);
    return user;
};
exports.getById = getById;
const create = async (data) => {
    const { permissions, password, ...userData } = data;
    if (userData.unitId && !userData.companyId) {
        const unit = await prisma_1.default.unit.findUnique({ where: { id: userData.unitId } });
        if (!unit)
            throw new AppError_1.AppError('Invalid Unit ID', 400);
        userData.companyId = unit.companyId;
    }
    const hashedPassword = await (0, password_utils_1.hashPassword)(password || "123456");
    return prisma_1.default.$transaction(async (tx) => {
        return await tx.user.create({
            data: {
                ...userData,
                password: hashedPassword,
                permissions: permissions ? {
                    create: permissions.map((p) => ({ sourceType: p }))
                } : undefined
            }
        });
    });
};
exports.create = create;
const update = async (id, data) => {
    const { permissions, password, ...userData } = data;
    if (password) {
        userData.password = await (0, password_utils_1.hashPassword)(password);
    }
    const updateData = { ...userData };
    if (userData.unitId) {
        const unit = await prisma_1.default.unit.findUnique({ where: { id: userData.unitId } });
        if (unit) {
            updateData.unit = { connect: { id: unit.id } };
            updateData.company = { connect: { id: unit.companyId } };
            delete updateData.unitId;
            delete updateData.companyId;
        }
    }
    return prisma_1.default.$transaction(async (tx) => {
        const user = await tx.user.update({
            where: { id },
            data: updateData,
        });
        if (permissions) {
            await tx.userPermission.deleteMany({ where: { userId: id } });
            if (permissions.length > 0) {
                await tx.userPermission.createMany({
                    data: permissions.map((type) => ({ userId: id, sourceType: type }))
                });
            }
        }
        return user;
    });
};
exports.update = update;
const remove = async (id) => {
    return prisma_1.default.user.delete({ where: { id } });
};
exports.remove = remove;
