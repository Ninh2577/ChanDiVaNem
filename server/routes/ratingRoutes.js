import express from 'express';
import { getStats, getUserRating, rate } from '../controllers/ratingController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/post/:postId/stats', getStats);
router.get('/post/:postId/user', verifyToken, getUserRating);
router.post('/', verifyToken, rate);

export default router;
