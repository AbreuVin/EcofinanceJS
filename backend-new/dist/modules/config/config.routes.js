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
const express_1 = require("express");
const authMiddleware_1 = require("../../shared/middleware/authMiddleware");
const validationMiddleware_1 = require("../../shared/middleware/validationMiddleware");
const configController = __importStar(require("./config.controller"));
const config_schema_1 = require("./config.schema");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
// Typologies
router.get('/typologies', configController.listTypologies);
router.post('/typologies', (0, validationMiddleware_1.validate)(config_schema_1.createTypologySchema), configController.createTypology);
router.delete('/typologies/:id', configController.deleteTypology);
router.put('/typologies/:id', (0, validationMiddleware_1.validate)(config_schema_1.updateTypologySchema), configController.updateTypology);
// Options
router.get('/options', configController.listOptions);
router.post('/options', (0, validationMiddleware_1.validate)(config_schema_1.createOptionSchema), configController.createOption);
exports.default = router;
