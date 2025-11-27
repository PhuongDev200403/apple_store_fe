import { useState, useEffect } from 'react';
import { FaShoppingCart, FaArrowLeft, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getMyCart, clearMyCart, removeItemFromCart } from '../../utils/api/cartApi';
import './CartPage.css';

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyCart();
      setCart(data);
    } catch (err) {
      console.error('Error loading cart:', err);
      setError(err.message || 'Không thể tải giỏ hàng');
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

  const handleClearCart = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      return;
    }

    try {
      setLoading(true);
      await clearMyCart();
      setCart(null);
      alert('Đã xóa giỏ hàng thành công!');
      fetchCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
      alert('Không thể xóa giỏ hàng. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productVariantId, productName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa "${productName}" khỏi giỏ hàng?`)) {
      return;
    }

    try {
      await removeItemFromCart(productVariantId);
      alert('Đã xóa sản phẩm khỏi giỏ hàng!');
      fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Không thể xóa sản phẩm. Vui lòng thử lại!');
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="cart-loading">
            <div className="spinner"></div>
            <p>Đang tải giỏ hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="cart-error">
            <p className="error-message">{error}</p>
            <button onClick={fetchCart} className="btn btn-primary">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasItems = cart?.items && cart.items.length > 0;

  return (
    <div className="page">
      <div className="container">
        <div className="cart-header">
          <Link to="/" className="back-link">
            <FaArrowLeft />
            <span>Tiếp tục mua sắm</span>
          </Link>
          <h1 className="cart-title">
            <FaShoppingCart />
            Giỏ hàng của bạn
            {hasItems && <span className="cart-count">({cart.totalQuantity})</span>}
          </h1>
        </div>
        
        <div className="cart-content">
          {!hasItems ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <FaShoppingCart />
              </div>
              <h2>Giỏ hàng trống</h2>
              <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
              <Link to="/" className="btn btn-primary">
                Bắt đầu mua sắm
              </Link>
            </div>
          ) : (
            <div className="cart-with-items">
              <div className="cart-items">
                {cart.items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.productImage} alt={item.productName} />
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">{item.productName}</h3>
                      <p className="item-sku">SKU: {item.sku}</p>
                      <p className="item-price">{formatPrice(item.unitPrice)}</p>
                    </div>
                    <div className="item-quantity">
                      <button className="qty-btn" disabled>
                        <FaMinus />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" disabled>
                        <FaPlus />
                      </button>
                    </div>
                    <div className="item-total">
                      <p className="total-price">{formatPrice(item.totalPrice)}</p>
                      <button 
                        className="btn-remove" 
                        onClick={() => handleRemoveItem(item.productVariantId, item.productName)}
                        title="Xóa sản phẩm"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h2>Tóm tắt đơn hàng</h2>
                <div className="summary-row">
                  <span>Tổng số lượng:</span>
                  <span>{cart.totalQuantity} sản phẩm</span>
                </div>
                <div className="summary-row">
                  <span>Tạm tính:</span>
                  <span>
                    {formatPrice(
                      cart.items.reduce((sum, item) => sum + item.totalPrice, 0)
                    )}
                  </span>
                </div>
                <div className="summary-row total">
                  <span>Tổng cộng:</span>
                  <span className="total-amount">
                    {formatPrice(
                      cart.items.reduce((sum, item) => sum + item.totalPrice, 0)
                    )}
                  </span>
                </div>
                <button 
                  className="btn btn-primary btn-checkout"
                  onClick={() => navigate('/thanh-toan')}
                >
                  Tiến hành thanh toán
                </button>
                <Link to="/" className="btn btn-secondary">
                  Tiếp tục mua sắm
                </Link>
                <button 
                  className="btn btn-danger btn-clear-cart" 
                  onClick={handleClearCart}
                  disabled={loading}
                >
                  <FaTrash /> Xóa giỏ hàng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

