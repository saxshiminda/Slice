import { Outlet } from 'react-router-dom';
import { Header, Footer, ScrollToTop } from '@/components/layout';

export function AppShell() {
  return (
    <div className="min-h-screen bg-warm flex flex-col">
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
