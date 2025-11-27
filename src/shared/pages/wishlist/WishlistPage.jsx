import { useState, useEffect } from 'react';
import { FaHeart, FaArrowLeft, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getMyWishlist, removeItemFromWishlist, clearMyWishlist } from '../../utils/api/wishlistApi';
import './WishlistPage.css';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyWishlist();
      const items = data?.items || [];
      setWishlist(items);
    } catch (err) {
      console.error('Error loading wishlist:', err);
      setError(err.message || 'Không thể tải danh sách yêu thích');
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

  const handleRemoveItem = async (productVariantId, productName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa "${productName}" khỏi danh sách yêu thích?`)) {
      return;
    }

    try {
      await removeItemFromWishlist(productVariantId);
      alert('Đã xóa sản phẩm khỏi danh sách yêu thích!');
      fetchWishlist();
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Không thể xóa sản phẩm. Vui lòng thử lại!');
    }
  };

  const handleClearWishlist = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách yêu thích?')) {
      return;
    }

    try {
      setLoading(true);
      await clearMyWishlist();
      alert('Đã xóa toàn bộ danh sách yêu thích!');
      fetchWishlist();
    } catch (err) {
      console.error('Error clearing wishlist:', err);
      alert('Không thể xóa danh sách yêu thích. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="wishlist-loading">
            <div className="spinner"></div>
            <p>Đang tải danh sách yêu thích...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="wishlist-error">
            <p className="error-message">{error}</p>
            <button onClick={fetchWishlist} className="btn btn-primary">
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
        <div className="wishlist-header">
          <div className="header-left">
            <Link to="/" className="back-link">
              <FaArrowLeft />
              <span>Quay lại</span>
            </Link>
            <h1 className="wishlist-title">
              <FaHeart />
              Sản phẩm yêu thích
              {wishlist.length > 0 && <span className="wishlist-count">({wishlist.length})</span>}
            </h1>
          </div>
          {wishlist.length > 0 && (
            <button 
              className="btn btn-danger btn-clear-wishlist"
              onClick={handleClearWishlist}
              disabled={loading}
            >
              <FaTrash /> Xóa tất cả
            </button>
          )}
        </div>

        <div className="wishlist-content">
          {wishlist.length === 0 ? (
            <div className="empty-wishlist">
              <div className="empty-wishlist-icon">
                <FaHeart />
              </div>
              <h2>Chưa có sản phẩm yêu thích</h2>
              <p>Hãy thêm sản phẩm vào danh sách yêu thích để xem lại sau.</p>
              <Link to="/" className="btn btn-primary">
                Khám phá sản phẩm
              </Link>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlist.map((item) => {
                const pv = item.productVariant;
                return (
                  <div key={item.id} className="wishlist-card">
                    <div className="wishlist-card-image">
                      <img
                        src={pv.imageUrl || '/default-product.jpg'}
                        alt={pv.slug}
                      />
                      <button
                        className="btn-remove-wishlist"
                        onClick={() => handleRemoveItem(pv.id, pv.slug?.replace(/-/g, ' ') || 'Sản phẩm')}
                        title="Xóa khỏi yêu thích"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="wishlist-card-body">
                      <h3 className="product-name">
                        {pv.slug?.replace(/-/g, ' ') || 'Sản phẩm'}
                      </h3>
                      <p className="product-price">
                        {formatPrice(pv.price || 0)}
                      </p>
                      <div className="card-actions">
                        <Link
                          to={`/product/${pv.productId || pv.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Xem chi tiết
                        </Link>
                        <button className="btn btn-secondary btn-sm">
                          <FaShoppingCart /> Thêm vào giỏ
                        </button>
                      </div>
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
