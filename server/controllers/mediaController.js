import catchAsync from '../utils/catchAsync.js';
import * as mediaService from '../services/mediaService.js';

export const uploadMedia = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Vui lòng chọn một file ảnh.' });
  }
  const media = await mediaService.uploadFile(req.file);
  res.status(201).json({ 
    message: 'Tải lên thành công', 
    imageUrl: media.url,
    media 
  });
});

export const getMedia = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await mediaService.getMediaList({ page, limit });
  res.json(result);
});

export const deleteMedia = catchAsync(async (req, res) => {
  const { id } = req.params;
  await mediaService.deleteMedia(id);
  res.json({ message: 'Đã xóa hình ảnh thành công' });
});
