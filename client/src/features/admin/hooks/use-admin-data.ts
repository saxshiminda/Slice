import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ApiResponse, Cake, CategoryWithCount } from '@/types';

export interface CakeInput {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  featured: boolean;
  available: boolean;
}

export function useAdminCakes() {
  return useQuery({
    queryKey: ['admin', 'cakes'],
    queryFn: () => api.get<ApiResponse<Cake[]>>('/api/admin/cakes'),
    select: (res) => res.data,
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => api.get<ApiResponse<CategoryWithCount[]>>('/api/admin/categories'),
    select: (res) => res.data,
  });
}

export function useCreateCake() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CakeInput) => api.post<ApiResponse<Cake>>('/api/admin/cakes', input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'cakes'] });
      void qc.invalidateQueries({ queryKey: ['cakes'] });
    },
  });
}

export function useUpdateCake() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CakeInput> }) =>
      api.patch<ApiResponse<Cake>>(`/api/admin/cakes/${id}`, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'cakes'] });
      void qc.invalidateQueries({ queryKey: ['cakes'] });
    },
  });
}

export function useDeleteCake() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<ApiResponse<{ success: boolean }>>(`/api/admin/cakes/${id}`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'cakes'] });
      void qc.invalidateQueries({ queryKey: ['cakes'] });
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      api.post<ApiResponse<CategoryWithCount>>('/api/admin/categories', { name }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'categories'] });
      void qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      api.patch<ApiResponse<CategoryWithCount>>(`/api/admin/categories/${id}`, { name }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'categories'] });
      void qc.invalidateQueries({ queryKey: ['categories'] });
      void qc.invalidateQueries({ queryKey: ['admin', 'cakes'] });
      void qc.invalidateQueries({ queryKey: ['cakes'] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<ApiResponse<{ success: boolean }>>(`/api/admin/categories/${id}`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'categories'] });
      void qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
