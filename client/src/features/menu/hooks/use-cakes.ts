import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ApiResponse, Cake, CakeCategory } from '@/types';

interface UseCakesParams {
  category?: CakeCategory | 'All';
  featured?: boolean;
}

export function useCakes({ category, featured }: UseCakesParams = {}) {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.set('category', category);
  if (featured) params.set('featured', 'true');

  const queryString = params.toString();
  const path = `/api/cakes${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: ['cakes', { category, featured }],
    queryFn: () => api.get<ApiResponse<Cake[]>>(path),
    select: (res) => ({ cakes: res.data, total: res.meta?.total ?? 0 }),
  });
}
