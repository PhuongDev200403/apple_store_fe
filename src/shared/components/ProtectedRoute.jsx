import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Chưa đăng nhập -> chuyển sang trang đăng nhập
    return <Navigate to="/dang-nhap" replace />;
  }
  
  return children;
}
