import catchAsync from '../utils/catchAsync.js';
import * as userService from '../services/userService.js';

export const getUsers = catchAsync(async (req, res) => {
  const { page, limit, role } = req.query;
  const result = await userService.getUsers({ page, limit, role });
  res.json(result);
});

export const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  await userService.deleteUser(id);
  res.json({ message: 'Đã xóa người dùng' });
});

export const getUserProfile = catchAsync(async (req, res) => {
  const { nameOrId } = req.params;
  const user = await userService.getUserProfile(nameOrId);
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy tác giả này.' });
  }
  res.json(user);
});

export const getAuthorProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const author = await userService.getAuthorProfile(id);
  res.json(author);
});

export const updateProfile = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateProfile(req.user.id, req.body);
  res.json(updatedUser);
});

export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await userService.changePassword(req.user.id, currentPassword, newPassword);
  res.json({ message: 'Đổi mật khẩu thành công' });
});
