import { Router } from 'express';
import * as FundController from '../controllers/fund.controller';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', FundController.getFunds);
router.post('/', requireAdmin, FundController.createFund);
router.put('/:id', requireAdmin, FundController.updateFund);
router.delete('/:id', requireAdmin, FundController.deleteFund);

export default router;
