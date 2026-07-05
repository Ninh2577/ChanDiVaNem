import catchAsync from '../utils/catchAsync.js';
import * as adService from '../services/adService.js';

export const getAdCampaigns = catchAsync(async (req, res) => {
  const campaigns = await adService.getAdCampaigns();
  res.json(campaigns);
});

export const getActiveAdCampaigns = catchAsync(async (req, res) => {
  const campaigns = await adService.getActiveAdCampaigns();
  res.json(campaigns);
});

export const createAdCampaign = catchAsync(async (req, res) => {
  const campaign = await adService.createAdCampaign(req.body);
  res.status(201).json({
    message: 'Tạo chiến dịch quảng cáo thành công!',
    campaign
  });
});

export const updateAdCampaign = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campaign = await adService.updateAdCampaign(id, req.body);
  res.json({
    message: 'Cập nhật chiến dịch quảng cáo thành công!',
    campaign
  });
});

export const deleteAdCampaign = catchAsync(async (req, res) => {
  const { id } = req.params;
  await adService.deleteAdCampaign(id);
  res.json({ message: 'Đã xóa chiến dịch quảng cáo thành công!' });
});

export const trackView = catchAsync(async (req, res) => {
  const { id } = req.params;
  await adService.trackView(id);
  res.json({ success: true, message: 'Đã ghi nhận lượt hiển thị.' });
});

export const trackClick = catchAsync(async (req, res) => {
  const { id } = req.params;
  await adService.trackClick(id);
  res.json({ success: true, message: 'Đã ghi nhận lượt nhấp chuột.' });
});
