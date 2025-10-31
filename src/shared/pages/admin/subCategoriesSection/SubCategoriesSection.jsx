import React, { useState, useEffect } from "react";
import { getAllSeries, getAllParentCategories, updateSeries, deleteSeries, createSeries } from "../../../utils/api/categoryApi";
import "./SubCategoriesSection.css";

function SubCategoriesSection() {
  const [subCategories, setSubCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", categoryId: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = (localStorage.getItem('role') || '').toLowerCase() === 'admin';

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [seriesList, parentCats] = await Promise.all([
          getAllSeries(),
          getAllParentCategories(),
        ]);
        if (!mounted) return;
        setSubCategories(Array.isArray(seriesList) ? seriesList : []);
        setCategories(Array.isArray(parentCats) ? parentCats : []);
      } catch (_e) {
        if (!mounted) return;
        setSubCategories([]);
        setCategories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.categoryId)
      return alert("Vui lòng nhập đầy đủ thông tin.");

    try {
      if (editingId) {
        await updateSeries(editingId, form);
      } else {
        if (!isAdmin) return alert("Bạn không có quyền thêm mới.");
        await createSeries(form);
      }
      const [seriesList] = await Promise.all([getAllSeries()]);
      setSubCategories(Array.isArray(seriesList) ? seriesList : []);
      setForm({ name: "", description: "", categoryId: "" });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      alert(err?.message || "Lưu thất bại");
    }
  };

  const handleEdit = (s) => {
    setForm({
      name: s.name,
      description: s.description,
      categoryId: s.categoryId,
    });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return alert("Bạn không có quyền xóa.");
    if (!window.confirm("Bạn có chắc muốn xóa danh mục con này?")) return;
    try {
      await deleteSeries(id);
      const [seriesList] = await Promise.all([getAllSeries()]);
      setSubCategories(Array.isArray(seriesList) ? seriesList : []);
    } catch (err) {
      alert(err?.message || "Xóa thất bại");
    }
  };

  const filtered = subCategories.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryName = (id) =>
    categories.find((c) => c.id === id)?.name || "Không xác định";

  return (
    <div className="sub-category-section">
      <div className="header-bar">
        <h3>📁 Quản lý danh mục con</h3>
        <button
          className="btn add"
          onClick={() => {
            if (!isAdmin) return alert("Bạn không có quyền thêm mới.");
            setShowForm(!showForm);
            setForm({ name: "", description: "", categoryId: "" });
            setEditingId(null);
          }}
        >
          {showForm ? "✖ Đóng form" : "➕ Thêm danh mục con"}
        </button>
      </div>

      <input
        type="text"
        placeholder="🔍 Tìm theo tên danh mục con..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      <table className="sub-category-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên danh mục con</th>
            <th>Mô tả</th>
            <th>Thuộc danh mục</th>
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
            filtered.map((s, idx) => (
              <tr key={s.id}>
                <td>{idx + 1}</td>
                <td>{s.name}</td>
                <td>{s.description || "-"}</td>
                <td>{getCategoryName(s.categoryId)}</td>
                <td>
                  <button className="btn edit" onClick={() => handleEdit(s)} disabled={!isAdmin}>
                    ✏️ Sửa
                  </button>
                  <button
                    className="btn delete"
                    onClick={() => handleDelete(s.id)}
                    disabled={!isAdmin}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", color: "#6b7280" }}>
                Không có danh mục con
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <form onSubmit={handleSubmit} className="sub-category-form">
          <h4>{editingId ? "Cập nhật danh mục con" : "Thêm danh mục con mới"}</h4>

          <input
            type="text"
            placeholder="Tên danh mục con"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <textarea
            placeholder="Mô tả"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
          >
            <option value="">-- Chọn danh mục cha --</option>
            {categories.map((c) => (
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
                setForm({ name: "", description: "", categoryId: "" });
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

export default SubCategoriesSection;
