import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Họ tên phải có ít nhất 2 ký tự').max(100, 'Họ tên không được vượt quá 100 ký tự'),
  email: z.string().trim().email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').max(100, 'Mật khẩu không được vượt quá 100 ký tự'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Email không đúng định dạng'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Email không đúng định dạng'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token không hợp lệ hoặc bị thiếu.'),
  password: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự').max(100, 'Mật khẩu mới không được vượt quá 100 ký tự'),
});
