import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

import { globalErrorHandler } from "./shared/middleware/errorMiddleware";

import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import permissionRoutes from './modules/user/permission/permission.routes';
import companyRoutes from "./modules/company/company.routes";
import unitRoutes from "./modules/unit/unit.routes";
import configRoutes from './modules/config/config.routes';
import esgRoutes from './modules/esg/esg.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/config', configRoutes);
app.use('/api/esg/data', esgRoutes);

app.get('/health', (_req, res) => res.json({ status: 'OK' }));

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});