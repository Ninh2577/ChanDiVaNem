import express from 'express';
import { getComments, addComment, removeComment } from '../controllers/commentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/post/:postId', getComments);
router.post('/', verifyToken, addComment);
router.delete('/:id', verifyToken, removeComment);

export default router;
