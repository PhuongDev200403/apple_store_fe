// src/shared/pages/admin/wishlistSection/WishlistSection.jsx
import { useState, useEffect, useMemo } from "react";
import { getAllWishlists, getWishlistByUserId } from "../../../utils/api/wishlistApi";
import "./WishlistSection.css";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

const formatPrice = (price) => {
  if (!price) return "—";
  return Number(price).toLocaleString("vi-VN") + " đ";
};

export default function WishlistSection() {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    loadWishlists();
  }, []);

  const loadWishlists = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllWishlists();
      setWishlists(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Không thể tải danh sách wishlist.";
      setError(msg);
      if (err.response?.status === 403 || err.response?.status === 401) {
        setError("Bạn không có quyền truy cập. Chỉ Admin được phép.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadWishlistDetail = async (userId) => {
    setLoadingDetail(true);
    try {
      const data = await getWishlistByUserId(userId);
      setSelectedWishlist(data); // data là object { id, userId, items: [...] }
    } catch (err) {
      alert(err.response?.data?.message || "Không thể tải chi tiết wishlist.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const filteredWishlists = useMemo(() => {
    if (!search) return wishlists;
    const s = search.toLowerCase();
    return wishlists.filter(
      (w) =>
        String(w.id || "").includes(s) ||
        String(w.userId || "").includes(s)
    );
  }, [wishlists, search]);

  if (error.includes("quyền")) {
    return (
      <div className="wishlist-manager">
        <div className="wishlist-container" style={{ padding: "3rem", textAlign: "center" }}>
          <h3 style={{ color: "#991b1b" }}>Truy cập bị từ chối</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.href = "/login"}
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
          >
            Đăng nhập lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-manager">
      <div className="wishlist-container">
        <div className="wishlist-toolbar">
          <div className="search-box">
            <span className="search-icon">Search</span>
            <input
              type="text"
              placeholder="Tìm theo Wishlist ID hoặc User ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={loadWishlists} disabled={loading} className="btn btn-primary">
            {loading ? "Loading..." : "Refresh Tải lại"}
          </button>
        </div>

        {error && !error.includes("quyền") && (
          <div className="error-box">{error}</div>
        )}

        {loading ? (
          <div className="loading">Loading Đang tải danh sách wishlist...</div>
        ) : filteredWishlists.length === 0 ? (
          <div className="empty">
            <h3>Empty Không có wishlist nào</h3>
            <p>Hãy thử tìm lại hoặc tải lại dữ liệu.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="wishlist-table">
              <thead>
                <tr>
                  <th>Wishlist ID</th>
                  <th>User ID</th>
                  <th>Ngày tạo</th>
                  <th>Cập nhật</th>
                  <th>Số sản phẩm</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredWishlists.map((w) => (
                  <tr
                    key={w.id}
                    className="wishlist-row"
                    onClick={() => loadWishlistDetail(w.userId)}
                  >
                    <td><strong>#{w.id}</strong></td>
                    <td>{w.userId}</td>
                    <td>{formatDate(w.createdAt)}</td>
                    <td>{formatDate(w.updatedAt)}</td>
                    <td>
                      <span className="item-count">
                        {w.items?.length || 0} sản phẩm
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadWishlistDetail(w.userId);
                        }}
                        className="btn-view"
                      >
                        View Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CHI TIẾT – ĐÃ SỬA HOÀN HẢO */}
      {selectedWishlist && (
        <div className="modal-overlay" onClick={() => setSelectedWishlist(null)}>
          <div className="modal wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                Wishlist của User ID: <strong>#{selectedWishlist.userId}</strong>
              </h2>
              <button onClick={() => setSelectedWishlist(null)} className="close-btn">
                Close
              </button>
            </div>

            <div className="modal-body">
              <div className="info-grid">
                <div className="info-item">
                  <strong>Wishlist ID:</strong> #{selectedWishlist.id}
                </div>
                <div className="info-item">
                  <strong>User ID:</strong> {selectedWishlist.userId}
                </div>
                <div className="info-item">
                  <strong>Ngày tạo:</strong> {formatDate(selectedWishlist.createdAt)}
                </div>
                <div className="info-item">
                  <strong>Cập nhật:</strong> {formatDate(selectedWishlist.updatedAt)}
                </div>
                <div className="info-item">
                  <strong>Số sản phẩm:</strong> {(selectedWishlist.items || []).length}
                </div>
              </div>

              {loadingDetail ? (
                <div className="loading">Loading Đang tải sản phẩm...</div>
              ) : (selectedWishlist.items || []).length === 0 ? (
                <div className="empty">
                  <p>Empty Wishlist trống</p>
                </div>
              ) : (
                <>
                  <h3 className="section-title">Sản phẩm trong wishlist</h3>
                  <div className="items-grid">
                    {selectedWishlist.items.map((item, i) => {
                      const v = item.productVariant;
                      return (
                        <div key={item.id || i} className="product-card">
                          <div className="product-image">
                            <img
                              src={v.imageUrl || "/placeholder.png"}
                              alt={v.sku}
                              onError={(e) => (e.target.src = "/placeholder.png")}
                            />
                          </div>
                          <div className="product-info">
                            <h4 className="product-sku">{v.sku}</h4>
                            <p className="product-slug">{v.slug}</p>
                            <div className="product-specs">
                              <span className="spec">{v.color}</span>
                              <span className="spec">{v.memory}GB</span>
                            </div>
                            <p className="product-price">{formatPrice(v.price)}</p>
                            <p className="added-at">
                              Thêm vào: {formatDate(item.addedAt)}
                            </p>
                            <div className="variant-id">
                              <small>Variant ID: #{v.id}</small>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedWishlist(null)} className="btn btn-secondary">
                Close Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}