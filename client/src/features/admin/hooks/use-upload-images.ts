import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ApiResponse } from '@/types';

interface UploadResponse {
  urls: string[];
}

export function useUploadImages() {
  return useMutation({
    mutationFn: (files: File[]) => {
      const formData = new FormData();
      for (const file of files) {
        formData.append('images', file);
      }
      return api.upload<ApiResponse<UploadResponse>>('/api/admin/upload', formData);
    },
  });
}
