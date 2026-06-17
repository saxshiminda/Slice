import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useLogin } from '@/features/admin';
import { useAuthStore } from '@/store/auth';

export function AdminLoginPage() {
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useLogin();

  if (token) {
    return <Navigate to="/admin/cakes" replace />;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    login.mutate(
      { username, password },
      {
        onSuccess: () => navigate('/admin/cakes'),
        onError: () => setError('Invalid username or password'),
      }
    );
  }

  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-warm p-8">
        <h1 className="font-display text-3xl text-espresso mb-1">Slice Admin</h1>
        <p className="font-sans text-sm text-espresso/50 mb-8">Sign in to manage the bakery</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" loading={login.isPending} className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
