import { z } from 'zod';

export const listCakesQuerySchema = z.object({
  category: z.enum(['Wedding', 'Birthday', 'Seasonal', 'Custom']).optional(),
  featured: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
});

export type ListCakesQuery = z.infer<typeof listCakesQuerySchema>;
