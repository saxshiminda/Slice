import { useState } from 'react';
import { useRegister, useLogin } from '../hooks/use-customer-auth';
import { useT } from '@/i18n';
import { Button } from '@/components/ui';

interface Props {
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export function AuthModal({ onClose, defaultMode = 'login' }: Props) {
  const t = useT();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');

  const register = useRegister();
  const login = useLogin();

  const isLoading = register.isPending || login.isPending;

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'register') {
        await register.mutateAsync({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
        });
      } else {
        await login.mutateAsync({ email: form.email, password: form.password });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.error);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-espresso/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-warm w-full max-w-sm p-8 shadow-2xl">
          <h2 className="font-display text-3xl text-espresso mb-6">
            {mode === 'login' ? t.auth.signIn : t.auth.register}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-espresso/50 mb-1">
                    {t.auth.name}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    className="w-full border border-espresso/20 bg-cream px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-espresso/50 mb-1">
                    {t.auth.phone}
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    className="w-full border border-espresso/20 bg-cream px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-espresso/50 mb-1">
                {t.auth.email}
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className="w-full border border-espresso/20 bg-cream px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose"
              />
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-espresso/50 mb-1">
                {t.auth.password}
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                className="w-full border border-espresso/20 bg-cream px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose"
              />
            </div>

            {error && <p className="font-sans text-sm text-red-600">{error}</p>}

            <Button type="submit" loading={isLoading} className="w-full mt-2">
              {mode === 'login' ? t.auth.signIn : t.auth.register}
            </Button>
          </form>

          <p className="font-sans text-sm text-espresso/50 mt-5 text-center">
            {mode === 'login' ? t.auth.noAccount : t.auth.hasAccount}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-rose hover:text-rose-dark underline"
            >
              {mode === 'login' ? t.auth.register : t.auth.signIn}
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
