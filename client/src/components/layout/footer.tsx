import { Link } from 'react-router-dom';
import { useT } from '@/i18n';

export function Footer() {
  const t = useT();

  return (
    <footer className="bg-espresso text-warm/70">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <Link
              to="/"
              className="font-display text-3xl text-warm hover:text-rose transition-colors"
            >
              Slice
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-warm/50 max-w-xs">{t.footer.tagline}</p>
          </div>

          <div>
            <h3 className="font-sans text-xs font-medium tracking-widest uppercase text-warm/40 mb-4">
              {t.footer.navigateLabel}
            </h3>
            <nav className="flex flex-col gap-3">
              {[
                { to: '/', label: t.footer.home },
                { to: '/menu', label: t.nav.menu },
                { to: '/about', label: t.nav.about },
                { to: '/contact', label: t.nav.contact },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="text-sm hover:text-warm transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-sans text-xs font-medium tracking-widest uppercase text-warm/40 mb-4">
              {t.footer.contactLabel}
            </h3>
            <p className="text-sm leading-relaxed text-warm/50">{t.footer.contactDesc}</p>
            <Link
              to="/contact"
              className="inline-block mt-5 text-sm font-medium text-rose hover:text-rose-light transition-colors"
            >
              {t.footer.contactCta}
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-warm/10 flex flex-wrap items-center justify-between gap-4 text-xs text-warm/30">
          <span>
            © {new Date().getFullYear()} Slice. {t.footer.rights}
          </span>
          <nav className="flex gap-4">
            <Link to="/privacy" className="hover:text-warm/60 transition-colors">
              {t.footer.privacy}
            </Link>
            <Link to="/delivery" className="hover:text-warm/60 transition-colors">
              {t.footer.delivery}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
