import express from 'express';
import { getUsers, deleteUser, getUserProfile, getAuthorProfile, updateProfile, changePassword } from '../controllers/userController.js';
import { verifyAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Công khai (Public)
router.get('/profile/:nameOrId', getUserProfile);
router.get('/author/:id', getAuthorProfile);

// Đăng nhập (Authenticated users)
router.put('/profile/update', verifyToken, updateProfile);
router.put('/profile/change-password', verifyToken, changePassword);

// Quản trị (Admin only)
router.get('/', verifyAdmin, getUsers);
router.delete('/:id', verifyAdmin, deleteUser);

export default router;
