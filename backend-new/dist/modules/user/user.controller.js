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
exports.remove = exports.update = exports.create = exports.getMe = exports.list = void 0;
const userService = __importStar(require("./user.service"));
const list = async (req, res) => {
    const result = await userService.getAll();
    res.json(result);
};
exports.list = list;
const getMe = async (req, res) => {
    const id = req.params.userId === 'me' ? req.user.id : req.params.userId;
    const result = await userService.getById(id);
    const { password, ...safe } = result;
    res.json(safe);
};
exports.getMe = getMe;
const create = async (req, res) => {
    const result = await userService.create(req.body);
    const { password, ...safe } = result;
    res.status(201).json(safe);
};
exports.create = create;
const update = async (req, res) => {
    const result = await userService.update(req.params.id, req.body);
    const { password, ...safe } = result;
    res.json(safe);
};
exports.update = update;
const remove = async (req, res) => {
    await userService.remove(req.params.id);
    res.status(204).send();
};
exports.remove = remove;
