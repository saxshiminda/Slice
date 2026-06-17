import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ApiResponse } from '@/types';

interface CheckoutPayload {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  fulfillmentType: 'PICKUP' | 'DELIVERY';
  items: { cakeId: string; variantName?: string; quantity: number; unitPrice: number }[];
  notes?: string;
  pickupDate?: string;
  pickupSlot?: string;
  deliveryAddress?: string;
  branchId?: string;
}

interface CheckoutResult {
  orderId: string;
  redirectUrl: string;
}

export function useCheckout() {
  return useMutation({
    mutationFn: (payload: CheckoutPayload) =>
      api.post<ApiResponse<CheckoutResult>>('/api/shop/checkout', payload),
    onSuccess: (res) => {
      // Redirect to payment gateway (or mock callback)
      window.location.href = res.data.redirectUrl;
    },
  });
}
