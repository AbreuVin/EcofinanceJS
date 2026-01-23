"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.list = void 0;
const esg_registry_1 = require("./esg.registry");
const list = async (req, res) => {
    const { sourceType } = req.params;
    const { unitId, year } = req.query;
    if (!unitId)
        throw new Error("unitId is required"); // Will be caught 500, or use AppError
    const { service } = (0, esg_registry_1.getRegistryEntry)(sourceType);
    const data = await service.getByUnitAndYear(Number(unitId), year ? Number(year) : undefined);
    res.json(data);
};
exports.list = list;
const create = async (req, res) => {
    const { sourceType } = req.params;
    const { service, schema } = (0, esg_registry_1.getRegistryEntry)(sourceType);
    const cleanBody = await schema.parseAsync(req.body);
    const result = await service.create(cleanBody);
    res.status(201).json(result);
};
exports.create = create;
const update = async (req, res) => {
    const { sourceType, id } = req.params;
    const { service, schema } = (0, esg_registry_1.getRegistryEntry)(sourceType);
    const cleanBody = await schema.partial().parseAsync(req.body);
    const result = await service.update(Number(id), cleanBody);
    res.json(result);
};
exports.update = update;
const remove = async (req, res) => {
    const { sourceType, id } = req.params;
    const { service } = (0, esg_registry_1.getRegistryEntry)(sourceType);
    await service.delete(Number(id));
    res.status(204).send();
};
exports.remove = remove;
