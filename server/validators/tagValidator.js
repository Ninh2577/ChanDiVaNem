import { z } from 'zod';

export const createTagSchema = z.object({
  name: z.string().trim().min(1, 'Tên thẻ không được bỏ trống.').max(50, 'Tên thẻ không vượt quá 50 ký tự'),
});
