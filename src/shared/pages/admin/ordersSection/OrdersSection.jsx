import React, { useEffect, useMemo, useState } from "react";
import { getAllOrders, updateOrderStatus, ORDER_STATUSES } from "../../../utils/api/ordersApi";
import "./OrdersSection.css";

function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllOrders();
      // Accept both raw array and { data/result } shapes
      const data = Array.isArray(res) ? res : (res?.data?.result ?? res?.data ?? res?.result ?? []);
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Không tải được danh sách đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      await load();
    })();
    return () => { mounted = false; };
  }, []);

  const filteredOrders = useMemo(() => {
    if (!filter) return orders;
    const f = filter.toLowerCase();
    return orders.filter(o =>
      String(o?.id ?? "").includes(f) ||
      String(o?.customerName ?? o?.userName ?? o?.fullName ?? "").toLowerCase().includes(f) ||
      String(o?.status ?? "").toLowerCase().includes(f)
    );
  }, [orders, filter]);

  const handleChangeStatus = async (orderId, newStatus) => {
    if (!newStatus) return;
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      await load();
    } catch (e) {
      alert(e?.message || "Cập nhật trạng thái thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="orders-section">
      <div className="orders-header">
        <h3>📦 Quản lý đơn hàng</h3>
        <div className="toolbar">
          <input
            placeholder="Tìm theo mã, khách hàng, trạng thái..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button onClick={load} disabled={loading}>{loading ? "Đang tải..." : "Tải lại"}</button>
        </div>
      </div>

      {error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="orders-table">
          <div className="orders-row orders-row--head">
            <div className="col col--id">Mã</div>
            <div className="col col--customer">Khách hàng</div>
            <div className="col col--total">Tổng tiền</div>
            <div className="col col--status">Trạng thái</div>
            <div className="col col--created">Ngày tạo</div>
            <div className="col col--actions">Thao tác</div>
          </div>
          {filteredOrders.map((o) => {
            const id = o?.id ?? o?.orderId;
            const customerName = o?.customerName ?? o?.userName ?? o?.fullName ?? "N/A";
            const total = o?.totalAmount ?? o?.total ?? 0;
            const status = o?.status ?? "";
            const createdAt = o?.createdAt ?? o?.created_date ?? o?.createdDate ?? "";
            const isExpanded = expandedId === id;
            return (
              <div key={id} className="orders-group">
                <div className="orders-row">
                  <div className="col col--id">#{id}</div>
                  <div className="col col--customer">{customerName}</div>
                  <div className="col col--total">{Number(total).toLocaleString()} đ</div>
                  <div className="col col--status">
                    <select
                      value={status}
                      onChange={(e) => handleChangeStatus(id, e.target.value)}
                      disabled={updatingId === id}
                    >
                      {ORDER_STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col col--created">{String(createdAt).slice(0,19).replace('T',' ')}</div>
                  <div className="col col--actions">
                    <button onClick={() => setExpandedId(isExpanded ? null : id)}>
                      {isExpanded ? "Ẩn chi tiết" : "Xem chi tiết"}
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="orders-details">
                    <div className="details-grid">
                      <div>
                        <div className="details-title">Thông tin khách hàng</div>
                        <div>Tên: {customerName}</div>
                        <div>Email: {o?.customerEmail ?? o?.email ?? ""}</div>
                        <div>Điện thoại: {o?.customerPhone ?? o?.phone ?? ""}</div>
                        <div>Địa chỉ: {o?.shippingAddress ?? o?.address ?? ""}</div>
                      </div>
                      <div>
                        <div className="details-title">Chi tiết thanh toán</div>
                        <div>Phương thức: {o?.paymentMethod ?? ""}</div>
                        <div>Trạng thái TT: {o?.paymentStatus ?? ""}</div>
                        <div>Phí vận chuyển: {Number(o?.shippingFee ?? 0).toLocaleString()} đ</div>
                        <div>Giảm giá: {Number(o?.discount ?? 0).toLocaleString()} đ</div>
                      </div>
                    </div>
                    <div className="items">
                      <div className="details-title">Sản phẩm</div>
                      <div className="items-head">
                        <div>Sản phẩm</div>
                        <div>Số lượng</div>
                        <div>Đơn giá</div>
                        <div>Thành tiền</div>
                      </div>
                      {(o?.items ?? o?.orderItems ?? []).map((it, idx) => (
                        <div key={idx} className="items-row">
                          <div>{it?.productName ?? it?.name ?? `SP ${idx+1}`}</div>
                          <div>{it?.quantity ?? 0}</div>
                          <div>{Number(it?.price ?? it?.unitPrice ?? 0).toLocaleString()} đ</div>
                          <div>{Number((it?.quantity ?? 0) * (it?.price ?? it?.unitPrice ?? 0)).toLocaleString()} đ</div>
                        </div>
                      ))}
                    </div>
                    <div className="summary">
                      <div>Tổng cộng: <strong>{Number(total).toLocaleString()} đ</strong></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {!loading && filteredOrders.length === 0 && (
            <div className="empty">Không có đơn hàng</div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrdersSection;


