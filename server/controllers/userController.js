import catchAsync from '../utils/catchAsync.js';
import * as userService from '../services/userService.js';

export const getUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsers();
  res.json(users);
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
