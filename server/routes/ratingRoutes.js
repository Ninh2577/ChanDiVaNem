import express from 'express';
import { getStats, getUserRating, rate } from '../controllers/ratingController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createRatingSchema } from '../validators/ratingValidator.js';

const router = express.Router();

router.get('/post/:postId/stats', getStats);
router.get('/post/:postId/user', verifyToken, getUserRating);
router.post('/', verifyToken, validate(createRatingSchema), rate);

export default router;
