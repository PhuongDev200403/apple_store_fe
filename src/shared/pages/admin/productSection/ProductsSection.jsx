// src/shared/pages/admin/productSection/ProductSection.jsx
import { useState, useEffect, useMemo } from "react";
import {
  getAllProducts,
  getAllSeries,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../utils/api/productApi";
import "./ProductsSection.css";

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: "", status: "ACTIVE", categoryChildId: "" });

  // DI CHUYỂN getSeriesName LÊN TRÊN useMemo
  const getSeriesName = (id) => {
    if (!id || !Array.isArray(series)) return `DM ${id}`;
    const found = series.find((item) => item.id === id);
    return found?.name || `DM ${id}`;
  };

  useEffect(() => {
    loadProducts();
    loadSeries();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllProducts();
      setProducts(data || []);
    } catch (err) {
      const msg = err.message || "Không thể tải sản phẩm.";
      setError(msg);
      if (err.message.includes("401") || err.message.includes("403")) {
        setError("Bạn không có quyền truy cập. Chỉ Admin được phép.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadSeries = async () => {
    setLoadingSeries(true);
    try {
      const data = await getAllSeries();
      setSeries(data || []);
    } catch (err) {
      console.error("Lỗi tải danh mục:", err);
      setSeries([]);
    } finally {
      setLoadingSeries(false);
    }
  };

  // BÂY GIỜ MỚI DÙNG getSeriesName
  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;

    const s = search.toLowerCase();
    return products.filter((p) => {
      const idMatch = String(p.id || "").includes(s);
      const nameMatch = p.name?.toLowerCase().includes(s);
      const categoryName = getSeriesName(p.categoryChildId);
      const categoryMatch = categoryName?.toLowerCase().includes(s);

      return idMatch || nameMatch || categoryMatch;
    });
  }, [products, search, series]); // series ở đây → OK

  const openModal = (product = null) => {
    setEditingProduct(product);
    setForm({
      name: product?.name || "",
      status: product?.status || "ACTIVE",
      categoryChildId: product?.categoryChildId?.toString() || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setForm({ name: "", status: "ACTIVE", categoryChildId: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Tên sản phẩm không được để trống!");
      return;
    }
    if (!form.categoryChildId) {
      alert("Vui lòng chọn danh mục!");
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, form);
      } else {
        await createProduct(form);
      }
      closeModal();
      loadProducts();
    } catch (err) {
      alert(err.message || "Lỗi khi lưu sản phẩm.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      alert(err.message || "Xóa thất bại.");
    }
  };

  if (error.includes("quyền")) {
    return (
      <div className="product-manager">
        <div className="product-container" style={{ padding: "3rem", textAlign: "center" }}>
          <h3 style={{ color: "#991b1b" }}>Truy cập bị từ chối</h3>
          <p>{error}</p>
          <button onClick={() => window.location.href = "/login"} className="btn btn-primary">
            Đăng nhập lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-manager">
      <div className="product-container">

        <div className="product-toolbar">
          <div className="search-box">
            <span className="search-icon"></span>
            <input
              type="text"
              placeholder="Tìm theo ID, tên, danh mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={() => openModal()} className="btn btn-primary">
            Plus Thêm sản phẩm
          </button>
          <button onClick={loadProducts} disabled={loading} className="btn btn-secondary">
            {loading ? "Loading..." : "Refresh Tải lại"}
          </button>
        </div>

        {error && !error.includes("quyền") && (
          <div className="error-box">{error}</div>
        )}

        {loading ? (
          <div className="loading">Loading Đang tải sản phẩm...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty">
            <h3>Empty Không có sản phẩm phù hợp</h3>
            <p>Thử thay đổi từ khóa tìm kiếm.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="product-row">
                    <td><strong>#{p.id}</strong></td>
                    <td>{p.name}</td>
                    <td>{getSeriesName(p.categoryChildId)}</td>
                    <td>
                      <span className={`status-badge status-${p.status?.toLowerCase() || "inactive"}`}>
                        {p.status || "N/A"}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => openModal(p)} className="btn-edit">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="btn-delete">
                        Trash
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingProduct ? "Edit Sửa sản phẩm" : "Plus Thêm sản phẩm"}
              </h2>
              <button onClick={closeModal} className="close-btn">Close</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>Tên sản phẩm *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>

              <div className="form-group">
                <label>Danh mục *</label>
                <select
                  value={form.categoryChildId}
                  onChange={(e) => setForm({ ...form, categoryChildId: e.target.value })}
                  required
                  disabled={loadingSeries}
                >
                  <option value="">
                    {loadingSeries ? "Loading Đang tải..." : "-- Chọn danh mục --"}
                  </option>
                  {series.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary" disabled={loadingSeries}>
                  {editingProduct ? "Update Cập nhật" : "Create Tạo mới"}
                </button>
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancel Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}