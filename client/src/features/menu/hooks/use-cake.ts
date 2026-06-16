import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ApiResponse, Cake } from '@/types';

export function useCake(id: string | undefined) {
  return useQuery({
    queryKey: ['cakes', id],
    queryFn: () => api.get<ApiResponse<Cake>>(`/api/cakes/${id}`),
    select: (res) => res.data,
    enabled: Boolean(id),
  });
}
