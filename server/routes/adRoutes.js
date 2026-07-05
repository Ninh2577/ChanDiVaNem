import express from 'express';
import { 
  getAdCampaigns, getActiveAdCampaigns, createAdCampaign, 
  updateAdCampaign, deleteAdCampaign, trackView, trackClick 
} from '../controllers/adController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Công khai (Public)
router.get('/active', getActiveAdCampaigns);
router.post('/:id/view', trackView);
router.post('/:id/click', trackClick);

// Quản trị (Admin only)
router.get('/', verifyAdmin, getAdCampaigns);
router.post('/', verifyAdmin, createAdCampaign);
router.put('/:id', verifyAdmin, updateAdCampaign);
router.delete('/:id', verifyAdmin, deleteAdCampaign);

export default router;
