import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUiStore } from '@/store/ui';
import { useCartStore } from '@/store/cart';
import { useCustomerAuthStore } from '@/store/customer-auth';
import { useT, useI18nStore, LOCALE_LABELS } from '@/i18n';
import type { Locale } from '@/i18n';
import { AuthModal } from '@/features/auth';

export function Header() {
  const { mobileNavOpen, toggleMobileNav, closeMobileNav } = useUiStore();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const { toggleCart, itemCount } = useCartStore();
  const { customer, logout } = useCustomerAuthStore();
  const t = useT();
  const { locale, setLocale } = useI18nStore();

  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const opaque = !isHome || scrolled;
  const count = itemCount();

  const navLinks = [
    { to: '/menu', label: t.nav.menu },
    { to: '/about', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <>
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

              {/* Language switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu((v) => !v)}
                  className={`text-xs font-sans font-medium tracking-widest uppercase transition-colors ${
                    opaque ? 'text-espresso/50 hover:text-espresso' : 'text-warm/60 hover:text-warm'
                  }`}
                >
                  {LOCALE_LABELS[locale]}
                </button>
                {showLangMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-warm border border-espresso/10 shadow-lg min-w-[64px]">
                    {(Object.keys(LOCALE_LABELS) as Locale[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setLocale(l);
                          setShowLangMenu(false);
                        }}
                        className={`block w-full px-4 py-2 text-xs font-sans text-left transition-colors ${
                          locale === l
                            ? 'text-rose bg-cream'
                            : 'text-espresso/70 hover:text-espresso hover:bg-cream'
                        }`}
                      >
                        {LOCALE_LABELS[l]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart icon */}
              <button
                onClick={toggleCart}
                className={`relative p-1 transition-colors ${
                  opaque ? 'text-espresso/70 hover:text-espresso' : 'text-warm/80 hover:text-warm'
                }`}
                aria-label={t.nav.cart}
              >
                <CartIcon />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-sans font-medium bg-rose text-white rounded-full flex items-center justify-center">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </button>

              {/* Account */}
              {customer ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/account"
                    className={`text-sm font-sans font-medium transition-colors ${
                      opaque
                        ? 'text-espresso/70 hover:text-espresso'
                        : 'text-warm/80 hover:text-warm'
                    }`}
                  >
                    {customer.name.split(' ')[0]}
                  </Link>
                  <button
                    onClick={logout}
                    className={`text-xs font-sans transition-colors ${
                      opaque
                        ? 'text-espresso/40 hover:text-espresso/70'
                        : 'text-warm/50 hover:text-warm'
                    }`}
                  >
                    {t.nav.signOut}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className={`text-sm font-sans font-medium transition-colors ${
                    opaque ? 'text-espresso/70 hover:text-espresso' : 'text-warm/80 hover:text-warm'
                  }`}
                >
                  {t.nav.signIn}
                </button>
              )}

              <Link
                to="/order"
                className="ml-2 px-5 py-2.5 text-sm font-sans font-medium bg-rose text-white hover:bg-rose-dark transition-colors"
              >
                {t.nav.orderNow}
              </Link>
            </nav>

            {/* Mobile: cart + hamburger */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={toggleCart}
                className="relative p-1 text-espresso"
                aria-label={t.nav.cart}
              >
                <CartIcon />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-sans font-medium bg-rose text-white rounded-full flex items-center justify-center">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </button>
              <button
                onClick={toggleMobileNav}
                className="p-2 text-espresso"
                aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              >
                <span className="block w-5 h-0.5 bg-current mb-1.5" />
                <span className="block w-5 h-0.5 bg-current mb-1.5" />
                <span className="block w-5 h-0.5 bg-current" />
              </button>
            </div>
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

              {/* Language switcher mobile */}
              <div className="flex gap-3 pt-2 border-t border-espresso/10">
                {(Object.keys(LOCALE_LABELS) as Locale[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    className={`text-xs font-sans tracking-widest uppercase ${
                      locale === l ? 'text-rose' : 'text-espresso/40'
                    }`}
                  >
                    {LOCALE_LABELS[l]}
                  </button>
                ))}
              </div>

              {customer ? (
                <div className="flex items-center justify-between border-t border-espresso/10 pt-2">
                  <Link
                    to="/account"
                    onClick={closeMobileNav}
                    className="text-sm font-sans text-espresso/70"
                  >
                    {t.account.title}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileNav();
                    }}
                    className="text-xs font-sans text-espresso/40"
                  >
                    {t.nav.signOut}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    closeMobileNav();
                  }}
                  className="text-base font-sans font-medium text-espresso/70 py-1 text-left"
                >
                  {t.nav.signIn}
                </button>
              )}

              <Link
                to="/order"
                onClick={closeMobileNav}
                className="mt-2 px-5 py-3 text-sm font-sans font-medium text-center bg-rose text-white"
              >
                {t.nav.orderNow}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}

function CartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
