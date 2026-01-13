import { CreateUserDTO } from "../schemas/userSchema";
import * as userRepository from "../repositories/userRepository";
import { hashPassword } from "../utils/passwordUtils";
import { AppJwtPayload } from "../types/auth";

export const registerUser = async (userData: CreateUserDTO, currentUser: AppJwtPayload) => {
    const exists = await userRepository.findByEmail(userData.email);
    if (exists) throw new Error('User already exists');

    const companyId = currentUser.role === 'ADMIN' ? currentUser.companyId : userData.companyId;
    const hashedPassword = await hashPassword(userData.password);

    const payload: any = {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'USER',
    };

    if (userData.companyId) payload.company = { connect: { id: userData.companyId } };
    if (userData.unitId) payload.unit = { connect: { id: Number(userData.unitId) } };

    return userRepository.create(payload);
}

export const getUsers = async () => userRepository.findUsers();

export const updateUser = async (id: string, data: any) => {
    const payload: any = { ...data };

    // Hash new password if provided
    if (payload.password) {
        payload.password = await hashPassword(payload.password);
    } else {
        delete payload.password; // Don't wipe it if not sent
    }

    // Handle relations
    if (payload.companyId) payload.company = { connect: { id: payload.companyId } };
    if (payload.unitId) payload.unit = { connect: { id: Number(payload.unitId) } };

    return userRepository.updateUser(id, payload);
};

export const fetchLoggedUser = async (userId: string) => {
    const user = await userRepository.findById(userId);

    if (!user) throw new Error('User not found');

    return user;
}

export const deleteUser = async (id: string) => userRepository.deleteUser(id);