import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getMyWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../../utils/api/wishlistApi';

export default function AccountPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load dữ liệu
  useEffect(() => {
    async function fetchWishlist() {
      try {
        const data = await getMyWishlist();
        const items = data.items || data.result || data || [];
        setWishlist(items);
      } catch (err) {
        console.error('❌ Lỗi khi lấy danh sách yêu thích:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, []);

  // Xóa 1 sản phẩm
  const handleRemove = async (id) => {
    if (!window.confirm('Xóa sản phẩm này khỏi danh sách yêu thích?')) return;
    try {
      await removeFromWishlist(id);
      setWishlist((prev) => prev.filter((i) => i.productVariantId !== id));
    } catch (err) {
      console.error('❌ Lỗi khi xóa sản phẩm:', err);
    }
  };

  // Xóa toàn bộ danh sách yêu thích
  const handleClearAll = async () => {
    if (!window.confirm('Xóa toàn bộ danh sách yêu thích?')) return;
    try {
      await clearWishlist();
      setWishlist([]);
    } catch (err) {
      console.error('❌ Lỗi khi xóa toàn bộ:', err);
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-secondary" role="status" />
      </div>
    );

  return (
    <div className="container">
      <main className="bg-light min-vh-100">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 fw-bold mb-0">SẢN PHẨM YÊU THÍCH</h1>
            {wishlist.length > 0 && (
              <button className="btn btn-outline-danger btn-sm" onClick={handleClearAll}>
                <i className="bi bi-trash me-1"></i> Xóa toàn bộ
              </button>
            )}
          </div>

          {wishlist.length === 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-heart display-1 text-danger mb-3"></i>
                <h5 className="mb-3">Bạn chưa có sản phẩm yêu thích nào!</h5>
                <p className="text-secondary mb-4">
                  Hãy thêm sản phẩm vào danh sách yêu thích để xem lại sau.
                </p>
                <Link to="/" className="btn btn-dark">
                  <i className="bi bi-arrow-left me-2"></i>
                  Khám phá sản phẩm
                </Link>
              </div>
            </div>
          ) : (
            <div className="row">
              {wishlist.map((item) => (
                <div key={item.productVariantId || item.id} className="col-md-3 mb-4">
                  <div className="card shadow-sm h-100">
                    <img
                      src={item.imageUrl || '/no-image.png'}
                      className="card-img-top"
                      alt={item.productName || 'Sản phẩm'}
                    />
                    <div className="card-body text-center">
                      <h6>{item.productName || item.name}</h6>
                      {item.price && (
                        <p className="text-danger fw-bold">
                          {item.price.toLocaleString()}₫
                        </p>
                      )}
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemove(item.productVariantId || item.id)}
                      >
                        <i className="bi bi-trash"></i> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
