import { Prisma } from "../../../generated/prisma"
import prisma from '../../shared/database/prisma';
import { hashPassword } from '../auth/password.utils';
import { AppError } from '../../shared/error/AppError';
import { v4 as uuidv4 } from 'uuid';
import { sendConfirmationEmail } from '../email/email.service';

export const getAll = async () => {
    return prisma.user.findMany({
        select: {
            id: true, name: true, email: true, role: true, phone: true,
            unitId: true, companyId: true, createdAt: true,
            company: { select: { name: true } },
            unit: { select: { name: true } },
            permissions: { select: { sourceType: true } }
        },
        orderBy: { name: 'asc' }
    });
};

export const getById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            company: true,
            permissions: { select: { sourceType: true } }
        }
    });
    if (!user) throw new AppError('User not found', 404);
    return user;
};

export const create = async (data: any) => {
    const { permissions, password, ...userData } = data;

    // Convert empty/falsy companyId to null to avoid FK constraint error
    if (!userData.companyId) {
        userData.companyId = null;
    }

    // Convert unitId 0 to null (0 means "all units" in the frontend)
    if (userData.unitId === 0) {
        userData.unitId = null;
    }

    if (userData.unitId && !userData.companyId) {
        const unit = await prisma.unit.findUnique({ where: { id: userData.unitId } });
        if (!unit) throw new AppError('Invalid Unit ID', 400);
        userData.companyId = unit.companyId;
    }

    const hashedPassword = await hashPassword(password || "123456");

    const confirmationToken = uuidv4();
    const confirmationTokenExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

    const user = await prisma.$transaction(async (tx) => {
        return await tx.user.create({
            data: {
                ...userData,
                password: hashedPassword,
                isConfirmed: false,
                confirmationToken,
                confirmationTokenExpiry,
                permissions: permissions ? {
                    create: permissions.map((p: string) => ({ sourceType: p }))
                } : undefined
            }
        });
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const confirmationUrl = `${frontendUrl}/confirm-email?token=${confirmationToken}`;

    // Fire and forget — não bloqueia a resposta se o email falhar
    sendConfirmationEmail(user.email, user.name, confirmationUrl).catch((err) => {
        console.error('[Email] Falha ao enviar email de confirmação:', err.message);
    });

    return user;
};

export const update = async (id: string, data: any) => {
    const { permissions, password, ...userData } = data;

    if (password) {
        userData.password = await hashPassword(password);
    }

    const updateData: Prisma.UserUpdateInput = { ...userData };

    if (userData.unitId) {
        const unit = await prisma.unit.findUnique({ where: { id: userData.unitId } });
        if (unit) {
            updateData.unit = { connect: { id: unit.id } };
            updateData.company = { connect: { id: unit.companyId } };
            delete (updateData as any).unitId;
            delete (updateData as any).companyId;
        }
    }

    return prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
            where: { id },
            data: updateData,
        });

        if (permissions) {
            await tx.userPermission.deleteMany({ where: { userId: id } });
            if (permissions.length > 0) {
                await tx.userPermission.createMany({
                    data: permissions.map((type: string) => ({ userId: id, sourceType: type }))
                });
            }
        }
        return user;
    });
};

export const remove = async (id: string) => {
    return prisma.user.delete({ where: { id } });
};

export const confirmEmail = async (token: string) => {
    const user = await prisma.user.findUnique({ where: { confirmationToken: token } });

    if (!user) throw new AppError('Token inválido ou já utilizado.', 400);

    if (user.confirmationTokenExpiry && user.confirmationTokenExpiry < new Date()) {
        throw new AppError('Este link de confirmação expirou. Solicite um novo convite ao administrador.', 400);
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            isConfirmed: true,
            confirmationToken: null,
            confirmationTokenExpiry: null,
        },
    });

    return { message: 'Cadastro confirmado com sucesso! Você já pode fazer login.' };
};