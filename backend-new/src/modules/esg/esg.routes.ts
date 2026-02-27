import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../../shared/middleware/authMiddleware';
import * as esgController from './esg.controller';
import * as evidenceController from './evidence/evidence.controller';

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // Limite de 10MB por arquivo
});

router.use(authenticate);

// Rotas de Dados Existentes
router.get('/:sourceType', esgController.list);
router.post('/:sourceType', esgController.create);
router.put('/:sourceType/:id', esgController.update);
router.delete('/:sourceType/:id', esgController.remove);

// NOVA ROTA: Upload de Evidências
// O front deve chamar: POST /managers/esg/evidence/mobile_combustion/123
router.post(
    '/evidence/:sourceType/:id',
    upload.array('files'),
    evidenceController.upload
);

export default router;