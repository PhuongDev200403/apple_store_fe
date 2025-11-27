import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../shared/layouts/RootLayout.jsx';
import ProtectedRoute from '../shared/components/ProtectedRoute.jsx';

// Lazy pages (can be expanded later)
const HomePage = lazy(() => import('../shared/pages/HomePage.jsx'));
const AboutPage = lazy(() => import('../shared/pages/about/AboutPage.jsx'));
const NewsPage = lazy(() => import('../shared/pages/news/NewsPage.jsx'));
const NewsDetailPage = lazy(() => import('../shared/pages/news/NewsDetailPage.jsx'));
const ContactPage = lazy(() => import('../shared/pages/contact/ContactPage.jsx'));
const PolicyPage = lazy(() => import('../shared/pages/policy/PolicyPage.jsx'));
const AccountPage = lazy(() => import('../shared/pages/account/AccountPage.jsx'));
const UserProfilePage = lazy(() => import('../shared/pages/profile/UserProfilePage.jsx'));
const WishlistPage = lazy(() => import('../shared/pages/wishlist/WishlistPage.jsx'));
const CartPage = lazy(() => import('../shared/pages/cart/CartPage.jsx'));
const CheckoutPage = lazy(() => import('../shared/pages/checkout/CheckoutPage.jsx'));
const OrdersPage = lazy(() => import('../shared/pages/orders/OrdersPage.jsx'));
const OrderDetailPage = lazy(() => import('../shared/pages/orders/OrderDetailPage.jsx'));
const CategoryPage = lazy(() => import('../shared/pages/category/CategoryPage.jsx'));
const LoginPage = lazy(() => import('../shared/pages/auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../shared/pages/auth/RegisterPage.jsx'));
const AdminPage = lazy(() => import('../shared/pages/admin/AdminPage.jsx'));
const ProductPage = lazy(() => import('../shared/pages/product/ProductPage.jsx'));
const ProductVariantsPage = lazy(() => import('../shared/pages/product/ProductVariantsPage.jsx'));
const ProductDetailPage = lazy(() => import('../shared/pages/productDetail/ProductDetail.jsx'));
const SearchResultsPage = lazy(() => import('../shared/pages/search/SearchResultsPage.jsx'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'gioi-thieu', element: <AboutPage /> },
      { path: 'tin-tuc', element: <NewsPage /> },
      { path: 'tin-tuc/:newsId', element: <NewsDetailPage /> },
      { path: 'lien-he', element: <ContactPage /> },
      { path: 'chinh-sach', element: <PolicyPage /> },
      { path: 'tai-khoan', element: <ProtectedRoute><UserProfilePage /></ProtectedRoute> },
      { path: 'dang-nhap', element: <LoginPage /> },
      { path: 'dang-ky', element: <RegisterPage /> },
      { path: 'wishlist', element: <ProtectedRoute><WishlistPage /></ProtectedRoute> },
      { path: 'admin', element: <ProtectedRoute><AdminPage /></ProtectedRoute> },
      { path: 'gio-hang', element: <ProtectedRoute><CartPage /></ProtectedRoute> },
      { path: 'thanh-toan', element: <ProtectedRoute><CheckoutPage /></ProtectedRoute> },
      { path: 'don-hang', element: <ProtectedRoute><OrdersPage /></ProtectedRoute> },
      { path: 'don-hang/:orderId', element: <ProtectedRoute><OrderDetailPage /></ProtectedRoute> },
      { path: 'danh-muc/:categoryId', element: <CategoryPage /> },
      { path: 'danh-muc/:categoryId/series/:seriesId', element: <CategoryPage /> },
      { path: 'tim-kiem', element: <SearchResultsPage /> },
      // Product listing by category
      { path: 'san-pham', element: <ProductPage /> },
      { path: 'danh-muc/:categoryId/san-pham', element: <ProductPage /> },
      // Product detail: /san-pham/categoryId/variantId
      { path: 'san-pham/:category/:productId', element: <ProductDetailPage /> },
      // Product variants listing (click from menu)
      { path: 'product/:productSlug/variants', element: <ProductVariantsPage /> },
    ],
  },
]);

export default router;

