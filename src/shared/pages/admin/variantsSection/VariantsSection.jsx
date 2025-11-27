import React, { useState, useEffect, useRef } from "react";
import "./VariantsSection.css";
import { createVariant, getVariants, updateVariant, deleteVariant } from "../../../utils/api/variantApi";

export default function VariantsSection() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [variants, setVariants] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    productId: "",
    sku: "",
    color: "",
    memory: "",
    quantity: "",
    price: "",
    slug: "",
    status: "ACTIVE",
    specifications: ""
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const openForm = (variant = null) => {
    setModalOpen(true);
    setEditing(!!variant);
    setForm(variant || {
      productId: "",
      sku: "",
      color: "",
      memory: "",
      quantity: "",
      price: "",
      slug: "",
      status: "ACTIVE",
      specifications: ""
    });
    setPreviewUrl("");
  };

  const closeForm = () => {
    setModalOpen(false);
    setEditing(false);
  };

  const openDetail = (variant) => {
    const parsedVariant = { ...variant };
    try {
      parsedVariant._specs = typeof variant.specifications === 'string' 
        ? JSON.parse(variant.specifications) 
        : (variant.specifications || {});
    } catch (e) {
      console.log("[v0] Specifications parse error:", e);
      parsedVariant._specs = {};
    }
    setSelected(parsedVariant);
  };

  const closeDetail = () => {
    setSelected(null);
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVariants();
      setVariants(data);
      setFiltered(data);
    } catch (err) {
      setError("Không thể tải biến thể sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await updateVariant(form.id, form);
      } else {
        await createVariant(form);
      }
      load();
      closeForm();
    } catch (err) {
      setError("Không thể lưu biến thể sản phẩm.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const imgUrl = (url) => {
    return url;
  };

  const fmt = (num) => {
    return num.toLocaleString("vi-VN");
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const newFiltered = variants.filter(v => 
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      v.color.toLowerCase().includes(search.toLowerCase()) ||
      v.memory.toString().toLowerCase().includes(search.toLowerCase()) ||
      v.price.toString().toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(newFiltered);
  }, [search, variants]);

  return (
    <div className="variants-manager">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Quản lý biến thể sản phẩm</h1>
          <p className="page-subtitle">Tạo, chỉnh sửa và quản lý các biến thể sản phẩm của bạn</p>
        </div>
        <button onClick={() => openForm()} className="btn-create-primary">
          <span className="btn-icon">+</span> Thêm mới
        </button>
      </div>

      <div className="variants-container">
        <div className="toolbar-section">
          <div className="search-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 14L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input 
              type="text"
              placeholder="Tìm kiếm theo SKU, màu, bộ nhớ, giá..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="search-input"
            />
          </div>
          <button onClick={load} disabled={loading} className="btn-refresh">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8M1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8M1 8H4M15 8H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {loading ? "Đang tải..." : "Tải lại"}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="state-empty">
            <div className="spinner"></div>
            <p>Đang tải biến thể...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="state-empty">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2"/>
              <path d="M24 14V24L30 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>Không có biến thể</h3>
            <p>Bắt đầu bằng cách tạo biến thể sản phẩm đầu tiên của bạn</p>
            <button onClick={() => openForm()} className="btn-create-secondary">
              + Thêm biến thể
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="variants-table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>SKU</th>
                  <th>Màu sắc</th>
                  <th>Dung lượng</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id} className="table-row">
                    <td>
                      <img src={imgUrl(v.imageUrl) || "/placeholder.svg"} alt={v.sku} className="variant-thumb" />
                    </td>
                    <td>
                      <span className="sku-badge">{v.sku}</span>
                    </td>
                    <td>{v.color || "—"}</td>
                    <td>{v.memory ? `${v.memory}GB` : "—"}</td>
                    <td>
                      <span className="price-text">{fmt(v.price)} đ</span>
                    </td>
                    <td>
                      <span className={`stock-badge ${v.quantity > 0 ? "in-stock" : "out-stock"}`}>
                        {v.quantity}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${v.status?.toLowerCase()}`}>
                        {v.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => openDetail(v)} className="btn-action btn-view" title="Chi tiết">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 2C4 2 1 5 1 8s3 6 7 6 7-3 7-6-3-6-7-6zm0 11c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                          </svg>
                        </button>
                        <button onClick={() => openForm(v)} className="btn-action btn-edit" title="Chỉnh sửa">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M12.146.854c.196-.196.512-.196.708 0l2.292 2.292c.196.196.196.512 0 .708L3.646 15H1v-2.646L12.146.854zM13.5 2.5L14 2l-.5.5z"/>
                          </svg>
                        </button>
                        <button onClick={() => deleteVariant(v.id)} className="btn-action btn-delete" title="Xóa">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M14 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h12zm-4 0H6v14h4V1zm-5 6h14v2H6v-2zm13 2H3v2h14v-2z"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL - Modern Design */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{editing ? "Chỉnh sửa biến thể" : "Tạo biến thể mới"}</h2>
                <p className="modal-subtitle">
                  {editing ? "Cập nhật thông tin biến thể sản phẩm" : "Thêm một biến thể sản phẩm mới"}
                </p>
              </div>
              <button onClick={closeForm} className="modal-close">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15.898 4.045l-5.853 5.853 5.853 5.853c.322.322.322.846 0 1.168-.322.322-.846.322-1.168 0l-5.853-5.853-5.853 5.853c-.322.322-.846.322-1.168 0-.322-.322-.322-.846 0-1.168z"/>
                </svg>
              </button>
            </div>

            <form onSubmit={submitForm} className="modal-body">
              <div className="form-sections">
                {/* Left Column - Basic Info */}
                <div className="form-section">
                  <h3 className="section-title">Thông tin cơ bản</h3>
                  
                  <div className="form-group">
                    <label htmlFor="productId" className="form-label">Product ID <span className="required">*</span></label>
                    <input 
                      id="productId"
                      type="number" 
                      value={form.productId} 
                      onChange={e => setForm({...form, productId: e.target.value})} 
                      className="form-input"
                      placeholder="Nhập Product ID"
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="sku" className="form-label">SKU <span className="required">*</span></label>
                    <input 
                      id="sku"
                      type="text" 
                      value={form.sku} 
                      onChange={e => setForm({...form, sku: e.target.value})} 
                      className="form-input"
                      placeholder="VD: SKU-001"
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="color" className="form-label">Màu sắc</label>
                    <input 
                      id="color"
                      type="text" 
                      value={form.color} 
                      onChange={e => setForm({...form, color: e.target.value})} 
                      className="form-input"
                      placeholder="VD: Đen, Trắng"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="memory" className="form-label">Dung lượng (GB)</label>
                      <input 
                        id="memory"
                        type="text" 
                        value={form.memory} 
                        onChange={e => setForm({...form, memory: e.target.value})} 
                        className="form-input"
                        placeholder="128, 256..."
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="quantity" className="form-label">Số lượng</label>
                      <input 
                        id="quantity"
                        type="number" 
                        value={form.quantity} 
                        onChange={e => setForm({...form, quantity: e.target.value})} 
                        className="form-input"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="price" className="form-label">Giá <span className="required">*</span></label>
                    <div className="input-prefix">
                      <input 
                        id="price"
                        type="number" 
                        value={form.price} 
                        onChange={e => setForm({...form, price: e.target.value})} 
                        className="form-input"
                        placeholder="0"
                        required 
                      />
                      <span className="currency">đ</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Image & Status */}
                <div className="form-section">
                  <h3 className="section-title">Ảnh & Trạng thái</h3>

                  <div className="form-group">
                    <label className="form-label">Ảnh sản phẩm</label>
                    <div className="image-upload-zone">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        id="image-upload"
                        className="file-input"
                      />
                      <label htmlFor="image-upload" className="upload-label">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                          <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 24c-5.523 0-10-4.477-10-10S10.477 6 16 6s10 4.477 10 10-4.477 10-10 10zm3.5-14h-3V9.5h-1V12h-3v1h3v3.5h1V13h3v-1z" fill="currentColor"/>
                        </svg>
                        <span className="upload-text">Chọn ảnh hoặc kéo thả</span>
                        <span className="upload-hint">PNG, JPG, WebP (Tối đa 10MB)</span>
                      </label>
                      {previewUrl && (
                        <div className="image-preview-container">
                          <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="preview-image" />
                          <button 
                            type="button"
                            onClick={() => {
                              setPreviewUrl("");
                              fileInputRef.current.value = "";
                            }}
                            className="btn-remove-image"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="slug" className="form-label">Slug</label>
                    <input 
                      id="slug"
                      type="text" 
                      value={form.slug} 
                      onChange={e => setForm({...form, slug: e.target.value})} 
                      className="form-input"
                      placeholder="product-variant-slug"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="status" className="form-label">Trạng thái</label>
                    <select 
                      id="status"
                      value={form.status} 
                      onChange={e => setForm({...form, status: e.target.value})}
                      className="form-select"
                    >
                      <option value="ACTIVE">Hoạt động</option>
                      <option value="INACTIVE">Không hoạt động</option>
                      <option value="OUT_OF_STOCK">Hết hàng</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Full width - Specifications */}
              <div className="form-section form-section-full">
                <h3 className="section-title">Thông số kỹ thuật</h3>
                <div className="form-group">
                  <label htmlFor="specs" className="form-label">JSON Specifications</label>
                  <textarea
                    id="specs"
                    rows={6}
                    value={form.specifications}
                    onChange={e => setForm({...form, specifications: e.target.value})}
                    className="form-textarea"
                    placeholder={`{\n  "ram": "8GB",\n  "chip": "A17 Pro",\n  "screen_size": "6.7 inch"\n}`}
                  />
                  <p className="specs-hint">Nhập thông tin dưới dạng JSON hợp lệ</p>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeForm} className="btn-cancel">
                  Hủy
                </button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? "Đang xử lý..." : (editing ? "Cập nhật" : "Tạo mới")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selected && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Chi tiết biến thể</h2>
                <p className="modal-subtitle">SKU: {selected.sku}</p>
              </div>
              <button onClick={closeDetail} className="modal-close">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15.898 4.045l-5.853 5.853 5.853 5.853c.322.322.322.846 0 1.168-.322.322-.846.322-1.168 0l-5.853-5.853-5.853 5.853c-.322.322-.846.322-1.168 0-.322-.322-.322-.846 0-1.168l5.853-5.853-5.853-5.853c-.322-.322-.322-.846 0-1.168.322-.322.846-.322 1.168 0l5.853 5.853 5.853-5.853c.322-.322.846-.322 1.168 0 .322.322.322.846 0 1.168z"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-image">
                  <img src={imgUrl(selected.imageUrl) || "/placeholder.svg"} alt={selected.sku} className="detail-img" />
                </div>
                <div className="detail-info">
                  <div className="detail-row">
                    <span className="detail-label">ID sản phẩm</span>
                    <span className="detail-value">#{selected.productId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">SKU</span>
                    <code className="detail-code">{selected.sku}</code>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Giá</span>
                    <span className="detail-price">{fmt(selected.price)} đ</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Tồn kho</span>
                    <span className={`stock-badge ${selected.quantity > 0 ? "in-stock" : "out-stock"}`}>
                      {selected.quantity} sản phẩm
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Trạng thái</span>
                    <span className={`status-badge status-${selected.status?.toLowerCase()}`}>
                      {selected.status}
                    </span>
                  </div>
                  {selected.color && (
                    <div className="detail-row">
                      <span className="detail-label">Màu sắc</span>
                      <span className="detail-value">{selected.color}</span>
                    </div>
                  )}
                  {selected.memory && (
                    <div className="detail-row">
                      <span className="detail-label">Dung lượng</span>
                      <span className="detail-value">{selected.memory}GB</span>
                    </div>
                  )}
                  {selected.slug && (
                    <div className="detail-row">
                      <span className="detail-label">Slug</span>
                      <code className="detail-code">{selected.slug}</code>
                    </div>
                  )}
                </div>
              </div>

              {selected._specs && Object.keys(selected._specs).length > 0 && (
                <div className="specs-section">
                  <h3 className="specs-title">Thông số kỹ thuật</h3>
                  <div className="specs-grid">
                    {Object.entries(selected._specs).map(([k, val]) => (
                      <div key={k} className="spec-item">
                        <span className="spec-key">{k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                        <span className="spec-value">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={closeDetail} className="btn-cancel">Đóng</button>
              <button onClick={() => { closeDetail(); openForm(selected); }} className="btn-submit">
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



