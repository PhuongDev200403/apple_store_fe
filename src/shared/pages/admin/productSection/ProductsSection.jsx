import React, { useEffect, useState } from "react";
import { getAllProducts, createProduct, updateProduct } from "../../../utils/api/productApi";
import { getAllSeries } from "../../../utils/api/categoryApi";
import "./ProductsSection.css";

function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", categoryChildId: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [categoryChildren, setCategoryChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = (localStorage.getItem('role') || '').toLowerCase() === 'admin';

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [prods, series] = await Promise.all([
          getAllProducts(),
          getAllSeries(),
        ]);
        if (!mounted) return;
        setProducts(Array.isArray(prods) ? prods : []);
        setCategoryChildren(Array.isArray(series) ? series : []);
      } catch (_e) {
        if (!mounted) return;
        setProducts([]);
        setCategoryChildren([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.categoryChildId) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        if (!isAdmin) return alert("Bạn không có quyền thêm sản phẩm.");
        await createProduct(form);
      }
      const [prods] = await Promise.all([getAllProducts()]);
      setProducts(Array.isArray(prods) ? prods : []);
      setForm({ name: "", categoryChildId: "" });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      alert(err?.message || "Lưu thất bại");
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      categoryChildId: p.categoryChildId.toString(),
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    alert("Tạm thời chưa hỗ trợ xóa sản phẩm. Sẽ bổ sung sau.");
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryName = (id) => {
    const found = categoryChildren.find((c) => c.id === id);
    return found ? found.name : "Không xác định";
  };

  return (
    <div className="product-section">
      <div className="header-bar">
        <h3>📱 Quản lý sản phẩm</h3>
        <button
          className="btn add"
          onClick={() => {
            if (!isAdmin) return alert("Bạn không có quyền thêm sản phẩm.");
            setShowForm(!showForm);
            setForm({ name: "", categoryChildId: "" });
            setEditingId(null);
          }}
        >
          {showForm ? "✖ Đóng form" : "➕ Thêm sản phẩm"}
        </button>
      </div>

      <input
        type="text"
        placeholder="🔍 Tìm theo tên sản phẩm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      <table className="product-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên sản phẩm</th>
            <th>Danh mục con</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", color: "#6b7280" }}>
                Đang tải...
              </td>
            </tr>
          ) : filtered.length > 0 ? (
            filtered.map((p, idx) => (
              <tr key={p.id}>
                <td>{idx + 1}</td>
                <td>{p.name}</td>
                <td>{getCategoryName(p.categoryChildId)}</td>
                <td>{p.status}</td>
                <td>
                  <button className="btn edit" onClick={() => handleEdit(p)} disabled={!isAdmin}>
                    ✏️ Sửa
                  </button>
                  <button className="btn delete" onClick={() => handleDelete(p.id)} disabled={!isAdmin}>
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", color: "#6b7280" }}>
                Không có sản phẩm
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <form onSubmit={handleSubmit} className="product-form">
          <h4>{editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</h4>

          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <select
            value={form.categoryChildId}
            onChange={(e) => setForm({ ...form, categoryChildId: e.target.value })}
            required
          >
            <option value="">-- Chọn danh mục con --</option>
            {categoryChildren.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="form-actions">
            <button type="submit" className="btn save">
              {editingId ? "Lưu thay đổi" : "Thêm"}
            </button>
            <button
              type="button"
              className="btn cancel"
              onClick={() => {
                setForm({ name: "", categoryChildId: "" });
                setEditingId(null);
                setShowForm(false);
              }}
            >
              Hủy
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProductsSection;
