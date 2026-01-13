import { Router } from 'express';
import * as NewsController from '../controllers/news.controller';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', NewsController.getNews);
router.get('/:id', NewsController.getNewsById);
router.post('/', requireAdmin, NewsController.createNews);
router.put('/:id', requireAdmin, NewsController.updateNews);
router.delete('/:id', requireAdmin, NewsController.deleteNews);

export default router;
