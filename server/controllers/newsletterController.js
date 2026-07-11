import catchAsync from '../utils/catchAsync.js';
import * as newsletterService from '../services/newsletterService.js';

export const subscribe = catchAsync(async (req, res) => {
  const { email } = req.body;
  await newsletterService.subscribe(email);
  res.status(201).json({ message: 'Đăng ký nhận bản tin thành công!' });
});

export const getSubscribers = catchAsync(async (req, res) => {
  const subscribers = await newsletterService.getAllSubscribers();
  res.json(subscribers);
});
