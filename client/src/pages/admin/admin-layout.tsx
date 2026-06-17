import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { useT, useI18nStore, LOCALE_LABELS } from '@/i18n';
import type { Locale } from '@/i18n';

export function AdminLayout() {
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();
  const t = useT();
  const { locale, setLocale } = useI18nStore();

  const nav = [
    { to: '/admin/cakes', label: t.admin.nav.cakes },
    { to: '/admin/categories', label: t.admin.nav.categories },
    { to: '/admin/shop-orders', label: t.admin.nav.shopOrders },
    { to: '/admin/orders', label: t.admin.nav.bespokeOrders },
    { to: '/admin/inquiries', label: t.admin.nav.contact },
    { to: '/admin/branches', label: t.admin.nav.branches },
    { to: '/admin/delivery-settings', label: t.admin.nav.delivery },
    { to: '/admin/site-config', label: t.admin.nav.siteConfig },
  ];

  function handleLogout() {
    logout();
    navigate('/tmp');
  }

  return (
    <div className="h-screen flex overflow-hidden bg-warm">
      <aside className="w-56 flex-shrink-0 h-full bg-espresso text-warm flex flex-col">
        <div className="p-6 border-b border-warm/10">
          <Link
            to="/"
            className="font-display text-2xl text-warm hover:text-rose transition-colors"
          >
            Slice
          </Link>
          <p className="font-sans text-xs text-warm/40 mt-1 uppercase tracking-widest">Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm font-sans rounded transition-colors ${
                  isActive ? 'bg-rose text-white' : 'text-warm/70 hover:text-warm hover:bg-warm/10'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Language switcher */}
        <div className="px-4 py-3 border-t border-warm/10">
          <p className="font-sans text-xs text-warm/40 uppercase tracking-widest mb-2">
            {t.admin.layout.language}
          </p>
          <div className="flex gap-1">
            {(Object.keys(LOCALE_LABELS) as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`flex-1 px-2 py-1.5 text-xs font-sans font-medium rounded transition-colors ${
                  locale === l
                    ? 'bg-rose text-white'
                    : 'text-warm/50 hover:text-warm hover:bg-warm/10'
                }`}
              >
                {LOCALE_LABELS[l]}
              </button>
            ))}
          </div>
        </div>

        {/* User + logout */}
        <div className="p-4 border-t border-warm/10">
          <p className="text-xs text-warm/40 font-sans mb-2">
            {t.admin.layout.signedInAs} {username}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-sans text-warm/70 hover:text-warm transition-colors"
          >
            {t.admin.layout.logout}
          </button>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto flex justify-center">
        <div className="w-full max-w-5xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
