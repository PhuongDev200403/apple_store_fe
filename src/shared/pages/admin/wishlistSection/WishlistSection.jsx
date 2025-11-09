import React, { useEffect, useMemo, useState } from "react";
import "./WishlistSection.css";

function WishlistSection() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [detail, setDetail] = useState(null);
  const [detailUserId, setDetailUserId] = useState("");
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Hardcoded mock data
  const MOCK_WISHLISTS = [
    {
      id: 1,
      userId: 2,
      createdAt: "2025-09-19T16:50:07.802418",
      updatedAt: "2025-10-17T16:03:46.95758",
      items: []
    },
    {
      id: 2,
      userId: 4,
      createdAt: "2025-10-08T23:16:09.13048",
      updatedAt: "2025-10-08T23:16:09.13048",
      items: []
    }
  ];

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      // Use hardcoded data instead of API
      setList(MOCK_WISHLISTS);
    } catch (e) {
      setError(e?.message || "Không tải được danh sách wishlist");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => { await load(); })();
  }, []);

  const filtered = useMemo(() => {
    if (!filter) return list;
    const f = filter.toLowerCase();
    return list.filter(w =>
      String(w?.id ?? "").includes(f) ||
      String(w?.userId ?? "").includes(f)
    );
  }, [list, filter]);

  const openDetailByUserId = async (userId) => {
    if (!userId) return;
    setLoadingDetail(true);
    setDetail(null);
    try {
      const found = MOCK_WISHLISTS.find(w => String(w.userId) === String(userId));
      if (!found) {
        setDetail({ error: "Không tìm thấy wishlist cho userId này" });
      } else {
        setDetail(found);
      }
      setDetailUserId(userId);
    } catch (e) {
      setDetail({ error: e?.message || "Không lấy được chi tiết" });
      setDetailUserId(userId);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="wishlist-section">
      <div className="wishlist-header">
        <h3>❤️ Quản lý danh sách yêu thích</h3>
        <div className="toolbar">
          <input
            placeholder="Lọc theo ID wishlist hoặc userId"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button onClick={load} disabled={loading}>{loading ? "Đang tải..." : "Tải lại"}</button>
        </div>
      </div>

      {/* Top form card for viewing details by userId */}
      <div className="wishlist-topform">
        <div className="detail-header">
          <div className="title">Xem chi tiết theo User ID</div>
          <div className="inline">
            <input
              placeholder="Nhập userId..."
              value={String(detailUserId ?? '')}
              onChange={(e) => setDetailUserId(e.target.value)}
            />
            <button onClick={() => openDetailByUserId(detailUserId)} disabled={loadingDetail}>
              {loadingDetail ? 'Đang lấy...' : 'Lấy chi tiết'}
            </button>
          </div>
        </div>

        {detail && (
          <div className="detail-body">
            {detail?.error ? (
              <div className="error">{detail.error}</div>
            ) : (
              <>
                <div className="meta">
                  <div>ID: {detail?.id ?? ''}</div>
                  <div>User ID: {detail?.userId ?? ''}</div>
                  <div>Tạo: {String(detail?.createdAt ?? '').slice(0,19).replace('T',' ')}</div>
                  <div>Cập nhật: {String(detail?.updatedAt ?? '').slice(0,19).replace('T',' ')}</div>
                </div>
                <div className="items">
                  <div className="details-title">Items</div>
                <div className="items-head">
                    <div>Sản phẩm</div>
                    <div>Ghi chú</div>
                  </div>
                  {(detail?.items ?? []).map((it, idx) => (
                    <div className="items-row" key={idx}>
                      <div>{it?.productName ?? it?.name ?? `Item ${idx+1}`}</div>
                      <div>{it?.note ?? ''}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="wishlist-table">
          <div className="wl-row wl-row--head">
            <div className="col col--id">ID</div>
            <div className="col col--user">User ID</div>
            <div className="col col--items">Số item</div>
            <div className="col col--created">Tạo lúc</div>
            <div className="col col--updated">Cập nhật</div>
            <div className="col col--actions">Thao tác</div>
          </div>
          {filtered.map(w => {
            const id = w?.id;
            const userId = w?.userId;
            const itemsCount = (w?.items ?? []).length;
            return (
              <div className="wl-row" key={`${id}-${userId}`}>
                <div className="col col--id">{id}</div>
                <div className="col col--user">{userId}</div>
                <div className="col col--items">{itemsCount}</div>
                <div className="col col--created">{String(w?.createdAt ?? '').slice(0,19).replace('T',' ')}</div>
                <div className="col col--updated">{String(w?.updatedAt ?? '').slice(0,19).replace('T',' ')}</div>
                <div className="col col--actions">
                  <button onClick={() => openDetailByUserId(userId)} disabled={loadingDetail}>
                    {loadingDetail && detailUserId === userId ? 'Đang mở...' : 'Xem chi tiết'}
                  </button>
                </div>
              </div>
            );
          })}
          {!loading && filtered.length === 0 && (
            <div className="empty">Không có dữ liệu</div>
          )}
        </div>
      )}

      {/* bottom detail panel removed; now shown in top form */}
    </div>
  );
}

export default WishlistSection;


