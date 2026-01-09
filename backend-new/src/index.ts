import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import esgRoutes from './routes/esgRoutes';
import permissionRoutes from "./routes/permissionRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/esg', esgRoutes);
app.use('/api/permissions', permissionRoutes);

app.get('/health', (req, res) => res.json({ status: 'OK' }));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});