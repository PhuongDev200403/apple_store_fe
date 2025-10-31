import React, { useEffect, useMemo, useState } from "react";
import "./CartSection.css";

function CartSection() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // Hardcoded mock data
  const MOCK_CARTS = [
    {
      id: 101,
      userId: 2,
      createdAt: "2025-10-20T09:20:30",
      updatedAt: "2025-10-21T11:05:10",
      items: [
        { productId: 10, productName: "iPhone 15 Pro Max", quantity: 1, price: 34990000 },
        { productId: 22, productName: "AirPods Pro 2", quantity: 1, price: 5290000 }
      ]
    },
    {
      id: 102,
      userId: 4,
      createdAt: "2025-10-08T10:02:00",
      updatedAt: "2025-10-10T13:45:00",
      items: [
        { productId: 18, productName: "iPad Air M2", quantity: 1, price: 16990000 }
      ]
    }
  ];

  const calcTotal = (cart) => (cart?.items ?? []).reduce((sum, it) => sum + (it.quantity || 0) * (it.price || 0), 0);

  const load = async () => {
    setLoading(true);
    // use hardcoded data
    setCarts(MOCK_CARTS);
    setLoading(false);
  };

  useEffect(() => { (async () => { await load(); })(); }, []);

  const filtered = useMemo(() => {
    if (!filter) return carts;
    const f = filter.toLowerCase();
    return carts.filter(c => String(c.id).includes(f) || String(c.userId).includes(f));
  }, [carts, filter]);

  return (
    <div className="cart-section">
      <div className="cart-header">
        <h3>🛍️ Quản lý giỏ hàng</h3>
        <div className="toolbar">
          <input
            placeholder="Lọc theo Cart ID hoặc User ID"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button onClick={load} disabled={loading}>{loading ? "Đang tải..." : "Tải lại"}</button>
        </div>
      </div>

      <div className="cart-table">
        <div className="cart-row cart-row--head">
          <div className="col col--id">Cart ID</div>
          <div className="col col--user">User ID</div>
          <div className="col col--items">Số item</div>
          <div className="col col--total">Tổng tiền</div>
          <div className="col col--created">Tạo lúc</div>
          <div className="col col--updated">Cập nhật</div>
          <div className="col col--actions">Thao tác</div>
        </div>
        {filtered.map((c) => {
          const total = calcTotal(c);
          const isExpanded = expandedId === c.id;
          return (
            <div className="cart-group" key={c.id}>
              <div className="cart-row">
                <div className="col col--id">{c.id}</div>
                <div className="col col--user">{c.userId}</div>
                <div className="col col--items"><span className="badge">{(c.items || []).length}</span></div>
                <div className="col col--total">{Number(total).toLocaleString()} đ</div>
                <div className="col col--created">{String(c.createdAt).slice(0,19).replace('T',' ')}</div>
                <div className="col col--updated">{String(c.updatedAt).slice(0,19).replace('T',' ')}</div>
                <div className="col col--actions">
                  <button onClick={() => setExpandedId(isExpanded ? null : c.id)}>
                    {isExpanded ? "Ẩn chi tiết" : "Xem chi tiết"}
                  </button>
                </div>
              </div>
              {isExpanded && (
                <div className="cart-details">
                  <div className="details-title">Sản phẩm trong giỏ</div>
                  <div className="items-head">
                    <div>Sản phẩm</div>
                    <div>Số lượng</div>
                    <div>Đơn giá</div>
                    <div>Thành tiền</div>
                  </div>
                  {(c.items || []).map((it, idx) => (
                    <div className="items-row" key={idx}>
                      <div>{it.productName}</div>
                      <div>{it.quantity}</div>
                      <div>{Number(it.price).toLocaleString()} đ</div>
                      <div>{Number(it.quantity * it.price).toLocaleString()} đ</div>
                    </div>
                  ))}
                  <div className="summary">Tổng cộng: <strong>{Number(total).toLocaleString()} đ</strong></div>
                </div>
              )}
            </div>
          );
        })}
        {!loading && filtered.length === 0 && (
          <div className="empty">Không có giỏ hàng</div>
        )}
      </div>
    </div>
  );
}

export default CartSection;


