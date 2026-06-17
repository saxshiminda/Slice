import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ApiResponse, Branch } from '@/types';

export function useBranches() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: () => api.get<ApiResponse<Branch[]>>('/api/branches'),
    select: (res) => res.data,
    staleTime: 5 * 60 * 1000,
  });
}
