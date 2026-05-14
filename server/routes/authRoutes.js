import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Đăng ký tài khoản
router.post('/register', register);

// Đăng nhập
router.post('/login', login);

export default router;
