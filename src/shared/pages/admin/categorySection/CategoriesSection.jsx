// src/components/admin/CategoriesSection/CategoriesSection.jsx
import { useState, useEffect, useMemo } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../utils/api/categoriesApi";
import "./CategoriesSection.css";

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Form
  const [form, setForm] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Không tải được danh mục: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const s = search.toLowerCase();
    return categories.filter(c =>
      c.name?.toLowerCase().includes(s) ||
      c.description?.toLowerCase().includes(s)
    );
  }, [categories, search]);

  const openForm = (cat = null) => {
    setEditingCat(cat);
    setForm({
      name: cat?.name || "",
      description: cat?.description || ""
    });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCat(null);
    setFormError("");
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Tên danh mục không được để trống!";
    if (form.name.length > 50) return "Tên danh mục tối đa 50 ký tự!";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }

    try {
      if (editingCat) {
        await updateCategory(editingCat.id, form);
      } else {
        await createCategory(form);
      }
      closeForm();
      loadCategories();
    } catch (err) {
      setFormError(err.message || "Lỗi khi lưu danh mục");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa danh mục này? Các series sẽ bị ảnh hưởng!")) return;
    setDeletingId(id);
    try {
      await deleteCategory(id);
      loadCategories();
    } catch (err) {
      alert("Xóa thất bại: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="categories-manager">
      <div className="categories-container">
      

        <div className="toolbar">
          <div className="search-box">
            <span className="search-icon"></span>
            <input
              placeholder="Tìm tên, mô tả..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={() => openForm()} className="btn btn-primary">
            Plus Thêm danh mục
          </button>
          <button onClick={loadCategories} disabled={loading} className="btn btn-secondary">
            {loading ? "Loading..." : "Refresh Tải lại"}
          </button>
        </div>

        {error && <div className="error-box">{error}</div>}

        {loading ? (
          <div className="loading">Đang tải danh mục...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <h3>Không có danh mục</h3>
            <p>Thử thay đổi từ khóa tìm kiếm.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên danh mục</th>
                  <th>Mô tả</th>
                  <th>Số series</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(cat => (
                  <tr key={cat.id} className="category-row">
                    <td><strong>#{cat.id}</strong></td>
                    <td className="cat-name">{cat.name}</td>
                    <td className="cat-desc">
                      {cat.description?.length > 80
                        ? cat.description.substring(0, 80) + "..."
                        : cat.description || "—"}
                    </td>
                    <td>
                      <span className="series-badge">
                        {cat.series?.length || 0}
                      </span>
                    </td>
                    <td className="actions">
                      <button onClick={() => openForm(cat)} className="btn-edit">Edit</button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={deletingId === cat.id}
                        className="btn-delete"
                      >
                        {deletingId === cat.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCat ? "Edit Sửa danh mục" : "Plus Thêm danh mục"}</h2>
              <button onClick={closeForm} className="close-btn">Close</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              {formError && <div className="form-error">{formError}</div>}

              <div className="input-group">
                <label>Tên danh mục *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Iphone"
                  maxLength={50}
                  required
                />
                <small>{form.name.length}/50</small>
              </div>

              <div className="input-group">
                <label>Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Mô tả ngắn về danh mục..."
                  rows={4}
                />
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn-save">
                  {editingCat ? "Update Cập nhật" : "Create Tạo mới"}
                </button>
                <button type="button" onClick={closeForm} className="btn-cancel">
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