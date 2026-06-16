import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUiStore } from '@/store/ui';

const navLinks = [
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Header() {
  const { mobileNavOpen, toggleMobileNav, closeMobileNav } = useUiStore();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const opaque = !isHome || scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        opaque ? 'bg-warm/95 backdrop-blur-sm border-b border-espresso/8' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link
            to="/"
            onClick={closeMobileNav}
            className={`font-display text-2xl lg:text-3xl tracking-tight transition-colors ${opaque ? 'text-espresso hover:text-rose' : 'text-warm hover:text-rose'}`}
          >
            Slice
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-sans font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'text-rose'
                      : opaque
                        ? 'text-espresso/70 hover:text-espresso'
                        : 'text-warm/80 hover:text-warm'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/order"
              className="ml-4 px-5 py-2.5 text-sm font-sans font-medium bg-rose text-white hover:bg-rose-dark transition-colors"
            >
              Order Now
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={toggleMobileNav}
            className="md:hidden p-2 text-espresso"
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="block w-5 h-0.5 bg-current mb-1.5 transition-all" />
            <span className="block w-5 h-0.5 bg-current mb-1.5 transition-all" />
            <span className="block w-5 h-0.5 bg-current transition-all" />
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="md:hidden bg-warm border-t border-espresso/8 px-6 pb-6 pt-4">
          <nav className="flex flex-col gap-4">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMobileNav}
                className={({ isActive }) =>
                  `text-base font-sans font-medium tracking-wide py-1 transition-colors ${
                    isActive ? 'text-rose' : 'text-espresso/70'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/order"
              onClick={closeMobileNav}
              className="mt-2 px-5 py-3 text-sm font-sans font-medium text-center bg-rose text-white"
            >
              Order Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
