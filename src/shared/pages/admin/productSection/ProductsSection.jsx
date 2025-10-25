import React, { useState } from "react";
import "./ProductsSection.css";

function ProductsSection() {
  // Dữ liệu mẫu (giống JSON của cậu)
  const sampleProducts = [
    { id: 1, name: "Iphone 15 Pro Max", status: "ACTIVE", categoryChildId: 1 },
    { id: 3, name: "Iphone 15", status: "ACTIVE", categoryChildId: 1 },
    { id: 4, name: "Iphone 15 Pro", status: "ACTIVE", categoryChildId: 1 },
    { id: 9, name: "Iphone 13", status: "ACTIVE", categoryChildId: 3 },
  ];

  const [products, setProducts] = useState(sampleProducts);
  const [form, setForm] = useState({ name: "", categoryChildId: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Dữ liệu danh mục con mẫu
  const categoryChildren = [
    { id: 1, name: "Iphone Series 15" },
    { id: 2, name: "Iphone Series 14" },
    { id: 3, name: "Iphone Series 13" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.categoryChildId) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, name: form.name, categoryChildId: parseInt(form.categoryChildId) }
            : p
        )
      );
    } else {
      const newProduct = {
        id: products.length + 1,
        name: form.name,
        status: "ACTIVE",
        categoryChildId: parseInt(form.categoryChildId),
      };
      setProducts([...products, newProduct]);
    }

    setForm({ name: "", categoryChildId: "" });
    setEditingId(null);
    setShowForm(false);
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
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    setProducts(products.filter((p) => p.id !== id));
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
          {filtered.length > 0 ? (
            filtered.map((p, idx) => (
              <tr key={p.id}>
                <td>{idx + 1}</td>
                <td>{p.name}</td>
                <td>{getCategoryName(p.categoryChildId)}</td>
                <td>{p.status}</td>
                <td>
                  <button className="btn edit" onClick={() => handleEdit(p)}>
                    ✏️ Sửa
                  </button>
                  <button className="btn delete" onClick={() => handleDelete(p.id)}>
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
