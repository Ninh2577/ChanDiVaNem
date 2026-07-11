import express from 'express';
import { getUsers, deleteUser, getUserProfile, getAuthorProfile } from '../controllers/userController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Công khai (Public)
router.get('/profile/:nameOrId', getUserProfile);
router.get('/author/:id', getAuthorProfile);

// Quản trị (Admin only)
router.get('/', verifyAdmin, getUsers);
router.delete('/:id', verifyAdmin, deleteUser);

export default router;
