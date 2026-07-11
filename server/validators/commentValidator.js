import { z } from 'zod';

export const createCommentSchema = z.object({
  postId: z.union([z.number(), z.string()]).transform((val) => parseInt(val)),
  content: z.string().trim().min(1, 'Nội dung bình luận không được để trống'),
  parentId: z.union([z.number(), z.string()]).transform((val) => parseInt(val)).optional().nullable(),
});
