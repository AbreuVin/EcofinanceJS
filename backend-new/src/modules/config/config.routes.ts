import { Router } from 'express';
import { authenticate } from '../../shared/middleware/authMiddleware';
import { validate } from '../../shared/middleware/validationMiddleware';
import * as configController from './config.controller';
import { createOptionSchema, createTypologySchema } from './config.schema';

const router = Router();
router.use(authenticate);

// Typologies
router.get('/typologies', configController.listTypologies);
router.post('/typologies', validate(createTypologySchema), configController.createTypology);
router.delete('/typologies/:id', configController.deleteTypology);

// Options
router.get('/options', configController.listOptions);
router.post('/options', validate(createOptionSchema), configController.createOption);

export default router;