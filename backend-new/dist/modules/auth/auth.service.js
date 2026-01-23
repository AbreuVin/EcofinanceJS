"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const password_utils_1 = require("./password.utils");
const jwt_utils_1 = require("./jwt.utils");
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
const AppError_1 = require("../../shared/error/AppError");
const login = async (email, pass) => {
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user || !(await (0, password_utils_1.comparePassword)(pass, user.password))) {
        throw new AppError_1.AppError('Invalid credentials', 401);
    }
    return (0, jwt_utils_1.generateToken)({ id: user.id, role: user.role, companyId: user.companyId });
};
exports.login = login;
