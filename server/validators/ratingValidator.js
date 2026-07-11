import { z } from 'zod';

export const createRatingSchema = z.object({
  postId: z.union([z.number(), z.string()]).transform((val) => parseInt(val)),
  score: z.union([z.number(), z.string()])
    .transform((val) => parseInt(val))
    .refine((val) => val >= 1 && val <= 5, {
      message: 'Số sao đánh giá phải là số nguyên từ 1 đến 5.',
    }),
});
