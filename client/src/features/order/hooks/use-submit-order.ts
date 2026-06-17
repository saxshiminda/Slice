import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ApiResponse, Order } from '@/types';

export interface OrderInput {
  name: string;
  email: string;
  eventType: string;
  eventDate: string;
  servings: string;
  categoryId: string;
  details: string;
}

export function useSubmitOrder() {
  return useMutation({
    mutationFn: (input: OrderInput) =>
      api.post<ApiResponse<Order>>('/api/orders', {
        name: input.name,
        email: input.email,
        eventType: input.eventType,
        eventDate: input.eventDate,
        servings: input.servings,
        categoryId: input.categoryId || undefined,
        details: input.details,
      }),
  });
}
