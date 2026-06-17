import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import type { ApiResponse, LoginResponse } from '@/types';

interface LoginInput {
  username: string;
  password: string;
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (input: LoginInput) =>
      api.post<ApiResponse<LoginResponse>>('/api/auth/login', input),
    onSuccess: (res) => {
      setAuth(res.data.token, res.data.username);
    },
  });
}
