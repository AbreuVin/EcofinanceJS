"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOption = exports.listOptions = exports.updateTypology = exports.deleteTypology = exports.createTypology = exports.listTypologies = void 0;
const configService = __importStar(require("./config.service"));
// Typologies
const listTypologies = async (req, res) => {
    const { unitId, sourceType } = req.query;
    const data = await configService.getTypologies(unitId ? Number(unitId) : undefined, sourceType ? String(sourceType) : undefined);
    res.json(data);
};
exports.listTypologies = listTypologies;
const createTypology = async (req, res) => {
    const result = await configService.createTypology(req.body);
    res.status(201).json(result);
};
exports.createTypology = createTypology;
const deleteTypology = async (req, res) => {
    await configService.deleteTypology(Number(req.params.id));
    res.status(204).send();
};
exports.deleteTypology = deleteTypology;
const updateTypology = async (req, res) => {
    const result = await configService.updateTypology(Number(req.params.id), req.body);
    res.status(201).json(result);
};
exports.updateTypology = updateTypology;
// Options
const listOptions = async (req, res) => {
    const { fieldKey } = req.query;
    if (!fieldKey)
        throw new Error("fieldKey required");
    const options = await configService.getOptions(String(fieldKey));
    res.json(options);
};
exports.listOptions = listOptions;
const createOption = async (req, res) => {
    const result = await configService.createOption(req.body);
    res.status(201).json(result);
};
exports.createOption = createOption;
