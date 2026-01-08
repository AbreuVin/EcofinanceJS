import { CreateUserDTO, UserPayload } from "../types/user";
import * as userRepository from "../repositories/userRepository";
import { hashPassword } from "../utils/passwordUtils";

export const registerUser = async (userData: CreateUserDTO, currentUser: UserPayload) => {
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