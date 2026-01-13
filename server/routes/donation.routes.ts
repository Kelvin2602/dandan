import { Router } from 'express';
import * as DonationController from '../controllers/donation.controller';

const router = Router();

router.get('/', DonationController.getDonations);
router.post('/', DonationController.createDonation);

export default router;
