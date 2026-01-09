import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import * as permissionController from '../controllers/permissionController';

const router = Router();

router.get('/:userId', authenticate, permissionController.getPermissions);
router.put('/:userId', authenticate, permissionController.syncPermissions);
router.post('/:userId', authenticate, permissionController.addPermission);
router.delete('/:userId/:sourceType', authenticate, permissionController.removePermission);

export default router;