import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../../shared/middleware/authMiddleware';
import * as esgController from './esg.controller';
import * as evidenceController from './evidence/evidence.controller';
import { requireMaster } from "../../shared/middleware/roleMiddlewares";

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
});

router.use(authenticate);

router.get('/admin/:sourceType/units/:unitId/reports', requireMaster, esgController.listAdminReports);
router.get('/admin/:sourceType/reports/:id', requireMaster, esgController.getAdminReportDetail);
router.get('/admin/:sourceType/companies/:companyId/reports', requireMaster, esgController.listAdminReportsByCompany);

router.get('/:sourceType', esgController.list);
router.post('/:sourceType', esgController.create);
router.put('/:sourceType/:id', esgController.update);
router.delete('/:sourceType/:id', esgController.remove);

router.post(
    '/evidence/:sourceType/:id',
    upload.array('files'),
    evidenceController.upload
);

router.get(
    '/evidence/:sourceType/:id',
    evidenceController.getFiles
);

router.delete(
    '/evidence/attachment/:attachmentId',
    evidenceController.deleteFile
);

export default router;