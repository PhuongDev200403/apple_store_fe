import React, { useState, useEffect } from "react";
import "./SubCategoriesSection.css";

function SubCategoriesSection() {
  const [subCategories, setSubCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", categoryId: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  // Dữ liệu mẫu
  const sampleData = [
    {
      id: 1,
      name: "Iphone 14 series",
      description: "Đang cập nhật thông tin",
      categoryId: 1,
    },
    {
      id: 3,
      name: "Iphone 13 series",
      description:
        "Được ra mắt thị trường năm 2021 và dần trở nên thịnh hành với nhiều tính năng mạnh mẽ",
      categoryId: 1,
    },
    {
      id: 4,
      name: "Iphone 12 series",
      description:
        "Được ra mắt thị trường năm 2020 và dần trở nên thịnh hành với nhiều tính năng mạnh mẽ",
      categoryId: 1,
    },
    {
      id: 7,
      name: "Iphone 11 series",
      description:
        "Được ra mắt thị trường năm 2019 và dần trở nên thịnh hành với nhiều tính năng mạnh mẽ",
      categoryId: 1,
    },
  ];

  const categories = [
    { id: 1, name: "Điện thoại" },
    { id: 2, name: "Máy tính bảng" },
    { id: 3, name: "Phụ kiện" },
  ];

  useEffect(() => {
    setSubCategories(sampleData);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.categoryId)
      return alert("Vui lòng nhập đầy đủ thông tin.");

    if (editingId) {
      setSubCategories((prev) =>
        prev.map((s) =>
          s.id === editingId ? { ...s, ...form, categoryId: parseInt(form.categoryId) } : s
        )
      );
    } else {
      const newSub = {
        id: Date.now(),
        name: form.name,
        description: form.description,
        categoryId: parseInt(form.categoryId),
      };
      setSubCategories((prev) => [...prev, newSub]);
    }

    setForm({ name: "", description: "", categoryId: "" });
    setEditingId(null);
    setShowForm(false);
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

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục con này?")) {
      setSubCategories((prev) => prev.filter((s) => s.id !== id));
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
          {filtered.length > 0 ? (
            filtered.map((s, idx) => (
              <tr key={s.id}>
                <td>{idx + 1}</td>
                <td>{s.name}</td>
                <td>{s.description || "-"}</td>
                <td>{getCategoryName(s.categoryId)}</td>
                <td>
                  <button className="btn edit" onClick={() => handleEdit(s)}>
                    ✏️ Sửa
                  </button>
                  <button
                    className="btn delete"
                    onClick={() => handleDelete(s.id)}
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
