import { Router } from 'express';
import * as SiteConfigController from '../controllers/siteConfig.controller';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', SiteConfigController.getSiteConfig);
router.post('/', requireAdmin, SiteConfigController.updateSiteConfig);

export default router;
