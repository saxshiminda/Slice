import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/pages/app-shell';
import { HomePage } from '@/pages/home-page';
import { MenuPage } from '@/pages/menu-page';
import { CakeDetailPage } from '@/pages/cake-detail-page';
import { AboutPage } from '@/pages/about-page';
import { ContactPage } from '@/pages/contact-page';
import { OrderPage } from '@/pages/order-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { ErrorPage } from '@/pages/error-page';
import { AdminProtectedRoute } from '@/components/admin-protected-route';
import { AdminLayout } from '@/pages/admin/admin-layout';
import { AdminLoginPage } from '@/pages/admin/admin-login-page';
import { AdminCakesPage } from '@/pages/admin/admin-cakes-page';
import { AdminCategoriesPage } from '@/pages/admin/admin-categories-page';
import { AdminOrdersPage } from '@/pages/admin/admin-orders-page';
import { AdminInquiriesPage } from '@/pages/admin/admin-inquiries-page';

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
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: <AdminProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="cakes" replace /> },
          { path: 'cakes', element: <AdminCakesPage /> },
          { path: 'categories', element: <AdminCategoriesPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'inquiries', element: <AdminInquiriesPage /> },
        ],
      },
    ],
  },
]);
