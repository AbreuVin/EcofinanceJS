import prisma from "./prisma";
import { Prisma } from "../../generated/prisma";
import { CreateUserDTO } from "../schemas/userSchema";

export const create = async (userData: CreateUserDTO) => {
    return prisma.user.create({
        data: {
            email: userData.email,
            password: userData.password,
            name: userData.name,
            role: userData.role,
            companyId: userData.companyId,
            unitId: userData.unitId,
            parentId: userData.parentId,
        }
    })
}

export const findByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: { email },
        include: { company: true }
    })
}

export const findById = async (id: string) => {
    return prisma.user.findUnique({
        where: { id },
        include: {
            company: true,
            permissions: { select: { sourceType: true } }
        }
    });
};

export const findUsers = () => prisma.user.findMany({
    select: {
        id: true,
        name: true,
        email: true,
        role: true,
        unitId: true,
        companyId: true,
        createdAt: true,
        // Eager load relations for Table display
        company: { select: { name: true } },
        unit: { select: { name: true } },
        // Eager load permissions for Form editing
        permissions: { select: { sourceType: true } }
    },
    orderBy: { name: 'asc' }
});

export const updateUser = (id: string, data: Prisma.UserUpdateInput) => prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true }
});

export const deleteUser = (id: string) => prisma.user.delete({ where: { id } });