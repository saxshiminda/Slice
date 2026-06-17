import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

export function AdminProtectedRoute() {
  const token = useAuthStore((s) => s.token);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
