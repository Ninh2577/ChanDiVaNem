import catchAsync from '../utils/catchAsync.js';
import * as tagService from '../services/tagService.js';

export const getTags = catchAsync(async (req, res) => {
  const tags = await tagService.getTags();
  res.json(tags);
});

export const createTag = catchAsync(async (req, res) => {
  const tag = await tagService.createTag(req.body);
  res.status(201).json({ message: 'Tạo thẻ thành công', tag });
});

export const updateTag = catchAsync(async (req, res) => {
  const { id } = req.params;
  const tag = await tagService.updateTag(id, req.body);
  res.json({ message: 'Cập nhật thẻ thành công', tag });
});

export const deleteTag = catchAsync(async (req, res) => {
  const { id } = req.params;
  await tagService.deleteTag(id);
  res.json({ message: 'Xóa thẻ thành công' });
});
