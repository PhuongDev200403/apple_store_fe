import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCheckCircle, 
  FaClock, 
  FaTruck, 
  FaTimes,
  FaPrint,
  FaDownload
} from 'react-icons/fa';
import { getOrderById, cancelOrder } from '../../utils/api/orderApi';
import './OrderDetailPage.css';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      console.error('Error loading order detail:', err);
      setError(err.response?.data?.message || 'Không thể tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      setCancelling(true);
      await cancelOrder(orderId);
      alert('Đã hủy đơn hàng thành công');
      fetchOrderDetail();
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert(err.response?.data?.message || 'Không thể hủy đơn hàng');
    } finally {
      setCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
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
      PROCESSING: { label: 'Đang xử lý', icon: <FaClock />, color: '#3b82f6' },
      SHIPPING: { label: 'Đang giao', icon: <FaTruck />, color: '#8b5cf6' },
      COMPLETED: { label: 'Hoàn thành', icon: <FaCheckCircle />, color: '#10b981' },
      CANCELLED: { label: 'Đã hủy', icon: <FaTimes />, color: '#ef4444' }
    };
    return statusMap[status] || { label: status, icon: <FaClock />, color: '#6b7280' };
  };

  const canCancelOrder = (status) => {
    return status === 'PENDING' || status === 'PROCESSING';
  };

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="error-state">
            <h2>😕 Không tìm thấy đơn hàng</h2>
            <p>{error || 'Đơn hàng không tồn tại hoặc bạn không có quyền xem'}</p>
            <button onClick={() => navigate('/don-hang')} className="back-btn">
              Quay lại danh sách đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="order-detail-page">
      <div className="container">
        {/* Action Bar - Không in */}
        <div className="action-bar no-print">
          <button onClick={() => navigate('/don-hang')} className="back-button">
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
          <div className="action-buttons">
            <button onClick={handlePrint} className="print-btn">
              <FaPrint />
              <span>In hóa đơn</span>
            </button>
            {canCancelOrder(order.status) && (
              <button 
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="cancel-btn"
              >
                {cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
              </button>
            )}
          </div>
        </div>

        {/* Invoice */}
        <div className="invoice">
          {/* Invoice Header */}
          <div className="invoice-header">
            <div className="company-info">
              <h1 className="company-name">SUDES PHONE</h1>
              <p>Hệ thống bán lẻ điện thoại & phụ kiện</p>
              <p>📍 L1-01 Giga, Phường 15, Quận 11, Tp.HCM</p>
              <p>📞 Hotline: 1900 6750</p>
            </div>
            <div className="invoice-info">
              <h2 className="invoice-title">HÓA ĐƠN BÁN HÀNG</h2>
              <div className="invoice-meta">
                <div className="meta-row">
                  <span className="meta-label">Số hóa đơn:</span>
                  <span className="meta-value">#{order.orderId}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Ngày đặt:</span>
                  <span className="meta-value">{formatDate(order.orderDate)}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Trạng thái:</span>
                  <span className="status-badge" style={{ backgroundColor: statusInfo.color }}>
                    {statusInfo.icon}
                    <span>{statusInfo.label}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="invoice-divider"></div>

          {/* Customer Info */}
          <div className="invoice-section">
            <h3 className="section-title">THÔNG TIN KHÁCH HÀNG</h3>
            <div className="customer-grid">
              <div className="customer-col">
                <div className="info-row">
                  <span className="info-label">Họ và tên:</span>
                  <span className="info-value">{order.username}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Số điện thoại:</span>
                  <span className="info-value">{order.phone}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{order.email}</span>
                </div>
              </div>
              <div className="customer-col">
                <div className="info-row">
                  <span className="info-label">Địa chỉ giao hàng:</span>
                  <span className="info-value">{order.shippingAddress}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Phương thức thanh toán:</span>
                  <span className="info-value">{order.shippingMethod}</span>
                </div>
                {order.note && (
                  <div className="info-row">
                    <span className="info-label">Ghi chú:</span>
                    <span className="info-value">{order.note}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="invoice-divider"></div>

          {/* Products Table */}
          <div className="invoice-section">
            <h3 className="section-title">CHI TIẾT SẢN PHẨM</h3>
            <table className="products-table">
              <thead>
                <tr>
                  <th className="text-center" style={{ width: '50px' }}>STT</th>
                  <th>Tên sản phẩm</th>
                  <th className="text-center" style={{ width: '120px' }}>Đơn giá</th>
                  <th className="text-center" style={{ width: '100px' }}>Số lượng</th>
                  <th className="text-right" style={{ width: '150px' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>
                      <div className="product-name">{item.productName}</div>
                      {(item.color || item.storage) && (
                        <div className="product-variant">
                          {item.color && <span>Màu: {item.color}</span>}
                          {item.color && item.storage && <span> • </span>}
                          {item.storage && <span>Dung lượng: {item.storage}</span>}
                        </div>
                      )}
                    </td>
                    <td className="text-center">{formatPrice(item.price)}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right font-weight-bold">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="invoice-divider"></div>

          {/* Summary */}
          <div className="invoice-summary">
            <div className="summary-rows">
              <div className="summary-row">
                <span className="summary-label">Tạm tính:</span>
                <span className="summary-value">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Phí vận chuyển:</span>
                <span className="summary-value free">Miễn phí</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Giảm giá:</span>
                <span className="summary-value">0đ</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span className="summary-label">TỔNG CỘNG:</span>
                <span className="summary-value">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="invoice-footer">
            <div className="footer-note">
              <p><strong>Lưu ý:</strong></p>
              <ul>
                <li>Vui lòng kiểm tra kỹ sản phẩm trước khi thanh toán</li>
                <li>Sản phẩm được bảo hành chính hãng theo quy định</li>
                <li>Liên hệ hotline 1900 6750 nếu cần hỗ trợ</li>
              </ul>
            </div>
            <div className="footer-signature">
              <div className="signature-box">
                <p className="signature-title">Người mua hàng</p>
                <p className="signature-note">(Ký và ghi rõ họ tên)</p>
              </div>
              <div className="signature-box">
                <p className="signature-title">Người bán hàng</p>
                <p className="signature-note">(Ký và ghi rõ họ tên)</p>
              </div>
            </div>
          </div>

          {/* Thank you message */}
          <div className="thank-you">
            <p>Cảm ơn quý khách đã mua hàng tại Sudes Phone!</p>
            <p>Chúc quý khách có trải nghiệm mua sắm tuyệt vời! 🎉</p>
          </div>
        </div>
      </div>
    </div>
  );
}
