import * as userRepository from "../repositories/userRepository";
import { hashPassword } from "../utils/passwordUtils";
import prisma from "../repositories/prisma";

export const registerUser = async (userData: any) => {
    if (userData.unitId && !userData.companyId) {
        const unit = await prisma.unit.findUnique({
            where: { id: Number(userData.unitId) }
        });

        if (!unit) throw new Error('Unidade selecionada inválida');

        // Assign the deduced company ID
        userData.companyId = unit.companyId;
    }

    const exists = await userRepository.findByEmail(userData.email);
    if (exists) throw new Error('User already exists');

    const plainTextPassword = userData.password || "123456";
    const hashedPassword = await hashPassword(plainTextPassword);

    return prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                role: userData.role || 'USER',
                phone: userData.phone || null,
                companyId: userData.companyId || null,
                unitId: userData.unitId ? Number(userData.unitId) : null,
                parentId: userData.parentId || null,
            }
        });

        // Handle Permissions Immediately
        if (userData.permissions && Array.isArray(userData.permissions)) {
            await tx.userPermission.createMany({
                data: userData.permissions.map((sourceType: string) => ({
                    userId: user.id,
                    sourceType
                }))
            });
        }

        return user;
    });
}

export const getUsers = async () => userRepository.findUsers();

export const updateUser = async (id: string, data: any) => {
    const { permissions, ...userData } = data;
    const payload: any = { ...userData };

    // 1. AUTO-DEDUCE COMPANY ON UPDATE
    // If the Unit changed, we must update the Company association too.
    if (payload.unitId) {
        const unit = await prisma.unit.findUnique({
            where: { id: Number(payload.unitId) }
        });
        if (unit) {
            // Force the company to match the new unit
            payload.company = { connect: { id: unit.companyId } };
            // Ensure we connect the unit properly as well
            payload.unit = { connect: { id: Number(payload.unitId) } };

            // Cleanup: remove raw IDs from payload since we are using 'connect' syntax
            delete payload.companyId;
            delete payload.unitId;
        }
    } else {
        // If simply updating text fields, ensure we don't break relations
        if (payload.companyId) payload.company = { connect: { id: payload.companyId } };
        delete payload.unitId;
    }

    if (payload.password) {
        payload.password = await hashPassword(payload.password);
    } else {
        delete payload.password;
    }

    return prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
            where: { id },
            data: payload,
            select: { id: true, name: true, email: true, phone: true, role: true }
        });

        if (permissions && Array.isArray(permissions)) {
            await tx.userPermission.deleteMany({ where: { userId: id } });
            if (permissions.length > 0) {
                await tx.userPermission.createMany({
                    data: permissions.map((type: string) => ({
                        userId: id,
                        sourceType: type
                    }))
                });
            }
        }
        return user;
    });
};

export const fetchLoggedUser = async (userId: string) => {
    const user = await userRepository.findById(userId);

    if (!user) throw new Error('User not found');

    return user;
}

export const deleteUser = async (id: string) => userRepository.deleteUser(id);