import { Router } from 'express';
import { authenticate } from '../../shared/middleware/authMiddleware';
import * as esgController from './esg.controller';

const router = Router();
router.use(authenticate);

router.get('/:sourceType', esgController.list);
router.post('/:sourceType', esgController.create);
router.put('/:sourceType/:id', esgController.update);
router.delete('/:sourceType/:id', esgController.remove);

export default router;