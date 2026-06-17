import { z } from 'zod';

export const updateDeliverySettingsSchema = z.object({
  minOrderAmount: z.number().min(0).optional(),
  deliveryFee: z.number().min(0).optional(),
  freeDeliveryThreshold: z.number().min(0).nullable().optional(),
  deliveryAvailable: z.boolean().optional(),
  pickupAvailable: z.boolean().optional(),
});

export type UpdateDeliverySettingsInput = z.infer<typeof updateDeliverySettingsSchema>;
