import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../ui/Header.jsx';
import Breadcrumbs from '../ui/Breadcrumbs.jsx';
import Footer from '../ui/Footer.jsx';

export default function RootLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <div className="app-root">
      {!isAdminRoute && <Header />}
      {!isAdminRoute && <Breadcrumbs />}
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

