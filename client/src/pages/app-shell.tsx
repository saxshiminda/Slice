import { Outlet } from 'react-router-dom';
import { Header, Footer, ScrollToTop } from '@/components/layout';
import { CartDrawer } from '@/features/cart';

export function AppShell() {
  return (
    <div className="min-h-screen bg-warm flex flex-col">
      <ScrollToTop />
      <Header />
      <CartDrawer />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
