import React, { useState, useEffect } from "react";
import { getAllProducts } from "../../../utils/api/productApi";
import { getAllVariants, createVariant } from "../../../utils/api/variantApi";
import "./VariantsSection.css";

const VariantsSection = () => {
  const [variants, setVariants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingVariant, setEditingVariant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [variantsLoading, setVariantsLoading] = useState(true);
  const isAdmin = (localStorage.getItem('role') || '').toLowerCase() === 'admin';
  const [showDetail, setShowDetail] = useState(false);
  const [detailVariant, setDetailVariant] = useState(null);
  const [specRows, setSpecRows] = useState([{ key: '', value: '' }]);
  const [formData, setFormData] = useState({
    price: "",
    color: "",
    memory: "",
    quantity: "",
    sku: "",
    status: "ACTIVE",
    imageUrl: "",
    productId: "",
    specifications: "",
    slug: "",
  });

  function formatCurrency(value) {
    const num = Number(value || 0);
    if (!Number.isFinite(num)) return '—';
    return num.toLocaleString('vi-VN') + '₫';
  }

  function parseSpecificationsToRows(specString) {
    const text = String(specString || '').trim();
    if (!text) return [{ key: '', value: '' }];
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const rows = lines.map((l) => {
      const [k, ...rest] = l.split(':');
      const keyRaw = (k || '').trim();
      const valRaw = rest.join(':').trim();
      return {
        key: sanitizeSpecToken(keyRaw),
        value: sanitizeSpecToken(valRaw),
      };
    });
    return rows.length > 0 ? rows : [{ key: '', value: '' }];
  }

  function rowsToSpecifications(rows) {
    const cleaned = (rows || [])
      .filter((r) => (r.key || r.value))
      .map((r) => {
        const k = sanitizeSpecToken(r.key || '');
        const v = sanitizeSpecToken(r.value || '');
        return `${k}: ${v}`.trim();
      });
    return cleaned.join('\n');
  }

  function sanitizeSpecToken(token) {
    let t = String(token || '').trim();
    // Repeatedly strip leading/trailing braces/brackets/parentheses/quotes/spaces
    const edge = /[\s"'\{\}\[\]\(\)]+/;
    while ((t && edge.test(t[0])) || (t && edge.test(t[t.length - 1]))) {
      t = t.replace(/^[\s"'\{\[\(]+/, '').replace(/[\s"'\}\]\)]+$/, '');
    }
    // Remove any remaining quotes inside
    t = t.replace(/["']/g, '');
    return t.trim();
  }

  // Load danh sách sản phẩm cho dropdown và variants
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setVariantsLoading(true);
      try {
        const [prods, vars] = await Promise.all([
          getAllProducts(),
          getAllVariants(),
        ]);
        if (!mounted) return;
        setProducts(Array.isArray(prods) ? prods : []);
        setVariants(Array.isArray(vars) ? vars : []);
      } catch (_e) {
        if (!mounted) return;
        setProducts([]);
        setVariants([]);
      } finally {
        if (mounted) {
          setLoading(false);
          setVariantsLoading(false);
        }
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filteredVariants = variants.filter((v) => {
    const color = String(v?.color || '').toLowerCase();
    const sku = String(v?.sku || '').toLowerCase();
    const q = String(searchTerm || '').toLowerCase();
    return color.includes(q) || sku.includes(q);
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (variant) => {
    setEditingVariant(variant);
    setFormData({
      price: variant?.price ?? '',
      color: variant?.color ?? '',
      memory: variant?.memory ?? '',
      quantity: variant?.quantity ?? '',
      sku: variant?.sku ?? '',
      status: variant?.status ?? 'ACTIVE',
      imageUrl: variant?.imageUrl ?? '',
      productId: variant?.productId ?? '',
      specifications: variant?.specifications ?? '',
      slug: variant?.slug ?? '',
      id: variant?.id,
    });
    setSpecRows(parseSpecificationsToRows(variant?.specifications));
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa biến thể này không?")) {
      setVariants(variants.filter((v) => v.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return alert("Bạn không có quyền thêm biến thể.");
    const specsString = rowsToSpecifications(specRows);
    const payload = { ...formData, specifications: specsString };
    try {
      if (editingVariant) {
        // Chưa có API update, tạm thời cập nhật local state
        setVariants(
          variants.map((v) => (v.id === editingVariant.id ? { ...payload, id: v.id } : v))
        );
        setEditingVariant(null);
      } else {
        await createVariant(payload);
        const fresh = await getAllVariants();
        setVariants(Array.isArray(fresh) ? fresh : []);
      }
    } catch (err) {
      return alert(err?.message || 'Lưu biến thể thất bại');
    }
    setFormData({
      price: "",
      color: "",
      memory: "",
      quantity: "",
      sku: "",
      status: "ACTIVE",
      imageUrl: "",
      productId: "",
      specifications: "",
      slug: "",
    });
    setImageFile(null);
    setSpecRows([{ key: '', value: '' }]);
  };

  function handleImageChange(e) {
    const file = e.target.files && e.target.files[0];
    setImageFile(file || null);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl: previewUrl }));
    } else {
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
    }
  }

  function openDetail(v) {
    setDetailVariant(v);
    setShowDetail(true);
  }

  function closeDetail() {
    setShowDetail(false);
    setDetailVariant(null);
  }

  return (
    <div className="variants-section">
      <div className="variants-header">
        <h2>
          <i className="fa-solid fa-shapes text-pink-500"></i> Quản lý biến thể sản phẩm
        </h2>
        <div className="header-actions">
          <button
            className="btn add"
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setEditingVariant(null);
                setFormData({
                  price: "",
                  color: "",
                  memory: "",
                  quantity: "",
                  sku: "",
                  status: "ACTIVE",
                  imageUrl: "",
                  productId: "",
                  specifications: "",
                  slug: "",
                });
              }
            }}
          >
            {showForm ? "✖ Đóng" : "➕ Thêm biến thể"}
          </button>
        </div>
      </div>

      <div className="search-bar">
        <i className="fa-solid fa-magnifying-glass text-gray-500 mr-2"></i>
        <input
          type="text"
          placeholder="Tìm theo SKU hoặc màu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="variants-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Sản phẩm</th>
            <th>Hình ảnh</th>
            <th>SKU</th>
            <th>Màu</th>
            <th>Dung lượng</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Slug</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {variantsLoading ? (
            <tr>
              <td colSpan="10" style={{ textAlign: 'center', color: '#6b7280' }}>Đang tải...</td>
            </tr>
          ) : filteredVariants.map((v, index) => (
            <tr key={v.id}>
              <td>{index + 1}</td>
              <td>{products.find(p => p.id === v.productId)?.name || '—'}</td>
              <td>
                <img
                  src={v.imageUrl}
                  alt={v.color}
                  className="variant-img"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/80x80?text=No+Image")
                  }
                />
              </td>
              <td>{v.sku}</td>
              <td>{v.color}</td>
              <td>{v.memory || "—"}</td>
              <td>{formatCurrency(v.price)}</td>
              <td>{v.quantity}</td>
              <td>{v.slug || '—'}</td>
              <td
                className={
                  v.status === "ACTIVE" ? "status-active" : "status-out"
                }
              >
                {v.status}
              </td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(v)}
                  disabled={!isAdmin}
                >
                  ✏ Sửa
                </button>
                 <button
                   className="btn-view"
                   onClick={() => openDetail(v)}
                 >
                   👁 Xem
                 </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(v.id)}
                  disabled={!isAdmin}
                >
                  🗑 Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="variant-form-card">
          <form className="variant-form" onSubmit={handleSubmit}>
            <h3>{editingVariant ? "Cập nhật biến thể" : "Thêm biến thể mới"}</h3>
            <div className="form-grid two-columns">
              <div className="form-field">
                <label>Sản phẩm</label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>SKU</label>
                <input
                  type="text"
                  name="sku"
                  placeholder="SKU"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Màu sắc</label>
                <input
                  type="text"
                  name="color"
                  placeholder="Màu sắc"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label>Dung lượng GB</label>
                <input
                  type="text"
                  name="memory"
                  placeholder="Dung lượng GB"
                  value={formData.memory}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label>Giá</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Giá"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Số lượng</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Số lượng"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Slug tùy chọn</label>
                <input
                  type="text"
                  name="slug"
                  placeholder="Slug tùy chọn"
                  value={formData.slug}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label>Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                </select>
              </div>
              <div className="form-field full">
                <label>Hình ảnh</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formData.imageUrl && (
                  <div className="image-preview" style={{ marginTop: 8 }}>
                    <img
                      src={formData.imageUrl}
                      alt="preview"
                      className="variant-img"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/80x80?text=No+Image")
                      }
                    />
                  </div>
                )}
              </div>
              <div className="form-field full">
                <label>Thông số kỹ thuật</label>
                <table className="spec-table">
                  <thead>
                    <tr>
                      <th>Tên</th>
                      <th>Giá trị</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {specRows.map((row, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="text"
                            value={row.key}
                            placeholder="VD: Màn hình"
                            onChange={(e) => {
                              const v = e.target.value;
                              setSpecRows((prev) => prev.map((r, i) => i === idx ? { ...r, key: v } : r));
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.value}
                            placeholder='VD: 6.7" Super Retina XDR'
                            onChange={(e) => {
                              const v = e.target.value;
                              setSpecRows((prev) => prev.map((r, i) => i === idx ? { ...r, value: v } : r));
                            }}
                          />
                        </td>
                        <td style={{ width: 1, whiteSpace: 'nowrap' }}>
                          <button type="button" className="btn-spec del" onClick={() => setSpecRows((prev) => prev.filter((_, i) => i !== idx))}>✖</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" className="btn-spec add" onClick={() => setSpecRows((prev) => ([...prev, { key: '', value: '' }]  ))}>➕ Thêm thông số</button>
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-add">
                {editingVariant ? "Lưu thay đổi" : "Thêm"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setEditingVariant(null);
                  setShowForm(false);
                }}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
      {showDetail && detailVariant && (
        <div className="modal-backdrop" onClick={closeDetail}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết biến thể</h3>
              <button className="modal-close" onClick={closeDetail}>✖</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-image">
                  <img
                    src={detailVariant.imageUrl}
                    alt="variant"
                    className="variant-img"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/120x120?text=No+Image")}
                  />
                </div>
                <div className="detail-info">
                  <p><strong>Sản phẩm:</strong> {products.find(p => p.id === detailVariant.productId)?.name || '—'}</p>
                  <p><strong>SKU:</strong> {detailVariant.sku || '—'}</p>
                  <p><strong>Màu:</strong> {detailVariant.color || '—'}</p>
                  <p><strong>Dung lượng:</strong> {detailVariant.memory || '—'}</p>
                  <p><strong>Giá:</strong> {formatCurrency(detailVariant.price)}</p>
                  <p><strong>Số lượng:</strong> {detailVariant.quantity ?? '—'}</p>
                  <p><strong>Slug:</strong> {detailVariant.slug || '—'}</p>
                  <p><strong>Trạng thái:</strong> {detailVariant.status}</p>
                </div>
              </div>
              <div className="detail-specs">
                <h4>Thông số kỹ thuật</h4>
                {(() => {
                  const rows = parseSpecificationsToRows(detailVariant.specifications);
                  const nonEmpty = rows.filter(r => r.key || r.value);
                  if (nonEmpty.length === 0) return (<p style={{ color: '#6b7280' }}>Chưa có thông số</p>);
                  return (
                    <table className="spec-table">
                      <thead>
                        <tr>
                          <th>Tên</th>
                          <th>Giá trị</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nonEmpty.map((r, i) => (
                          <tr key={i}>
                            <td>{sanitizeSpecToken(r.key)}</td>
                            <td>{sanitizeSpecToken(r.value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-add" onClick={closeDetail}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantsSection;
