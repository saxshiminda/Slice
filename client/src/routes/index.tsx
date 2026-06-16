import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/pages/app-shell';
import { HomePage } from '@/pages/home-page';
import { MenuPage } from '@/pages/menu-page';
import { CakeDetailPage } from '@/pages/cake-detail-page';
import { AboutPage } from '@/pages/about-page';
import { ContactPage } from '@/pages/contact-page';
import { OrderPage } from '@/pages/order-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { ErrorPage } from '@/pages/error-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'menu/:id', element: <CakeDetailPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'order', element: <OrderPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
