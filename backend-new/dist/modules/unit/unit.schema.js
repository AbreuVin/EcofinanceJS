"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUnitSchema = exports.createUnitSchema = void 0;
const zod_1 = require("zod");
exports.createUnitSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Unit name is required"),
    city: zod_1.z.string().min(1, "City is required"),
    state: zod_1.z.string().length(2, "State must be 2 characters (e.g. SP)"),
    country: zod_1.z.string().default('Brasil'),
    numberOfWorkers: zod_1.z.coerce.number().int().min(1),
    companyId: zod_1.z.string("Invalid Company ID"),
});
exports.updateUnitSchema = exports.createUnitSchema.partial().omit({ companyId: true });
