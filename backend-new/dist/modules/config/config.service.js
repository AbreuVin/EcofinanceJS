"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOption = exports.getOptions = exports.updateTypology = exports.deleteTypology = exports.createTypology = exports.getTypologies = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
// Typologies
const getTypologies = async (unitId, sourceType) => {
    const where = {};
    if (unitId)
        where.unitId = unitId;
    if (sourceType)
        where.sourceType = sourceType;
    return prisma_1.default.assetTypology.findMany({
        where,
        orderBy: { description: 'asc' },
        include: { unit: true, userContact: true },
    });
};
exports.getTypologies = getTypologies;
const createTypology = async (data) => {
    return prisma_1.default.assetTypology.create({ data });
};
exports.createTypology = createTypology;
const deleteTypology = async (id) => {
    return prisma_1.default.assetTypology.delete({ where: { id } });
};
exports.deleteTypology = deleteTypology;
const updateTypology = async (id, data) => {
    return prisma_1.default.assetTypology.update({ where: { id }, data });
};
exports.updateTypology = updateTypology;
// Options
const getOptions = async (fieldKey) => {
    return prisma_1.default.managedOption.findMany({ where: { fieldKey }, orderBy: { value: 'asc' } });
};
exports.getOptions = getOptions;
const createOption = async (data) => {
    return prisma_1.default.managedOption.create({ data });
};
exports.createOption = createOption;
