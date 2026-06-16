import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError();

  let title = 'Something went wrong';
  let message = 'An unexpected error occurred. Please try again.';

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? 'Page not found' : `Error ${error.status}`;
    message = error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <main className="min-h-screen pt-16 lg:pt-20 flex items-center bg-warm">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24 text-center w-full">
        <h1 className="font-display text-4xl lg:text-5xl text-espresso mb-4">{title}</h1>
        <p className="font-sans text-espresso/60 max-w-md mx-auto mb-10 leading-relaxed">
          {message}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 text-sm font-sans font-medium bg-rose text-white hover:bg-rose-dark transition-colors"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 text-sm font-sans font-medium bg-cream text-espresso border border-rose/30 hover:border-rose hover:bg-warm transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
