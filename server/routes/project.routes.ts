import { Router } from 'express';
import * as ProjectController from '../controllers/project.controller';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', ProjectController.getProjects);
router.get('/:id', ProjectController.getProjectById);
router.post('/', requireAdmin, ProjectController.createProject);
router.put('/:id', requireAdmin, ProjectController.updateProject);
router.delete('/:id', requireAdmin, ProjectController.deleteProject);

export default router;
