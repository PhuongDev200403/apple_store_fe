// src/components/admin/UsersSection/UsersSection.jsx
import { useState, useEffect, useMemo } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../utils/api/userApi";
import "./UsersSection.css";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

export default function UsersSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Form
  const [form, setForm] = useState({
    username: "",
    password: "",
    phone: "",
    email: "",
    role: "USER",
  });
  const [formError, setFormError] = useState("");

  const isAdmin = (localStorage.getItem("role") || "").toLowerCase() === "admin";

  useEffect(() => {
    if (!isAdmin) {
      setError("Bạn không có quyền truy cập trang này.");
      setLoading(false);
      return;
    }
    loadUsers();
  }, [isAdmin]);

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Không tải được người dùng: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const s = search.toLowerCase();
    return users.filter((u) =>
      u.username?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u.phone?.includes(s)
    );
  }, [users, search]);

  const openForm = (user = null) => {
    setEditingUser(user);
    setForm({
      username: user?.username || "",
      password: "", // luôn để trống khi sửa
      phone: user?.phone || "",
      email: user?.email || "",
      role: user?.role || "USER",
    });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormError("");
  };

  const validateForm = () => {
    if (!form.username.trim()) return "Tên người dùng không được để trống!";
    if (!form.email.trim()) return "Email không được để trống!";
    if (!form.email.includes("@")) return "Email không hợp lệ!";
    if (!editingUser && !form.password) return "Mật khẩu bắt buộc khi tạo mới!";
    if (form.password && form.password.length < 6) return "Mật khẩu ít nhất 6 ký tự!";
    if (form.phone && !/^\d{10,11}$/.test(form.phone.replace(/\D/g, "")))
      return "Số điện thoại không hợp lệ!";
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
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        role: form.role,
      };

      if (!editingUser) {
        payload.password = form.password;
      }

      if (editingUser) {
        await updateUser(editingUser.id, payload);
      } else {
        await createUser(payload);
      }

      closeForm();
      loadUsers();
    } catch (err) {
      setFormError(err.message || "Lưu thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa người dùng này? Không thể khôi phục!")) return;

    setDeletingId(id);
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      alert("Xóa thất bại: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="users-manager">
        <div className="users-container access-denied">
          <h3>Truy cập bị từ chối</h3>
          <p>{error || "Chỉ Admin được phép truy cập."}</p>
          <button onClick={() => window.location.href = "/login"} className="btn btn-primary">
            Đăng nhập lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="users-manager">
      <div className="users-container">
        <header className="users-header">
          <h1 className="page-title">Quản Lý Người Dùng</h1>
          <p className="subtitle">Thêm, sửa, xóa tài khoản người dùng</p>
        </header>

        <div className="toolbar">
          <div className="search-box">
            <span className="search-icon">Search</span>
            <input
              placeholder="Tìm tên, email, số điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={() => openForm()} className="btn btn-primary">
            Plus Thêm người dùng
          </button>
          <button onClick={loadUsers} disabled={loading} className="btn btn-secondary">
            {loading ? "Loading..." : "Refresh Tải lại"}
          </button>
        </div>

        {error && <div className="error-box">{error}</div>}

        {loading ? (
          <div className="loading">Đang tải người dùng...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <h3>Không có người dùng</h3>
            <p>Thử thay đổi từ khóa tìm kiếm.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>SĐT</th>
                  <th>Role</th>
                  <th>Tạo</th>
                  <th>Cập nhật</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="user-row">
                    <td><strong>#{u.id}</strong></td>
                    <td className="user-name">{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || "—"}</td>
                    <td>
                      <span className={`role-badge ${u.role?.toLowerCase()}`}>
                        {u.role || "—"}
                      </span>
                    </td>
                    <td>{formatDate(u.createAt)}</td>
                    <td>{formatDate(u.updateAt)}</td>
                    <td className="actions">
                      <button onClick={() => openForm(u)} className="btn-edit">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        disabled={deletingId === u.id || u.role === "ADMIN"}
                        className="btn-delete"
                        title={u.role === "ADMIN" ? "Không thể xóa Admin" : ""}
                      >
                        {deletingId === u.id ? "Deleting..." : "Delete"}
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
              <h2>{editingUser ? "Edit Sửa người dùng" : "Plus Thêm người dùng"}</h2>
              <button onClick={closeForm} className="close-btn">Close</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              {formError && <div className="form-error">{formError}</div>}

              <div className="input-group">
                <label>Tên người dùng *</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="VD: Nguyễn Văn A"
                  required
                />
              </div>

              {!editingUser && (
                <div className="input-group">
                  <label>Mật khẩu *</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Ít nhất 6 ký tự"
                    required
                  />
                </div>
              )}

              <div className="input-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@gmail.com"
                  required
                />
              </div>

              <div className="input-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-11 số"
                />
              </div>

              <div className="input-group">
                <label>Role *</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn-save">
                  {editingUser ? "Update Cập nhật" : "Create Tạo mới"}
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