import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaMapMarkerAlt, FaTruck, FaStickyNote, FaCheckCircle } from 'react-icons/fa';
import { getMyCart } from '../../utils/api/cartApi';
import { checkout } from '../../utils/api/orderApi';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    shippingAddress: '',
    shippingMethod: 'COD',
    note: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await getMyCart();
      setCart(cartData);
      
      // Nếu giỏ hàng trống, redirect về trang giỏ hàng
      if (!cartData || !cartData.items || cartData.items.length === 0) {
        navigate('/gio-hang');
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      setError('Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update map khi địa chỉ thay đổi
    if (name === 'shippingAddress' && value.trim()) {
      updateMap(value);
    }
    
    // Clear error khi user nhập
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const updateMap = (address) => {
    if (address.trim().length > 5) {
      const encodedAddress = encodeURIComponent(address);
      setMapUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}`);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.shippingAddress.trim()) {
      errors.shippingAddress = 'Vui lòng nhập địa chỉ giao hàng';
    } else if (formData.shippingAddress.trim().length < 10) {
      errors.shippingAddress = 'Địa chỉ quá ngắn, vui lòng nhập đầy đủ';
    }

    if (!formData.shippingMethod) {
      errors.shippingMethod = 'Vui lòng chọn phương thức thanh toán';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // Checkout từ giỏ hàng - Backend tự lấy items từ cart
      const checkoutData = {
        shippingAddress: formData.shippingAddress.trim(),
        shippingMethod: formData.shippingMethod,
        note: formData.note.trim() || undefined
      };

      const result = await checkout(checkoutData);
      
      // Hiển thị thông báo thành công
      alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
      
      // Redirect đến trang đơn hàng
      navigate('/don-hang');
    } catch (err) {
      console.error('Error checkout:', err);
      setError(err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => navigate('/gio-hang')} className="back-btn">
              Quay lại giỏ hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Header */}
        <div className="checkout-header">
          <h1 className="page-title">
            <FaShoppingCart className="title-icon" />
            Thanh toán đơn hàng
          </h1>
          <p className="page-subtitle">Vui lòng kiểm tra thông tin và hoàn tất đơn hàng</p>
        </div>

        <div className="checkout-layout">
          {/* Form bên trái */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Địa chỉ giao hàng */}
              <div className="form-section">
                <h2 className="section-title">
                  <FaMapMarkerAlt className="section-icon" />
                  Địa chỉ giao hàng
                </h2>
                <div className="form-group">
                  <label htmlFor="shippingAddress">
                    Địa chỉ nhận hàng <span className="required">*</span>
                  </label>
                  <textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Nhà số 12 hẻm 129/29/3, Minh Khai, Bắc Từ Liêm, Hà Nội"
                    rows="3"
                    className={formErrors.shippingAddress ? 'error' : ''}
                  />
                  {formErrors.shippingAddress && (
                    <span className="error-message">{formErrors.shippingAddress}</span>
                  )}
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="form-section">
                <h2 className="section-title">
                  <FaTruck className="section-icon" />
                  Phương thức thanh toán
                </h2>
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="COD"
                      checked={formData.shippingMethod === 'COD'}
                      onChange={handleInputChange}
                    />
                    <div className="method-content">
                      <div className="method-icon">💵</div>
                      <div className="method-info">
                        <strong>Thanh toán khi nhận hàng (COD)</strong>
                        <small>Thanh toán bằng tiền mặt khi nhận hàng</small>
                      </div>
                    </div>
                  </label>

                  <label className="payment-method">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="BANK_TRANSFER"
                      checked={formData.shippingMethod === 'BANK_TRANSFER'}
                      onChange={handleInputChange}
                    />
                    <div className="method-content">
                      <div className="method-icon">🏦</div>
                      <div className="method-info">
                        <strong>Chuyển khoản ngân hàng</strong>
                        <small>Chuyển khoản trước khi nhận hàng</small>
                      </div>
                    </div>
                  </label>

                  <label className="payment-method">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="CREDIT_CARD"
                      checked={formData.shippingMethod === 'CREDIT_CARD'}
                      onChange={handleInputChange}
                    />
                    <div className="method-content">
                      <div className="method-icon">💳</div>
                      <div className="method-info">
                        <strong>Thẻ tín dụng / Ghi nợ</strong>
                        <small>Visa, MasterCard, JCB</small>
                      </div>
                    </div>
                  </label>
                </div>
                {formErrors.shippingMethod && (
                  <span className="error-message">{formErrors.shippingMethod}</span>
                )}
              </div>

              {/* Ghi chú */}
              <div className="form-section">
                <h2 className="section-title">
                  <FaStickyNote className="section-icon" />
                  Ghi chú đơn hàng (Tùy chọn)
                </h2>
                <div className="form-group">
                  <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Ghi chú thêm về đơn hàng (nếu có)..."
                    rows="3"
                  />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="form-error-box">
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button 
                type="submit" 
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="btn-spinner"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Hoàn tất đặt hàng
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Map bên phải */}
          <div className="map-section">
            <div className="map-container">
              <h2 className="map-title">
                <FaMapMarkerAlt className="map-icon" />
                Vị trí giao hàng
              </h2>
              
              {mapUrl ? (
                <div className="map-wrapper">
                  <iframe
                    title="Shipping Location"
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              ) : (
                <div className="map-placeholder">
                  <FaMapMarkerAlt className="placeholder-icon" />
                  <p>Nhập địa chỉ giao hàng để xem vị trí trên bản đồ</p>
                </div>
              )}

              {/* Order Total Summary */}
              <div className="order-total-box">
                <div className="total-info">
                  <span className="total-label">Tổng đơn hàng:</span>
                  <span className="total-value">{total.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="total-items">
                  <span>{cart?.items?.length || 0} sản phẩm</span>
                  <span className="shipping-free">Miễn phí vận chuyển</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
