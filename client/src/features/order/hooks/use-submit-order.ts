import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ApiResponse, Inquiry } from '@/types';

export interface OrderInput {
  name: string;
  email: string;
  eventType: string;
  eventDate: string;
  servings: string;
  cakeCategory: string;
  details: string;
}

function buildMessage(input: OrderInput): string {
  return [
    `Event type: ${input.eventType}`,
    `Event date: ${input.eventDate}`,
    `Number of servings: ${input.servings}`,
    `Cake category: ${input.cakeCategory}`,
    `Additional details: ${input.details || 'None provided'}`,
  ].join('\n');
}

export function useSubmitOrder() {
  return useMutation({
    mutationFn: (input: OrderInput) =>
      api.post<ApiResponse<Inquiry>>('/api/inquiries', {
        name: input.name,
        email: input.email,
        message: buildMessage(input),
      }),
  });
}
