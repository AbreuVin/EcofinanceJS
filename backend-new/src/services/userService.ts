import * as userRepository from "../repositories/userRepository";
import { hashPassword } from "../utils/passwordUtils";
import { AppJwtPayload } from "../types/auth";
import prisma from "../repositories/prisma";

export const registerUser = async (userData: any, currentUser: AppJwtPayload) => {
    const exists = await userRepository.findByEmail(userData.email);
    if (exists) throw new Error('User already exists');

    const hashedPassword = await hashPassword(userData.password);

    return prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                role: userData.role || 'USER',
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

    if (payload.password) {
        payload.password = await hashPassword(payload.password);
    } else {
        delete payload.password;
    }

    if (payload.companyId) payload.company = { connect: { id: payload.companyId } };
    if (payload.unitId) payload.unit = { connect: { id: Number(payload.unitId) } };

    return prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
            where: { id },
            data: payload,
            select: { id: true, name: true, email: true, role: true }
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