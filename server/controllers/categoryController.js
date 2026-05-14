import catchAsync from '../utils/catchAsync.js';
import * as categoryService from '../services/categoryService.js';

export const getCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getCategories();
  res.json(categories);
});

export const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json(category);
});

export const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const category = await categoryService.updateCategory(id, req.body);
  res.json(category);
});

export const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  await categoryService.deleteCategory(id);
  res.json({ message: 'Xóa chuyên mục thành công' });
});
