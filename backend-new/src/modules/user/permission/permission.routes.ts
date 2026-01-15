import { Router } from 'express';
import { authenticate } from '../../../shared/middleware/authMiddleware';
import { validate } from '../../../shared/middleware/validationMiddleware';
import * as permController from './permission.controller';
import { permissionSchema, syncPermissionsSchema } from '../user.schema';

const router = Router();
router.use(authenticate);

router.get('/:userId', permController.list);
router.put('/:userId', validate(syncPermissionsSchema), permController.sync);
router.post('/:userId', validate(permissionSchema), permController.add);
router.delete('/:userId/:sourceType', permController.remove);

export default router;