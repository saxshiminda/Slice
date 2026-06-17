import { z } from 'zod';

export const createBranchSchema = z.object({
  name: z.string().min(1).max(120),
  address: z.string().min(1).max(300),
  phone: z.string().max(30).optional(),
  pickupAvailable: z.boolean().default(true),
  active: z.boolean().default(true),
});

export const updateBranchSchema = createBranchSchema.partial();

export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
