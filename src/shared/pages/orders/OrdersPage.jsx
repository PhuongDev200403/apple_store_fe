import { useState, useEffect } from 'react';
import { FaShoppingBag, FaArrowLeft, FaBox, FaCheckCircle, FaClock, FaTruck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../utils/api/orderApi';
import './OrdersPage.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyOrders();
      console.log('Orders data received:', data);
      console.log('Is array?', Array.isArray(data));
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError(err.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: { label: 'Chờ xử lý', icon: <FaClock />, color: '#f59e0b' },
      PROCESSING: { label: 'Đang xử lý', icon: <FaBox />, color: '#3b82f6' },
      SHIPPING: { label: 'Đang giao', icon: <FaTruck />, color: '#8b5cf6' },
      SHIPPED: { label: 'Đã giao', icon: <FaTruck />, color: '#8b5cf6' },
      COMPLETED: { label: 'Hoàn thành', icon: <FaCheckCircle />, color: '#10b981' },
      CANCELLED: { label: 'Đã hủy', icon: <FaTimes />, color: '#ef4444' }
    };
    return statusMap[status] || { label: status, icon: <FaClock />, color: '#6b7280' };
  };

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="orders-loading">
            <div className="spinner"></div>
            <p>Đang tải đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="orders-error">
            <p className="error-message">{error}</p>
            <button onClick={fetchOrders} className="btn btn-primary">
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
        <div className="orders-header">
          <Link to="/" className="back-link">
            <FaArrowLeft />
            <span>Quay lại</span>
          </Link>
          <h1 className="orders-title">
            <FaShoppingBag />
            Đơn hàng của tôi
            {orders.length > 0 && <span className="orders-count">({orders.length})</span>}
          </h1>
        </div>

        {/* Filter Tabs */}
        <div className="orders-filters">
          <button 
            className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            Tất cả
          </button>
          <button 
            className={`filter-btn ${filter === 'PENDING' ? 'active' : ''}`}
            onClick={() => setFilter('PENDING')}
          >
            Chờ xử lý
          </button>
          <button 
            className={`filter-btn ${filter === 'PROCESSING' ? 'active' : ''}`}
            onClick={() => setFilter('PROCESSING')}
          >
            Đang xử lý
          </button>
          <button 
            className={`filter-btn ${filter === 'SHIPPING' ? 'active' : ''}`}
            onClick={() => setFilter('SHIPPING')}
          >
            Đang giao
          </button>
          <button 
            className={`filter-btn ${filter === 'COMPLETED' ? 'active' : ''}`}
            onClick={() => setFilter('COMPLETED')}
          >
            Hoàn thành
          </button>
          <button 
            className={`filter-btn ${filter === 'CANCELLED' ? 'active' : ''}`}
            onClick={() => setFilter('CANCELLED')}
          >
            Đã hủy
          </button>
        </div>

        {/* Orders List */}
        <div className="orders-content">
          {filteredOrders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-orders-icon">
                <FaShoppingBag />
              </div>
              <h2>Chưa có đơn hàng</h2>
              <p>Bạn chưa có đơn hàng nào {filter !== 'ALL' && `ở trạng thái "${getStatusInfo(filter).label}"`}.</p>
              <Link to="/" className="btn btn-primary">
                Bắt đầu mua sắm
              </Link>
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <div key={order.orderId} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <span className="order-id">Đơn hàng #{order.orderId}</span>
                        <span className="order-date">{formatDate(order.orderDate)}</span>
                      </div>
                      <div className="order-status" style={{ color: statusInfo.color }}>
                        {statusInfo.icon}
                        <span>{statusInfo.label}</span>
                      </div>
                    </div>

                    <div className="order-body">
                      <div className="order-detail">
                        <div className="detail-row">
                          <span className="detail-label">Người nhận:</span>
                          <span className="detail-value">{order.username}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Số điện thoại:</span>
                          <span className="detail-value">{order.phone}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Địa chỉ:</span>
                          <span className="detail-value">{order.shippingAddress}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Phương thức:</span>
                          <span className="detail-value">{order.shippingMethod}</span>
                        </div>
                        {order.note && (
                          <div className="detail-row">
                            <span className="detail-label">Ghi chú:</span>
                            <span className="detail-value">{order.note}</span>
                          </div>
                        )}
                      </div>

                      <div className="order-total">
                        <span className="total-label">Tổng tiền:</span>
                        <span className="total-amount">{formatPrice(order.totalAmount)}</span>
                      </div>
                    </div>

                    <div className="order-footer">
                      <Link 
                        to={`/don-hang/${order.orderId}`}
                        className="btn btn-primary btn-sm"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
