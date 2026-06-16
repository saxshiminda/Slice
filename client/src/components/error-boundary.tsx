import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center bg-warm">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24 text-center w-full">
            <h1 className="font-display text-4xl text-espresso mb-4">Something went wrong</h1>
            <p className="font-sans text-espresso/60 max-w-md mx-auto mb-10 leading-relaxed">
              The app ran into an unexpected problem. Refresh the page or return home.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-6 py-3 text-sm font-sans font-medium bg-rose text-white hover:bg-rose-dark transition-colors"
              >
                Refresh
              </button>
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 text-sm font-sans font-medium bg-cream text-espresso border border-rose/30 hover:border-rose hover:bg-warm transition-colors"
              >
                Go home
              </a>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
