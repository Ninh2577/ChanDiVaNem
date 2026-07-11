import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, 'Tên danh mục phải có ít nhất 2 ký tự').max(100, 'Tên danh mục không vượt quá 100 ký tự'),
  slug: z.string().trim().min(2, 'Slug danh mục phải có ít nhất 2 ký tự').max(100, 'Slug danh mục không vượt quá 100 ký tự'),
  description: z.string().trim().optional().nullable(),
  parentId: z.union([z.number(), z.string()]).transform((val) => parseInt(val)).optional().nullable(),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(2, 'Tên danh mục phải có ít nhất 2 ký tự').max(100, 'Tên danh mục không vượt quá 100 ký tự').optional(),
  slug: z.string().trim().min(2, 'Slug danh mục phải có ít nhất 2 ký tự').max(100, 'Slug danh mục không vượt quá 100 ký tự').optional(),
  description: z.string().trim().optional().nullable(),
  parentId: z.union([z.number(), z.string()]).transform((val) => parseInt(val)).optional().nullable(),
});
