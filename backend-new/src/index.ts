import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';

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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/config', configRoutes);
app.use('/api/esg/data', esgRoutes);

app.get('/health', (_req, res) => res.json({ status: 'OK' }));

// Serve static files from frontend build in production
const frontendBuildPath = path.join(__dirname, '../../frontend-react/dist');
console.log('Frontend build path:', frontendBuildPath);
app.use(express.static(frontendBuildPath));

// Fallback to index.html for client-side routing
app.get(/.*/,(_req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
        if (err) {
            console.error('Error serving index.html:', err);
            res.status(500).json({ status: 'error', message: 'Failed to load frontend' });
        }
    });
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});