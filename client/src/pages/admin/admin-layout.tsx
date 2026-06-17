import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const nav = [
  { to: '/admin/cakes', label: 'Cakes' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/inquiries', label: 'Contact' },
];

export function AdminLayout() {
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
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

        <nav className="flex-1 p-4 space-y-1">
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

        <div className="p-4 border-t border-warm/10">
          <p className="text-xs text-warm/40 font-sans mb-2">Signed in as {username}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-sans text-warm/70 hover:text-warm transition-colors"
          >
            Log out
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
