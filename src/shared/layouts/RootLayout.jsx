import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../ui/Header.jsx';
import Breadcrumbs from '../ui/Breadcrumbs.jsx';
import Footer from '../ui/Footer.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function RootLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <ErrorBoundary>
      <div className="app-root">
        {!isAdminRoute && <Header />}
        {!isAdminRoute && <Breadcrumbs />}
        <main>
          <Suspense fallback={
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
              fontSize: '1.2rem',
              color: '#667eea'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '4px solid #f3f4f6',
                  borderTopColor: '#667eea',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }}></div>
                <p>Đang tải...</p>
              </div>
            </div>
          }>
            <Outlet />
          </Suspense>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </ErrorBoundary>
  );
}

