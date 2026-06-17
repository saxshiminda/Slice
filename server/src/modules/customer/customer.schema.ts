import { z } from 'zod';

export const registerCustomerSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(72),
  phone: z.string().max(30).optional(),
});

export const loginCustomerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateCustomerSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  phone: z.string().max(30).nullable().optional(),
});

export type RegisterCustomerInput = z.infer<typeof registerCustomerSchema>;
export type LoginCustomerInput = z.infer<typeof loginCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
