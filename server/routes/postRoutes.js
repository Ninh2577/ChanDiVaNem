import express from 'express';
import { getPosts, getPublishedPosts, createPost, getPostBySlug, getPostById, updatePost, deletePost, togglePostLock, search, save, unsave, savedList } from '../controllers/postController.js';
import { verifyToken, verifyAdmin, verifyCTV } from '../middleware/authMiddleware.js';

import { validate } from '../middleware/validate.js';
import { createPostSchema, updatePostSchema } from '../validators/postValidator.js';

const router = express.Router();

// Các routes cơ bản (Công khai)
router.get('/published', getPublishedPosts);
router.get('/search/query', search);
router.get('/detail/:id', getPostById);
router.get('/', getPosts);
router.get('/:slug', getPostBySlug);

// Các routes cần đăng nhập (Độc giả / CTV / Admin)
router.get('/saved-list/all', verifyToken, savedList);
router.post('/:id/save', verifyToken, save);
router.delete('/:id/unsave', verifyToken, unsave);

// Các routes cần đăng nhập (CTV hoặc Admin)
router.post('/', verifyCTV, validate(createPostSchema), createPost);
router.put('/:id', verifyCTV, validate(updatePostSchema), updatePost);

// Các routes cần quyền Admin hoặc CTV (kiểm tra quyền sở hữu bài viết ở service)
router.delete('/:id', verifyCTV, deletePost);
router.patch('/:id/toggle-lock', verifyAdmin, togglePostLock);

export default router;
