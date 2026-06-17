import { z } from 'zod';

export const cartItemSchema = z.object({
  cakeId: z.string().min(1),
  variantName: z.string().optional(),
  quantity: z.number().int().min(1).max(99),
  unitPrice: z.number().positive(),
});

export const createShopOrderSchema = z.object({
  customerName: z.string().min(1).max(120),
  customerEmail: z.string().email(),
  customerPhone: z.string().max(30).optional(),
  fulfillmentType: z.enum(['PICKUP', 'DELIVERY']).default('PICKUP'),
  items: z.array(cartItemSchema).min(1),
  notes: z.string().max(500).optional(),
  pickupDate: z.string().optional(),
  pickupSlot: z.string().optional(),
  deliveryAddress: z.string().max(300).optional(),
  branchId: z.string().optional(),
});

export const updateShopOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'CONFIRMED', 'READY', 'DELIVERED', 'CANCELLED']),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type CreateShopOrderInput = z.infer<typeof createShopOrderSchema>;
export type UpdateShopOrderStatusInput = z.infer<typeof updateShopOrderStatusSchema>;
