import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware'; // Ensure you have this
import * as adminController from '../controllers/adminController';

const router = Router();

router.get('/companies', authenticate, adminController.getCompanies);
router.post('/companies', authenticate, adminController.createCompany);
router.put('/companies/:id', authenticate, adminController.updateCompany);
router.delete('/companies/:id', authenticate, adminController.deleteCompany);

router.get('/units', authenticate, adminController.getUnits);
router.post('/units', authenticate, adminController.createUnit);
router.put('/units/:id', authenticate, adminController.updateUnit);
router.delete('/units/:id', authenticate, adminController.deleteUnit);

export default router;