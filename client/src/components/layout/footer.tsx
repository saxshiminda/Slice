import { Link } from 'react-router-dom';

export function Footer() {
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
            <p className="mt-4 text-sm leading-relaxed text-warm/50 max-w-xs">
              Artisan cakes crafted with intention. Every layer made from scratch, every detail
              considered.
            </p>
          </div>

          <div>
            <h3 className="font-sans text-xs font-medium tracking-widest uppercase text-warm/40 mb-4">
              Navigate
            </h3>
            <nav className="flex flex-col gap-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/menu', label: 'Menu' },
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="text-sm hover:text-warm transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-sans text-xs font-medium tracking-widest uppercase text-warm/40 mb-4">
              Get in Touch
            </h3>
            <p className="text-sm leading-relaxed text-warm/50">
              Custom orders, wedding consultations, and seasonal collections — we would love to hear
              from you.
            </p>
            <Link
              to="/contact"
              className="inline-block mt-5 text-sm font-medium text-rose hover:text-rose-light transition-colors"
            >
              Send an enquiry →
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-warm/10 text-xs text-warm/30">
          © {new Date().getFullYear()} Slice. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
