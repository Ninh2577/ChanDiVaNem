import express from 'express';
import { getPosts, getPublishedPosts, createPost, getPostBySlug, getPostById, updatePost, deletePost, togglePostLock } from '../controllers/postController.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Các routes cơ bản (Công khai)
router.get('/published', getPublishedPosts);
router.get('/detail/:id', getPostById);
router.get('/', getPosts);
router.get('/:slug', getPostBySlug);

// Các routes cần đăng nhập (CTV hoặc Admin)
router.post('/', verifyToken, createPost);
router.put('/:id', verifyToken, updatePost);

// Các routes cần quyền Admin
router.delete('/:id', verifyAdmin, deletePost);
router.patch('/:id/toggle-lock', verifyAdmin, togglePostLock);

export default router;
