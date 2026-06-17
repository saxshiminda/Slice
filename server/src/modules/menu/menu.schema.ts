import { z } from 'zod';

export const listCakesQuerySchema = z.object({
  category: z.string().optional(),
  featured: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
});

export const createCakeSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(2000),
  price: z.number().positive(),
  categoryId: z.string().min(1),
  imageUrl: z.string().min(1),
  featured: z.boolean().optional().default(false),
  available: z.boolean().optional().default(true),
});

export const updateCakeSchema = createCakeSchema.partial();

export type ListCakesQuery = z.infer<typeof listCakesQuerySchema>;
export type CreateCakeInput = z.infer<typeof createCakeSchema>;
export type UpdateCakeInput = z.infer<typeof updateCakeSchema>;
