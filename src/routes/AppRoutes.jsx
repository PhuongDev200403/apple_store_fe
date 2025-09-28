import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../shared/layouts/RootLayout.jsx';

// Lazy pages (can be expanded later)
const HomePage = lazy(() => import('../shared/pages/HomePage.jsx'));
const AboutPage = lazy(() => import('../shared/pages/about/AboutPage.jsx'));
const NewsPage = lazy(() => import('../shared/pages/news/NewsPage.jsx'));
const ContactPage = lazy(() => import('../shared/pages/contact/ContactPage.jsx'));
const PolicyPage = lazy(() => import('../shared/pages/policy/PolicyPage.jsx'));
const AccountPage = lazy(() => import('../shared/pages/account/AccountPage.jsx'));
const CartPage = lazy(() => import('../shared/pages/cart/CartPage.jsx'));
const CategoryPage = lazy(() => import('../shared/pages/category/CategoryPage.jsx'));
const LoginPage = lazy(() => import('../shared/pages/auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../shared/pages/auth/RegisterPage.jsx'));
const AdminPage = lazy(() => import('../shared/pages/admin/AdminPage.jsx'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'gioi-thieu', element: <AboutPage /> },
      { path: 'tin-tuc', element: <NewsPage /> },
      { path: 'lien-he', element: <ContactPage /> },
      { path: 'chinh-sach', element: <PolicyPage /> },
      { path: 'tai-khoan', element: <AccountPage /> },
      { path: 'dang-nhap', element: <LoginPage /> },
      { path: 'dang-ky', element: <RegisterPage /> },
      { path: 'wishlist', element: <AccountPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'gio-hang', element: <CartPage /> },
      { path: 'danh-muc/:categoryId', element: <CategoryPage /> },
      { path: 'danh-muc/:categoryId/series/:seriesId', element: <CategoryPage /> },
    ],
  },
]);

export default router;

