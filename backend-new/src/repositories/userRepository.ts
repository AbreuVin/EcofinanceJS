import prisma from "./prisma";
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