import { Router } from 'express';
import { authenticate } from '../../shared/middleware/authMiddleware';
import { validate } from '../../shared/middleware/validationMiddleware';
import { createUnitSchema, updateUnitSchema } from './unit.schema';
import * as unitController from './unit.controller';

const router = Router();

router.use(authenticate);

router.get('/', unitController.list);
router.post('/', validate(createUnitSchema), unitController.create);
router.put('/:id', validate(updateUnitSchema), unitController.update);
router.delete('/:id', unitController.remove);

export default router;