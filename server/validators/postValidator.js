import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().trim().min(3, 'Tiêu đề bài viết phải có ít nhất 3 ký tự').max(200, 'Tiêu đề không được vượt quá 200 ký tự'),
  content: z.string().trim().min(10, 'Nội dung bài viết phải có ít nhất 10 ký tự'),
  categoryId: z.union([z.number(), z.string()]).transform((val) => parseInt(val)),
  imageUrl: z.string().trim().optional().nullable(),
  metaTitle: z.string().trim().max(100, 'Tiêu đề Meta không vượt quá 100 ký tự').optional().nullable(),
  metaDesc: z.string().trim().max(200, 'Mô tả Meta không vượt quá 200 ký tự').optional().nullable(),
  canonicalUrl: z.string().trim().url('Đường dẫn Canonical không hợp lệ').or(z.string().length(0)).optional().nullable(),
  thumbnailAlt: z.string().trim().optional().nullable(),
  customSlug: z.string().trim().optional().nullable(),
});

export const updatePostSchema = z.object({
  title: z.string().trim().min(3, 'Tiêu đề bài viết phải có ít nhất 3 ký tự').max(200, 'Tiêu đề không được vượt quá 200 ký tự').optional(),
  content: z.string().trim().min(10, 'Nội dung bài viết phải có ít nhất 10 ký tự').optional(),
  categoryId: z.union([z.number(), z.string()]).transform((val) => parseInt(val)).optional(),
  imageUrl: z.string().trim().optional().nullable(),
  metaTitle: z.string().trim().max(100, 'Tiêu đề Meta không vượt quá 100 ký tự').optional().nullable(),
  metaDesc: z.string().trim().max(200, 'Mô tả Meta không vượt quá 200 ký tự').optional().nullable(),
  canonicalUrl: z.string().trim().url('Đường dẫn Canonical không hợp lệ').or(z.string().length(0)).optional().nullable(),
  thumbnailAlt: z.string().trim().optional().nullable(),
  slug: z.string().trim().optional().nullable(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});
