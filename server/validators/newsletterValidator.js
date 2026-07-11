import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z.string().trim().email('Địa chỉ email không đúng định dạng.'),
});
