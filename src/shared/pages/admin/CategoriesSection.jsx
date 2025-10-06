import React, { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../utils/api/categoriesApi";

function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi load categories:", err);
      setCategories([]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }
      await loadCategories();
      setForm({ name: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Lỗi khi lưu category:", err);
    }
  };

  const handleEdit = (c) => {
    setForm({ name: c.name });
    setEditingId(c.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xóa danh mục này?")) return;
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (err) {
      console.error("Lỗi khi xóa category:", err);
    }
  };

  return (
    <div>
      <h3>📂 Quản lý danh mục</h3>

      {loading ? (
        <p>⏳ Đang tải...</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên danh mục</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((c, idx) => (
                <tr key={c.id}>
                  <td>{idx + 1}</td>
                  <td>{c.name}</td>
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
                <td colSpan="3" style={{ textAlign: "center", color: "#6b7280" }}>
                  Không có danh mục
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <form onSubmit={handleSubmit} className="user-form">
        <h4>{editingId ? "Cập nhật danh mục" : "Thêm danh mục"}</h4>
        <input
          type="text"
          placeholder="Tên danh mục..."
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <button type="submit" className="btn save">
          {editingId ? "Lưu" : "Thêm"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn cancel"
            onClick={() => {
              setForm({ name: "" });
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
