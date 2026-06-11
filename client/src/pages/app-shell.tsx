import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout';
import { Footer } from '@/components/layout';

export function AppShell() {
  return (
    <div className="min-h-screen bg-warm flex flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
