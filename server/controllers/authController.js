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
