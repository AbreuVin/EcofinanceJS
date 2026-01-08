import * as userRepository from '../repositories/userRepository';
import { comparePassword } from '../utils/passwordUtils';
import { generateToken } from '../utils/jwtUtils';

export const login = async (email: string, pass: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await comparePassword(pass, user.password))) throw new Error('Invalid credentials');
    return generateToken({ id: user.id, role: user.role, companyId: user.companyId });
};