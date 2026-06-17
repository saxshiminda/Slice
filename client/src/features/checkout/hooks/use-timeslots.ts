import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ApiResponse, TimeSlot } from '@/types';

export function useTimeslots() {
  return useQuery({
    queryKey: ['timeslots'],
    queryFn: () => api.get<ApiResponse<TimeSlot[]>>('/api/timeslots'),
    select: (res) => res.data,
    staleTime: 5 * 60 * 1000,
  });
}
