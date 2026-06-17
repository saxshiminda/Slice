import { z } from 'zod';

export const createOrderSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  eventType: z.string().min(1),
  eventDate: z.string().min(1),
  servings: z.string().min(1),
  categoryId: z.string().optional(),
  details: z.string().max(2000).default(''),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
