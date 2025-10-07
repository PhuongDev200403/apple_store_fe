import React, { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../utils/api/categoriesApi";

function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      console.log("API /categories response:", res.data);
      if (res.data && Array.isArray(res.data.result)) {
        setCategories(res.data.result);
      } else {
        console.error("Không nhận diện được cấu trúc response:", res.data);
        setCategories([]);
      }
    } catch (err) {
      console.error("Lỗi khi lấy categories:", err);
      setCategories([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name: form.name, description: form.description };
      if (editingId) {
        await updateCategory(editingId, payload);
      } else {
        await createCategory(payload);
      }
      await loadCategories();
      setForm({ name: "", description: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Lỗi khi lưu category:", err);
    }
  };

  const handleEdit = (c) => {
    setForm({ name: c.name, description: c.description || "" });
    setEditingId(c.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (err) {
      console.error("Lỗi khi xóa category:", err);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="category-section">
      <h3>📂 Quản lý danh mục</h3>

      <input
        type="text"
        placeholder="🔍 Tìm theo tên danh mục..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="category-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên danh mục</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((c, idx) => (
                <tr key={c.id}>
                  <td>{idx + 1}</td>
                  <td>{c.name}</td>
                  <td>{c.description || "-"}</td>
                  <td>
                    <button className="btn edit" onClick={() => handleEdit(c)}>
                      ✏️ Sửa
                    </button>
                    <button className="btn delete" onClick={() => handleDelete(c.id)}>
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", color: "#6b7280" }}>
                  Không có danh mục
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <form onSubmit={handleSubmit} className="category-form">
        <h4>{editingId ? "Cập nhật danh mục" : "Thêm danh mục"}</h4>
        <input
          type="text"
          placeholder="Tên danh mục"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Mô tả"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit" className="btn save">
          {editingId ? "Lưu" : "Thêm"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn cancel"
            onClick={() => {
              setForm({ name: "", description: "" });
              setEditingId(null);
            }}
          >
            Hủy
          </button>
        )}
      </form>
    </div>
  );
}

export default CategoriesSection;
