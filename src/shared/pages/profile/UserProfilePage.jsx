import { useState, useEffect } from 'react';
import { FaUser, FaArrowLeft, FaEnvelope, FaPhone, FaCalendar, FaShieldAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getMyInfo } from '../../utils/api/userApi';
import './UserProfilePage.css';

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyInfo();
      setUser(data);
    } catch (err) {
      console.error('Error loading user info:', err);
      setError(err.message || 'Không thể tải thông tin tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="profile-loading">
            <div className="spinner"></div>
            <p>Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="profile-error">
            <p className="error-message">{error}</p>
            <button onClick={fetchUserInfo} className="btn btn-primary">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="profile-header">
          <Link to="/" className="back-link">
            <FaArrowLeft />
            <span>Quay lại</span>
          </Link>
          <h1 className="profile-title">
            <FaUser />
            Thông tin tài khoản
          </h1>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-circle">
                <FaUser />
              </div>
              <h2 className="user-name">{user?.username || 'N/A'}</h2>
              <span className="user-role" style={{ 
                background: user?.role === 'ADMIN' ? '#ef4444' : '#10b981',
                color: 'white'
              }}>
                {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
              </span>
            </div>

            <div className="profile-info">
              <div className="info-section">
                <h3 className="section-title">Thông tin cá nhân</h3>
                
                <div className="info-row">
                  <div className="info-icon">
                    <FaUser />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Họ và tên</span>
                    <span className="info-value">{user?.username || 'N/A'}</span>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-icon">
                    <FaEnvelope />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user?.email || 'N/A'}</span>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-icon">
                    <FaPhone />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Số điện thoại</span>
                    <span className="info-value">{user?.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-icon">
                    <FaShieldAlt />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Vai trò</span>
                    <span className="info-value">
                      {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3 className="section-title">Thông tin tài khoản</h3>
                
                <div className="info-row">
                  <div className="info-icon">
                    <FaCalendar />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Ngày tạo</span>
                    <span className="info-value">{formatDate(user?.createAt)}</span>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-icon">
                    <FaCalendar />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Cập nhật lần cuối</span>
                    <span className="info-value">{formatDate(user?.updateAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button className="btn btn-primary">
                Chỉnh sửa thông tin
              </button>
              <button className="btn btn-secondary">
                Đổi mật khẩu
              </button>
            </div>
          </div>

          <div className="quick-links">
            <h3>Liên kết nhanh</h3>
            <Link to="/don-hang" className="quick-link-item">
              <span>Đơn hàng của tôi</span>
              <span>→</span>
            </Link>
            <Link to="/gio-hang" className="quick-link-item">
              <span>Giỏ hàng</span>
              <span>→</span>
            </Link>
            <Link to="/wishlist" className="quick-link-item">
              <span>Danh sách yêu thích</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
