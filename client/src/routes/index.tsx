import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/pages/app-shell';
import { HomePage } from '@/pages/home-page';
import { MenuPage } from '@/pages/menu-page';
import { AboutPage } from '@/pages/about-page';
import { ContactPage } from '@/pages/contact-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
]);
