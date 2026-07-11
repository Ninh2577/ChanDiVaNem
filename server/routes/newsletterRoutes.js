import express from 'express';
import { subscribe, getSubscribers } from '../controllers/newsletterController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { newsletterSchema } from '../validators/newsletterValidator.js';

const router = express.Router();

// Công khai (Public)
router.post('/subscribe', validate(newsletterSchema), subscribe);

// Quản trị (Admin only)
router.get('/', verifyAdmin, getSubscribers);

export default router;
