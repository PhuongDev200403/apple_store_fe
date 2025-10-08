import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../../../utils/api/userApi";
import "./UsersSection.css";

function UsersSection() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    phone: "",
    email: "",
    role: "USER",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Load danh sách users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      if (res.data && Array.isArray(res.data.result)) {
        setUsers(res.data.result);
      } else {
        console.error("Không nhận diện được cấu trúc response:", res.data);
        setUsers([]);
      }
    } catch (err) {
      console.error("Lỗi khi lấy users:", err);
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (editingId) {
        await updateUser(editingId, payload);
      } else {
        await createUser(payload);
      }
      await loadUsers();
      setForm({
        username: "",
        password: "",
        phone: "",
        email: "",
        role: "USER",
      });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Lỗi khi lưu user:", err);
    }
  };

  const handleEdit = (u) => {
    setForm({
      username: u.username,
      password: "",
      phone: u.phone || "",
      email: u.email || "",
      role: u.role || "USER",
    });
    setEditingId(u.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
    }
  };

  const filtered = users.filter(
    (u) =>
      (u.username && u.username.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="user-section">
      <div className="header-bar">
        <h3>👤 Quản lý người dùng</h3>
        <button className="btn add" onClick={() => setShowForm(!showForm)}>
          {showForm ? "➖ Ẩn form" : "➕ Thêm người dùng"}
        </button>
      </div>

      <input
        type="text"
        placeholder="🔍 Tìm theo username hoặc email..."
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
              <th>Username</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Role</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((u, idx) => (
                <tr key={u.id}>
                  <td>{idx + 1}</td>
                  <td>{u.username}</td>
                  <td>{u.phone || "-"}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`role-tag ${
                        u.role === "ADMIN"
                          ? "admin"
                          : u.role === "STAFF"
                          ? "staff"
                          : "user"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <button className="btn edit" onClick={() => handleEdit(u)}>
                      ✏️ Sửa
                    </button>
                    <button className="btn delete" onClick={() => handleDelete(u.id)}>
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#6b7280" }}>
                  Không có người dùng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="user-form">
          <h4>{editingId ? "Cập nhật User" : "Thêm User mới"}</h4>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!editingId}
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>

          <div className="form-actions">
            <button type="submit" className="btn save">
              {editingId ? "💾 Lưu" : "➕ Thêm"}
            </button>
            <button
              type="button"
              className="btn cancel"
              onClick={() => {
                setForm({
                  username: "",
                  password: "",
                  phone: "",
                  email: "",
                  role: "USER",
                });
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

export default UsersSection;
