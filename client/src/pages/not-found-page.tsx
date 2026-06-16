import { Link } from 'react-router-dom';

const btnPrimary =
  'inline-flex items-center px-6 py-3 text-sm font-sans font-medium bg-rose text-white hover:bg-rose-dark transition-colors';
const btnSecondary =
  'inline-flex items-center px-6 py-3 text-sm font-sans font-medium bg-cream text-espresso border border-rose/30 hover:border-rose hover:bg-warm transition-colors';

export function NotFoundPage() {
  return (
    <main className="min-h-screen pt-16 lg:pt-20 flex items-center">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24 text-center w-full">
        <p className="font-display text-8xl text-rose/30 mb-4">404</p>
        <h1 className="font-display text-4xl lg:text-5xl text-espresso mb-4">Page not found</h1>
        <p className="font-sans text-espresso/60 max-w-md mx-auto mb-10 leading-relaxed">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/" className={btnPrimary}>
            Go home
          </Link>
          <Link to="/menu" className={btnSecondary}>
            View menu
          </Link>
        </div>
      </div>
    </main>
  );
}
