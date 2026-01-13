import { Router } from 'express';
import * as VolunteerController from '../controllers/volunteer.controller';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', requireAdmin, VolunteerController.getVolunteers); // Protect PII
router.post('/', VolunteerController.createVolunteer); // Public
router.put('/:id/status', requireAdmin, VolunteerController.updateVolunteerStatus);
router.delete('/:id', requireAdmin, VolunteerController.deleteVolunteer);

export default router;
