import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ApiResponse, Inquiry, Order } from '@/types';

export function useAdminOrders() {
  return useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => api.get<ApiResponse<Order[]>>('/api/admin/orders'),
    select: (res) => res.data,
  });
}

export function useAdminInquiries() {
  return useQuery({
    queryKey: ['admin', 'inquiries'],
    queryFn: () => api.get<ApiResponse<Inquiry[]>>('/api/admin/inquiries'),
    select: (res) => res.data,
  });
}
