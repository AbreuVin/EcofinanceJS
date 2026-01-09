import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret';

export const generateToken = (payload: object) => jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });