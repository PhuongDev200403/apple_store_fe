import React, { useState } from "react";
import "./AdminPage.css";


function UsersSection() {
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "a@example.com" },
    { id: 2, name: "Trần Thị B", email: "b@example.com" },
    { id: 3, name: "Lê Văn C", email: "c@example.com" },
    { id: 4, name: "Phạm Thị D", email: "d@example.com" },
    { id: 5, name: "Hoàng Văn E", email: "e@example.com" },
    { id: 6, name: "Đỗ Thị F", email: "f@example.com" },
    { id: 7, name: "Bùi Văn G", email: "g@example.com" },
    { id: 8, name: "Lý Thị H", email: "h@example.com" },
  ]);

  const [form, setForm] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // 🔹 số user mỗi trang

  // Lọc user theo search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIdx = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIdx, startIdx + usersPerPage);

  // Thêm hoặc cập nhật user
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    if (editingId) {
      setUsers(
        users.map((u) => (u.id === editingId ? { ...u, ...form } : u))
      );
      setEditingId(null);
    } else {
      setUsers([...users, { id: Date.now(), ...form }]);
    }
    setForm({ name: "", email: "" });
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditingId(user.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="user-section">
      <h3>Danh sách người dùng</h3>

      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="🔍 Tìm kiếm theo tên hoặc email..."
        className="search-box"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // reset về trang 1 khi tìm kiếm
        }}
      />

      {/* Bảng người dùng */}
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((u, idx) => (
              <tr key={u.id}>
                <td>{startIdx + idx + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <button className="btn edit" onClick={() => handleEdit(u)}>
                    ✏️ Sửa
                  </button>
                  <button
                    className="btn delete"
                    onClick={() => handleDelete(u.id)}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", color: "#6b7280" }}>
                Không tìm thấy người dùng
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ◀ Trước
          </button>
          <span>
            Trang {currentPage}/{totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Sau ▶
          </button>
        </div>
      )}

      {/* Form thêm / sửa */}
      <form onSubmit={handleSubmit} className="user-form">
        <h4>{editingId ? "Cập nhật người dùng" : "Thêm người dùng mới"}</h4>
        <input
          type="text"
          placeholder="Tên..."
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email..."
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button type="submit" className="btn save">
          {editingId ? "Lưu thay đổi" : "Thêm mới"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn cancel"
            onClick={() => {
              setForm({ name: "", email: "" });
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




function OrdersSection() {
  const [orders, setOrders] = useState([
    {
      id: 101,
      customer: "Nguyễn Văn A",
      total: 12000000,
      status: "pending",
      items: [
        { name: "iPhone 14 Pro", qty: 1, price: 12000000 }
      ]
    },
    {
      id: 102,
      customer: "Trần Thị B",
      total: 24000000,
      status: "shipped",
      items: [
        { name: "MacBook Air M2", qty: 1, price: 24000000 }
      ]
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  // Cập nhật trạng thái đơn hàng
  const updateStatus = (id, status) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  return (
    <div className="orders-section">
      <h3>Danh sách đơn hàng</h3>

      <table className="order-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, idx) => (
            <tr key={o.id}>
              <td>{idx + 1}</td>
              <td>{o.customer}</td>
              <td>{o.total.toLocaleString()} ₫</td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                >
                  <option value="pending">⏳ Chờ xử lý</option>
                  <option value="shipped">📦 Đang giao</option>
                  <option value="completed">✅ Hoàn tất</option>
                  <option value="cancelled">❌ Đã hủy</option>
                </select>
              </td>
              <td>
                <button
                  className="btn view"
                  onClick={() => setSelectedOrder(o)}
                >
                  👁 Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <h4>Chi tiết đơn #{selectedOrder.id}</h4>
            <p><b>Khách hàng:</b> {selectedOrder.customer}</p>
            <p><b>Tổng tiền:</b> {selectedOrder.total.toLocaleString()} ₫</p>
            <h5>Sản phẩm:</h5>
            <ul>
              {selectedOrder.items.map((item, i) => (
                <li key={i}>
                  {item.name} (x{item.qty}) - {item.price.toLocaleString()} ₫
                </li>
              ))}
            </ul>
            <button className="btn close" onClick={() => setSelectedOrder(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CartsSection() {
  return <p>🛒 Quản lý giỏ hàng...</p>;
}
function ProductsSection() {
  return <p>📱 Quản lý sản phẩm...</p>;
}
function AccountsSection() {
  return <p>🔑 Quản lý tài khoản...</p>;
}

// ================== MAIN ADMIN PAGE ==================
export default function AdminPage() {
  const [active, setActive] = useState("users");

  const sections = [
    { id: "users", label: "Quản lý người dùng" },
    { id: "orders", label: "Quản lý đơn hàng" },
    { id: "carts", label: "Quản lý giỏ hàng" },
    { id: "products", label: "Quản lý sản phẩm" },
    { id: "accounts", label: "Quản lý tài khoản" },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h1 className="logo">⚡ Admin Dashboard</h1>
        <p className="subtitle">Trang quản trị hệ thống</p>

        <nav className="menu">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActive(section.id)}
              className={`menu-item ${active === section.id ? "active" : ""}`}
            >
              {section.label}
            </button>
          ))}
        </nav>

        <p className="version">🚀 Phiên bản x.x.x</p>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <h2 className="title">
          {sections.find((s) => s.id === active).label}
        </h2>

        <div className="content-box">
          {active === "users" && <UsersSection />}
          {active === "orders" && <OrdersSection />}
          {active === "carts" && <CartsSection />}
          {active === "products" && <ProductsSection />}
          {active === "accounts" && <AccountsSection />}
        </div>
      </main>
    </div>
  );
}
