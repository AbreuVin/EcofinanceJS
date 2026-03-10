import { Router } from 'express';
import { authenticate } from '../../shared/middleware/authMiddleware';
import { validate } from '../../shared/middleware/validationMiddleware';
import { createUnitSchema, updateUnitSchema } from './unit.schema';
import * as unitController from './unit.controller';
import { requireMaster } from "../../shared/middleware/roleMiddlewares";

const router = Router();

router.use(authenticate);

router.get('/admin/companies/:companyId', requireMaster, unitController.listByCompanyAdmin);

router.get('/', unitController.list);
router.post('/', validate(createUnitSchema), unitController.create);
router.put('/:id', validate(updateUnitSchema), unitController.update);
router.delete('/:id', unitController.remove);

export default router;