import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../ui/Header.jsx';
import Breadcrumbs from '../ui/Breadcrumbs.jsx';
import Footer from '../ui/Footer.jsx';

export default function RootLayout() {
  return (
    <div className="app-root">
      <Header />
      <Breadcrumbs />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

