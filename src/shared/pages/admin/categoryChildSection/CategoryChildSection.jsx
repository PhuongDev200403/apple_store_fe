import React, { useEffect, useState } from "react";
import {
    getCategoryChildren,
    createCategoryChild,
    updateCategoryChild,
    deleteCategoryChild,
} from "../../../utils/api/categoryChildApi";
import "./CategoryChildSection.css"; // dùng lại CSS vì giao diện tương tự

function CategoryChildSection() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ name: "", description: "", categoryId: "" });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [categories, setCategories] = useState([]);

    // ✅ Lấy danh mục cha (để chọn)
    const loadCategories = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/categories");
            const data = await res.json();
            if (data?.result) setCategories(data.result);
        } catch (err) {
            console.error("Lỗi khi load categories:", err);
        }
    };

    // ✅ Lấy danh mục con
    const loadItems = async () => {
        setLoading(true);
        try {
            const res = await getCategoryChildren();
            if (res.data && Array.isArray(res.data.result)) {
                setItems(res.data.result);
            } else {
                console.error("Không nhận diện được cấu trúc response:", res.data);
                setItems([]);
            }
        } catch (err) {
            console.error("Lỗi khi lấy danh mục con:", err);
            setItems([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Gọi song song 2 API
                const [resChild, resParent] = await Promise.all([
                    getCategoryChildren(),
                    fetch("http://localhost:8080/api/categories").then((r) => r.json())
                ]);

                const childData = resChild.data?.result || [];
                const parentData = resParent?.result || [];

                setCategories(parentData); // ✅ để dropdown hiển thị danh mục cha

                // Map tên danh mục cha
                const combined = childData.map((c) => {
                    const parent = parentData.find((p) => p.id === c.categoryId);
                    return {
                        ...c,
                        categoryName: parent ? parent.name : "—",
                    };
                });

                setItems(combined);
            } catch (err) {
                console.error("Lỗi khi load danh mục con hoặc cha:", err);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form };
            if (editingId) {
                await updateCategoryChild(editingId, payload);
            } else {
                await createCategoryChild(payload);
            }
            await loadItems();
            setForm({ name: "", description: "", categoryId: "" });
            setEditingId(null);
            setShowForm(false);
        } catch (err) {
            console.error("Lỗi khi lưu danh mục con:", err);
        }
    };

    const handleEdit = (item) => {
        setForm({
            name: item.name,
            description: item.description || "",
            categoryId: item.categoryId || "",
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục con này?")) return;
        try {
            await deleteCategoryChild(id);
            await loadItems();
        } catch (err) {
            console.error("Lỗi khi xóa danh mục con:", err);
        }
    };

    const filtered = items.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="user-section">
            <div className="header-bar">
                <h3>📁 Quản lý danh mục con</h3>
                <button className="btn add" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "➖ Ẩn form" : "➕ Thêm danh mục con"}
                </button>
            </div>

            <input
                type="text"
                placeholder="🔍 Tìm theo tên danh mục con..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-box"
            />

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên danh mục con</th>
                            <th>Mô tả</th>
                            <th>Danh mục cha</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? (
                            filtered.map((i, idx) => (
                                <tr key={i.id}>
                                    <td>{idx + 1}</td>
                                    <td>{i.name}</td>
                                    <td>{i.description || "-"}</td>
                                    <td>{i.categoryName || "-"}</td>
                                    <td>
                                        <button className="btn edit" onClick={() => handleEdit(i)}>
                                            ✏️ Sửa
                                        </button>
                                        <button className="btn delete" onClick={() => handleDelete(i.id)}>
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
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="user-form">
                    <h4>{editingId ? "Cập nhật danh mục con" : "Thêm danh mục con"}</h4>
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
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "12px" }}
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
                            {editingId ? "💾 Lưu" : "➕ Thêm"}
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
                            ❌ Hủy
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default CategoryChildSection;
