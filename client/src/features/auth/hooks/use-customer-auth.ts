import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCustomerAuthStore } from '@/store/customer-auth';
import type { ApiResponse, CustomerAuthResponse } from '@/types';

export function useRegister() {
  const setAuth = useCustomerAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (input: { name: string; email: string; password: string; phone?: string }) =>
      api.post<ApiResponse<CustomerAuthResponse>>('/api/customers/register', input),
    onSuccess: (res) => {
      setAuth(res.data.token, res.data.customer);
    },
  });
}

export function useLogin() {
  const setAuth = useCustomerAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      api.post<ApiResponse<CustomerAuthResponse>>('/api/customers/login', input),
    onSuccess: (res) => {
      setAuth(res.data.token, res.data.customer);
    },
  });
}
