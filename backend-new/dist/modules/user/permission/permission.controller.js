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
exports.remove = exports.add = exports.sync = exports.list = void 0;
const permService = __importStar(require("./permission.service"));
const list = async (req, res) => {
    const permissions = await permService.getPermissions(req.params.userId);
    res.json({ permissions });
};
exports.list = list;
const sync = async (req, res) => {
    await permService.syncPermissions(req.params.userId, req.body.permissions);
    res.json({ message: "Permissions updated" });
};
exports.sync = sync;
const add = async (req, res) => {
    await permService.addPermission(req.params.userId, req.body.sourceType);
    res.status(201).json({ message: "Permission granted" });
};
exports.add = add;
const remove = async (req, res) => {
    await permService.removePermission(req.params.userId, req.params.sourceType);
    res.status(204).send();
};
exports.remove = remove;
