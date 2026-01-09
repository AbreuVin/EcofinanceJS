import { CreateUserDTO } from "../schemas/userSchema";
import * as userRepository from "../repositories/userRepository";
import { hashPassword } from "../utils/passwordUtils";
import { AppJwtPayload } from "../types/auth";

export const registerUser = async (userData: CreateUserDTO, currentUser: AppJwtPayload) => {
    const exists = await userRepository.findByEmail(userData.email);
    if (exists) throw new Error('User already exists');

    const companyId = currentUser.role === 'ADMIN' ? currentUser.companyId : userData.companyId;
    const hashedPassword = await hashPassword(userData.password);

    return userRepository.create({
        ...userData,
        password: hashedPassword,
        companyId,
        parentId: currentUser.id
    });
}

export const fetchLoggedUser = async (userId: string) => {
    const user = await userRepository.findById(userId);

    if (!user) throw new Error('User not found');

    return user;
}