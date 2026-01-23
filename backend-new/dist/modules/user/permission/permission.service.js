"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncPermissions = exports.removePermission = exports.addPermission = exports.getPermissions = void 0;
const prisma_1 = __importDefault(require("../../../shared/database/prisma"));
const esg_registry_1 = require("../../esg/esg.registry");
const AppError_1 = require("../../../shared/error/AppError");
const validateSourceType = (sourceType) => {
    if (!esg_registry_1.esgRegistry[sourceType]) {
        throw new AppError_1.AppError(`Invalid source type: '${sourceType}'`, 400);
    }
};
const getPermissions = async (userId) => {
    const perms = await prisma_1.default.userPermission.findMany({ where: { userId } });
    return perms.map(p => p.sourceType);
};
exports.getPermissions = getPermissions;
const addPermission = async (userId, sourceType) => {
    validateSourceType(sourceType);
    try {
        await prisma_1.default.userPermission.create({ data: { userId, sourceType } });
    }
    catch (e) {
        if (e.code !== 'P2002')
            throw e;
    }
};
exports.addPermission = addPermission;
const removePermission = async (userId, sourceType) => {
    await prisma_1.default.userPermission.deleteMany({ where: { userId, sourceType } });
};
exports.removePermission = removePermission;
const syncPermissions = async (userId, sourceTypes) => {
    sourceTypes.forEach(validateSourceType);
    return prisma_1.default.$transaction(async (tx) => {
        await tx.userPermission.deleteMany({ where: { userId } });
        if (sourceTypes.length > 0) {
            await tx.userPermission.createMany({
                data: sourceTypes.map(sourceType => ({ userId, sourceType }))
            });
        }
    });
};
exports.syncPermissions = syncPermissions;
