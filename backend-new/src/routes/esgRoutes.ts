import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import * as esgController from '../controllers/esgDataController';
import * as configController from '../controllers/configController';

const router = Router();

// --- Configuration Routes ---
router.get('/config/typologies', authenticate, configController.getTypologies);
router.post('/config/typologies', authenticate, configController.createTypology);
router.delete('/config/typologies/:id', authenticate, configController.deleteTypology);

router.get('/config/options', authenticate, configController.getOptions);
router.post('/config/options', authenticate, configController.createOption);

// --- Generic ESG Data Routes ---
// :sourceType matches the keys in esgRegistry (e.g., "mobile_combustion")
router.get('/data/:sourceType', authenticate, esgController.getByUnit);
router.post('/data/:sourceType', authenticate, esgController.createEntry);
router.put('/data/:sourceType/:id', authenticate, esgController.updateEntry);
router.delete('/data/:sourceType/:id', authenticate, esgController.deleteEntry);

export default router;