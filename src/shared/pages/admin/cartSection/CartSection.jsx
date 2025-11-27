// src/components/admin/CartSection/CartSection.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { getAllCarts } from "../../../utils/api/cartApi";
import "./CartSection.css";

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("vi-VN") + " đ";
};

export default function CartSection() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCart, setSelectedCart] = useState(null);

  useEffect(() => {
    loadCarts();
  }, []);

  const loadCarts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllCarts();
      const result = data?.result || data || [];
      setCarts(Array.isArray(result) ? result : []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Không thể tải giỏ hàng.";
      setError(msg);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Bạn không có quyền truy cập. Chỉ Admin được phép.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredCarts = useMemo(() => {
    if (!search.trim()) return carts;
    const s = search.toLowerCase();
    return carts.filter((cart) => {
      const idMatch = String(cart.id || "").includes(s);
      const userIdMatch = String(cart.userId || "").includes(s);
      const productMatch = cart.items?.some((item) =>
        (item.productName || "").toLowerCase().includes(s)
      );
      return idMatch || userIdMatch || productMatch;
    });
  }, [carts, search]);

  const openDetailModal = useCallback((cart) => {
    setSelectedCart(cart);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedCart(null);
  }, []);

  if (error.includes("quyền")) {
    return (
      <div className="cart-manager">
        <div className="cart-container access-denied">
          <h3>Truy cập bị từ chối</h3>
          <p>{error}</p>
          <button onClick={() => window.location.href = "/login"} className="btn btn-primary">
            Đăng nhập lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-manager">
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="page-title">Giỏ hàng người dùng</h1>
          <p className="subtitle">Xem chi tiết, số lượng, tổng tiền</p>
        </div>

        <div className="cart-toolbar">
          <div className="search-box">
            <span className="search-icon">Search</span>
            <input
              type="text"
              placeholder="Tìm Cart ID, User ID, sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={loadCarts} disabled={loading} className="btn btn-secondary">
            {loading ? "Loading..." : "Refresh Tải lại"}
          </button>
        </div>

        {error && !error.includes("quyền") && (
          <div className="error-box">{error}</div>
        )}

        {loading ? (
          <div className="loading">Đang tải giỏ hàng...</div>
        ) : filteredCarts.length === 0 ? (
          <div className="empty">
            <h3>Không có giỏ hàng</h3>
            <p>Thử thay đổi từ khóa tìm kiếm.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Cart ID</th>
                  <th>User ID</th>
                  <th>Số sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredCarts.map((cart) => {
                  const total = cart.items?.reduce((sum, it) => sum + (it.totalPrice || 0), 0) || 0;
                  return (
                    <tr key={cart.id} className="cart-row">
                      <td><strong>#{cart.id}</strong></td>
                      <td><strong className="user-id">#{cart.userId}</strong></td>
                      <td>
                        <span className="badge">{cart.totalQuantity || 0}</span>
                      </td>
                      <td>
                        <strong className="price">{formatPrice(total)}</strong>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailModal(cart);
                          }}
                          className="btn-view"
                        >
                          Eye Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CHI TIẾT – ẢNH HIỂN THỊ 100%, SỐ LƯỢNG ĐÚNG */}
      {selectedCart && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                Eye Chi tiết giỏ hàng <strong>#{selectedCart.id}</strong>
              </h2>
              <button onClick={closeModal} className="close-btn">Close</button>
            </div>

            <div className="modal-body">
              <div className="cart-summary">
                <div className="summary-item">
                  <strong>User ID:</strong> <span className="highlight">#{selectedCart.userId}</span>
                </div>
                <div className="summary-item">
                  <strong>Số sản phẩm:</strong> <span className="highlight">{selectedCart.totalQuantity}</span>
                </div>
                <div className="summary-item">
                  <strong>Tổng tiền:</strong>{" "}
                  <span className="price highlight">
                    {formatPrice(selectedCart.items?.reduce((s, i) => s + i.totalPrice, 0) || 0)}
                  </span>
                </div>
              </div>

              {selectedCart.items?.length > 0 ? (
                <div className="items-grid">
                  {selectedCart.items.map((item, idx) => (
                    <div key={item.id || idx} className="cart-item-card">
                      <div className="item-image">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                          }}
                        />
                      </div>
                      <div className="item-details">
                        <h4 className="item-sku">{item.sku}</h4>
                        <p className="item-name">{item.productName}</p>
                        <div className="item-pricing">
                          <div>
                            <strong>Số lượng:</strong> <span className="highlight">{item.quantity}</span>
                          </div>
                          <div>
                            <strong>Đơn giá:</strong> {formatPrice(item.unitPrice)}
                          </div>
                          <div className="line-total">
                            <strong>Thành tiền:</strong> {formatPrice(item.totalPrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty">Giỏ hàng trống</div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={closeModal} className="btn btn-secondary">
                Close Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}