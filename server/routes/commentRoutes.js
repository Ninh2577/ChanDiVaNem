import express from 'express';
import { getComments, addComment, removeComment } from '../controllers/commentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createCommentSchema } from '../validators/commentValidator.js';

const router = express.Router();

router.get('/post/:postId', getComments);
router.post('/', verifyToken, validate(createCommentSchema), addComment);
router.delete('/:id', verifyToken, removeComment);

export default router;
