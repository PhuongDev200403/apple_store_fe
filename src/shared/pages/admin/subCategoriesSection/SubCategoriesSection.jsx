// src/components/admin/SubCategoriesSection/SubCategoriesSection.jsx
import { useState, useEffect, useMemo } from "react";
import {
  getAllSeries,
  getAllParentCategories,
  updateSeries,
  deleteSeries,
  createSeries,
} from "../../../utils/api/categoryApi";
import "./SubCategoriesSection.css";

export default function SubCategoriesSection() {
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSeries, setEditingSeries] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Form
  const [form, setForm] = useState({ name: "", description: "", categoryId: "" });
  const [formError, setFormError] = useState("");

  const isAdmin = (localStorage.getItem("role") || "").toLowerCase() === "admin";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [seriesList, parentCats] = await Promise.all([
        getAllSeries(),
        getAllParentCategories(),
      ]);
      setSeries(Array.isArray(seriesList) ? seriesList : []);
      setCategories(Array.isArray(parentCats) ? parentCats : []);
    } catch (err) {
      setError("Không tải được dữ liệu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return series;
    const s = search.toLowerCase();
    return series.filter((item) =>
      item.name?.toLowerCase().includes(s) ||
      item.description?.toLowerCase().includes(s)
    );
  }, [series, search]);

  const getCategoryName = (id) => {
    return categories.find((c) => c.id === id)?.name || "Không xác định";
  };

  const openForm = (item = null) => {
    if (!isAdmin && !item) {
      alert("Bạn không có quyền thêm mới.");
      return;
    }
    setEditingSeries(item);
    setForm({
      name: item?.name || "",
      description: item?.description || "",
      categoryId: item?.categoryId?.toString() || "",
    });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingSeries(null);
    setFormError("");
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Tên danh mục con không được để trống!";
    if (!form.categoryId) return "Vui lòng chọn danh mục cha!";
    if (form.name.length > 100) return "Tên tối đa 100 ký tự!";
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
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        categoryId: parseInt(form.categoryId),
      };

      if (editingSeries) {
        await updateSeries(editingSeries.id, payload);
      } else {
        await createSeries(payload);
      }

      closeForm();
      loadData();
    } catch (err) {
      setFormError(err.message || "Lưu thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      alert("Bạn không có quyền xóa.");
      return;
    }
    if (!window.confirm("Xóa danh mục con này?")) return;

    setDeletingId(id);
    try {
      await deleteSeries(id);
      loadData();
    } catch (err) {
      alert("Xóa thất bại: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="subcategories-manager">
      <div className="subcategories-container">

        <div className="toolbar">
          <div className="search-box">
            <span className="search-icon"></span>
            <input
              placeholder="Tìm tên series, mô tả..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            onClick={() => openForm()}
            className="btn btn-primary"
            disabled={!isAdmin}
          >
            Plus Thêm Series
          </button>
          <button onClick={loadData} disabled={loading} className="btn btn-secondary">
            {loading ? "Loading..." : "Refresh Tải lại"}
          </button>
        </div>

        {error && <div className="error-box">{error}</div>}

        {loading ? (
          <div className="loading">Đang tải danh mục con...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <h3>Không có series</h3>
            <p>Thử thay đổi từ khóa tìm kiếm.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="series-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Series</th>
                  <th>Mô tả</th>
                  <th>Danh mục cha</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="series-row">
                    <td><strong>#{s.id}</strong></td>
                    <td className="series-name">{s.name}</td>
                    <td className="series-desc">
                      {s.description?.length > 60
                        ? s.description.substring(0, 60) + "..."
                        : s.description || "—"}
                    </td>
                    <td>
                      <span className="parent-badge">
                        {getCategoryName(s.categoryId)}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => openForm(s)}
                        className="btn-edit"
                        disabled={!isAdmin}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deletingId === s.id || !isAdmin}
                        className="btn-delete"
                      >
                        {deletingId === s.id ? "Deleting..." : "Delete"}
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
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSeries ? "Edit Sửa Series" : "Plus Thêm Series"}</h2>
              <button onClick={closeForm} className="close-btn">Close</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              {formError && <div className="form-error">{formError}</div>}

              <div className="input-group">
                <label>Tên Series *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: iPhone 15 Series"
                  maxLength={100}
                  required
                />
                <small>{form.name.length}/100</small>
              </div>

              <div className="input-group">
                <label>Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Mô tả ngắn về series..."
                  rows={3}
                />
              </div>

              <div className="input-group">
                <label>Danh mục cha *</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn-save">
                  {editingSeries ? "Update Cập nhật" : "Create Tạo mới"}
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