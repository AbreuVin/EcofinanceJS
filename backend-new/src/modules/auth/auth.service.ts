import { comparePassword } from './password.utils';
import { generateToken } from './jwt.utils';
import prisma from "../../shared/database/prisma";
import { AppError } from "../../shared/error/AppError";

export const login = async (email: string, pass: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await comparePassword(pass, user.password))) {
        throw new AppError('Invalid credentials', 401);
    }

    if (!user.isConfirmed) {
        throw new AppError('Confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada.', 403);
    }

    return generateToken({ id: user.id, role: user.role, companyId: user.companyId });
};