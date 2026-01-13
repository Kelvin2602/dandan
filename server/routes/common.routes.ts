import { Router } from 'express';
import * as CommonController from '../controllers/common.controller';

const router = Router();

router.get('/health', CommonController.healthCheck);
router.get('/test', CommonController.testConnection);
router.get('/stats/total-raised', CommonController.getTotalRaised);

export default router;
