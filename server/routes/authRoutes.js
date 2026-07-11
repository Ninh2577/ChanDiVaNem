import express from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidator.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Đăng ký tài khoản
router.post('/register', validate(registerSchema), register);

// Đăng nhập
router.post('/login', loginLimiter, validate(loginSchema), login);

// Quên & đặt lại mật khẩu
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;
