import { Router } from 'express';
import { authenticate } from '../../shared/middleware/authMiddleware';
import { validate } from '../../shared/middleware/validationMiddleware';
import { createCompanySchema, updateCompanySchema } from './company.schema';
import * as companyController from './company.controller';

const router = Router();

router.use(authenticate);

router.get('/', companyController.list);
router.post('/', validate(createCompanySchema), companyController.create);
router.put('/:id', validate(updateCompanySchema), companyController.update);
router.delete('/:id', companyController.remove);

export default router;