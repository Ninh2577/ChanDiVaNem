import catchAsync from '../utils/catchAsync.js';
import * as authService from '../services/authService.js';

export const register = catchAsync(async (req, res) => {
  const { fullName, email, password } = req.body;
  
  const user = await authService.registerUser({ fullName, email, password });

  res.status(201).json({
    message: 'Tạo tài khoản thành công!',
    user
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  
  const data = await authService.loginUser({ email, password });

  res.status(200).json({
    message: 'Đăng nhập thành công',
    ...data
  });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  res.json({ message: 'Email khôi phục mật khẩu đã được gửi.' });
});

export const resetPassword = catchAsync(async (req, res) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  res.json({ message: 'Đặt lại mật khẩu thành công.' });
});
