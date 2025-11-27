import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '3rem',
            maxWidth: '600px',
            textAlign: 'center',
            boxShadow: '0 10px 50px rgba(0, 0, 0, 0.15)'
          }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</h1>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1f2937', marginBottom: '1rem' }}>
              Oops! Có lỗi xảy ra
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem', lineHeight: '1.6' }}>
              {this.state.error?.message || 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link 
                to="/"
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}
              >
                Về trang chủ
              </Link>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '1rem 2rem',
                  background: 'white',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Tải lại trang
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
