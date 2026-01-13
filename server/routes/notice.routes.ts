import { Router } from 'express';
import * as NoticeController from '../controllers/notice.controller';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/active', NoticeController.getActiveNotices); 
router.get('/', NoticeController.getNotices);
router.post('/', requireAdmin, NoticeController.createNotice);
router.put('/:id', requireAdmin, NoticeController.updateNotice);
router.delete('/:id', requireAdmin, NoticeController.deleteNotice);

export default router;
