import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './CartPage.css';

export default function CartPage() {
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
          </h1>
        </div>
        
        <div className="cart-content">
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
        </div>
      </div>
    </div>
  );
}

