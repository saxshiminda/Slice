import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ApiResponse, Category } from '@/types';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<ApiResponse<Category[]>>('/api/categories'),
    select: (res) => res.data,
  });
}
