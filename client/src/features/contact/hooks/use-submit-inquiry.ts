import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ApiResponse, Inquiry } from '@/types';

export interface InquiryInput {
  name: string;
  email: string;
  message: string;
}

export function useSubmitInquiry() {
  return useMutation({
    mutationFn: (input: InquiryInput) => api.post<ApiResponse<Inquiry>>('/api/inquiries', input),
  });
}
