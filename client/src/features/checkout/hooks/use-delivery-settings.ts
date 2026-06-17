import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ApiResponse, DeliverySettings } from '@/types';

export function useDeliverySettings() {
  return useQuery({
    queryKey: ['delivery-settings'],
    queryFn: () => api.get<ApiResponse<DeliverySettings>>('/api/delivery-settings'),
    select: (res) => res.data,
    staleTime: 5 * 60 * 1000,
  });
}
