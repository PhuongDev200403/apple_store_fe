// src/shared/pages/admin/ordersSection/OrdersSection.jsx
import { useState, useEffect, useMemo } from "react";
import { getAllOrders, updateOrderStatus } from "../../../utils/api/ordersApi";
import "./OrdersSection.css";

const STATUS_OPTIONS = ["PENDING", "SHIPPED", "COMPLETED", "CANCELLED"];

export default function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllOrders();
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.result || [];
      setOrders(data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Không thể tải đơn hàng.";
      setError(msg);
      if (err.response?.status === 403 || err.response?.status === 401) {
        setError("Bạn không có quyền truy cập. Vui lòng đăng nhập bằng tài khoản Admin.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!search) return orders;
    const s = search.toLowerCase();
    return orders.filter(
      (o) =>
        String(o.orderId || "").includes(s) ||
        String(o.username || "").toLowerCase().includes(s) ||
        String(o.email || "").toLowerCase().includes(s) ||
        String(o.status || "").toLowerCase().includes(s)
    );
  }, [orders, search]);

  const handleStatusChange = async (orderId, newStatus) => {
    if (updatingId) return;
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
      );
      setSelectedOrder((prev) => prev && { ...prev, status: newStatus });
    } catch (err) {
      alert(err.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

  const exportToPDF = () => {
    if (!selectedOrder) return;
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <title>Hóa đơn #${selectedOrder.orderId}</title>
        <style>
          body { font-family: 'DejaVu Sans', Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .invoice { max-width: 800px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
          .header { text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #4f46e5; }
          .header h1 { margin: 0; color: #4f46e5; font-size: 24px; }
          .info-table, .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .info-table th, .info-table td, .items-table th, .items-table td { padding: 10px; border: 1px solid #ddd; text-align: left; }
          .info-table th { background: #f8f9fa; font-weight: 600; width: 30%; }
          .items-table th { background: #4f46e5; color: white; }
          .items-table .total { font-weight: bold; background: #f0f9ff; }
          .text-right { text-align: right; }
          @media print { body { padding: 10px; } }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <h1>SHOP APPLE STORE</h1>
            <p>Hóa đơn điện tử #${selectedOrder.orderId}</p>
          </div>
          <table class="info-table">
            <tr><th>Khách hàng</th><td>${selectedOrder.username}</td></tr>
            <tr><th>Email</th><td>${selectedOrder.email}</td></tr>
            <tr><th>SĐT</th><td>${selectedOrder.phone || "N/A"}</td></tr>
            <tr><th>Địa chỉ</th><td>${selectedOrder.shippingAddress}</td></tr>
            <tr><th>Phương thức</th><td>${selectedOrder.shippingMethod}</td></tr>
            <tr><th>Ghi chú</th><td>${selectedOrder.note || "Không có"}</td></tr>
            <tr><th>Ngày đặt</th><td>${new Date(selectedOrder.orderDate).toLocaleString("vi-VN")}</td></tr>
            <tr><th>Trạng thái</th><td><strong>${selectedOrder.status}</strong></td></tr>
          </table>
          <table class="items-table">
            <thead>
              <tr><th>STT</th><th>Sản phẩm</th><th class="text-right">SL</th><th class="text-right">Giá</th><th class="text-right">Tổng</th></tr>
            </thead>
            <tbody>
              ${selectedOrder.items.map((item, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td><strong>${item.productName}</strong></td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">${item.price.toLocaleString("vi-VN")}₫</td>
                  <td class="text-right">${(item.price * item.quantity).toLocaleString("vi-VN")}₫</td>
                </tr>`).join("")}
              <tr class="total">
                <td colspan="4" class="text-right"><strong>TỔNG CỘNG</strong></td>
                <td class="text-right"><strong>${selectedOrder.totalAmount.toLocaleString("vi-VN")}₫</strong></td>
              </tr>
            </tbody>
          </table>
          <p style="text-align: center; margin-top: 30px; color: #666; font-size: 0.9em;">
            Cảm ơn quý khách đã mua sắm tại <strong>Apple Store</strong>!
          </p>
        </div>
      </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 600);
  };

  if (error.includes("quyền")) {
    return (
      <div className="orders-manager">
        <div className="orders-container" style={{ padding: "3rem", textAlign: "center" }}>
          <h3 style={{ color: "#991b1b" }}>Truy cập bị từ chối</h3>
          <p>{error}</p>
          <button onClick={() => window.location.href = "/dang-nhap"} className="btn btn-primary">
            Đăng nhập lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-manager">
      <div className="orders-container">
        <div className="orders-toolbar">
          <div className="search-box">
            <span className="search-icon"></span>
            <input
              type="text"
              placeholder="Tìm theo mã, khách, email, trạng thái..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={loadOrders} disabled={loading} className="btn btn-secondary">
            {loading ? "Loading..." : "Refresh Tải lại"}
          </button>
        </div>

        {error && !error.includes("quyền") && (
          <div className="error-box">{error}</div>
        )}

        {/* BẢNG DANH SÁCH ĐƠN HÀNG */}
        {loading ? (
          <div className="loading">Loading Đang tải...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty">
            <h3>Empty Không có đơn hàng nào</h3>
          </div>
        ) : (
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Email</th>
                  <th>Ngày đặt</th>
                  <th>Trạng thái</th>
                  <th className="text-right">Tổng tiền</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="order-row"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td><strong>#{order.orderId}</strong></td>
                    <td>{order.username}</td>
                    <td>{order.email}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString("vi-VN")}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(order.orderId, e.target.value);
                        }}
                        disabled={updatingId === order.orderId}
                        className={`status-select status-${order.status.toLowerCase()}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="text-right">
                      <strong>{order.totalAmount?.toLocaleString("vi-VN") || 0}₫</strong>
                    </td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="btn-view"
                      >
                        View Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: BẢNG CHI TIẾT */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Hóa đơn #{selectedOrder.orderId}</h2>
              <button onClick={() => setSelectedOrder(null)} className="close-btn">Close</button>
            </div>

            <div className="modal-body">
              <table className="info-table">
                <tbody>
                  <tr><th>Khách hàng</th><td>{selectedOrder.username}</td></tr>
                  <tr><th>Email</th><td>{selectedOrder.email}</td></tr>
                  <tr><th>SĐT</th><td>{selectedOrder.phone || "N/A"}</td></tr>
                  <tr><th>Địa chỉ</th><td>{selectedOrder.shippingAddress}</td></tr>
                  <tr><th>Phương thức</th><td>{selectedOrder.shippingMethod}</td></tr>
                  <tr><th>Ghi chú</th><td>{selectedOrder.note || "Không có"}</td></tr>
                  <tr><th>Ngày đặt</th><td>{new Date(selectedOrder.orderDate).toLocaleString("vi-VN")}</td></tr>
                  <tr>
                    <th>Trạng thái</th>
                    <td>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleStatusChange(selectedOrder.orderId, e.target.value)}
                        disabled={updatingId === selectedOrder.orderId}
                        className={`status-select status-${selectedOrder.status.toLowerCase()}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3 style={{ margin: "1.5rem 0 1rem" }}>Chi tiết sản phẩm</h3>
              <table className="items-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Sản phẩm</th>
                    <th className="text-right">SL</th>
                    <th className="text-right">Giá</th>
                    <th className="text-right">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.items || []).map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td><strong>{item.productName}</strong></td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">{item.price.toLocaleString("vi-VN")}₫</td>
                      <td className="text-right">{(item.price * item.quantity).toLocaleString("vi-VN")}₫</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td colSpan="4" className="text-right"><strong>TỔNG CỘNG</strong></td>
                    <td className="text-right"><strong>{selectedOrder.totalAmount.toLocaleString("vi-VN")}₫</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="modal-footer">
              <button onClick={exportToPDF} className="btn btn-primary">
                PDF In hóa đơn
              </button>
              <button onClick={() => setSelectedOrder(null)} className="btn btn-secondary">
                Close Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}