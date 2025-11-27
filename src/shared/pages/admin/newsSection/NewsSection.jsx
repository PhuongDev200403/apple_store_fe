import { useState, useEffect, useMemo } from "react";
import {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
} from "../../../utils/api/newsApi";
import "./NewsSection.css";

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

export default function NewsSection() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Form
  const [form, setForm] = useState({
    title: "",
    content: "",
    isFeatured: false,
    isActive: true,
    imageFile: null,
  });
  const [formError, setFormError] = useState("");

  const isAdmin = (localStorage.getItem("role") || "").toLowerCase() === "admin";

  useEffect(() => {
    if (!isAdmin) {
      setError("Bạn không có quyền truy cập trang này.");
      setLoading(false);
      return;
    }
    loadNews();
  }, [isAdmin]);

  const loadNews = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllNews();
      setNewsList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Không tải được tin tức: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return newsList;
    const s = search.toLowerCase();
    return newsList.filter((n) =>
      n.title?.toLowerCase().includes(s) ||
      n.content?.toLowerCase().includes(s)
    );
  }, [newsList, search]);

  const openForm = (news = null) => {
    setEditingNews(news);
    setForm({
      title: news?.title || "",
      content: news?.content || "",
      isFeatured: news?.isFeatured || false,
      isActive: news?.isActive !== false,
      imageFile: null,
    });
    setImagePreview(news?.imageUrl || "");
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingNews(null);
    setFormError("");
    setImagePreview("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setFormError("Chỉ chấp nhận file ảnh định dạng JPG, PNG, WEBP");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      setFormError(""); // Clear error
      setForm({ ...form, imageFile: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      // Simulate file input change
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const fileInput = document.getElementById('news-image-upload');
      if (fileInput) {
        fileInput.files = dataTransfer.files;
        handleImageChange({ target: { files: [file] } });
      }
    } else {
      setFormError("Vui lòng chọn file ảnh hợp lệ");
    }
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Tiêu đề không được để trống!";
    if (!form.content.trim()) return "Nội dung không được để trống!";
    if (!editingNews && !form.imageFile) return "Vui lòng chọn ảnh cho tin tức!";
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
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("content", form.content.trim());
      formData.append("isFeatured", form.isFeatured);
      formData.append("isActive", form.isActive);
      
      if (form.imageFile) {
        formData.append("imageUrl", form.imageFile);
      }

      if (editingNews) {
        await updateNews(editingNews.id, formData);
      } else {
        await createNews(formData);
      }

      closeForm();
      loadNews();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || "Lưu thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa tin tức này? Không thể khôi phục!")) return;

    setDeletingId(id);
    try {
      await deleteNews(id);
      loadNews();
    } catch (err) {
      alert("Xóa thất bại: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="news-manager">
        <div className="news-container access-denied">
          <h3>Truy cập bị từ chối</h3>
          <p>{error || "Chỉ Admin được phép truy cập."}</p>
          <button onClick={() => window.location.href = "/dang-nhap"} className="btn btn-primary">
            Đăng nhập lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-manager">
      <div className="news-container">
        <header className="news-header">
          <h1 className="page-title">📰 Quản Lý Tin Tức</h1>
          <p className="subtitle">Thêm, sửa, xóa tin tức</p>
        </header>

        <div className="toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Tìm tiêu đề, nội dung..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={() => openForm()} className="btn btn-primary">
            ➕ Thêm tin tức
          </button>
          <button onClick={loadNews} disabled={loading} className="btn btn-secondary">
            {loading ? "⏳ Đang tải..." : "🔄 Tải lại"}
          </button>
        </div>

        {error && <div className="error-box">{error}</div>}

        {loading ? (
          <div className="loading">Đang tải tin tức...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <h3>Không có tin tức</h3>
            <p>Thử thay đổi từ khóa tìm kiếm hoặc thêm tin tức mới.</p>
          </div>
        ) : (
          <div className="news-grid">
            {filtered.map((news) => (
              <div key={news.id} className="news-card">
                <div className="news-image">
                  <img 
                    src={news.imageUrl || 'https://via.placeholder.com/400x250?text=No+Image'} 
                    alt={news.title}
                  />
                  <div className="news-badges">
                    {news.isFeatured && <span className="badge featured">⭐ Nổi bật</span>}
                    {news.isActive ? (
                      <span className="badge active">✅ Hoạt động</span>
                    ) : (
                      <span className="badge inactive">❌ Ẩn</span>
                    )}
                  </div>
                </div>
                <div className="news-content">
                  <h3 className="news-title">{news.title}</h3>
                  <p className="news-excerpt">
                    {news.content?.substring(0, 100)}
                    {news.content?.length > 100 ? '...' : ''}
                  </p>
                  <div className="news-meta">
                    <span className="news-date">📅 {formatDate(news.publishedAt)}</span>
                    <span className="news-id">ID: #{news.id}</span>
                  </div>
                  <div className="news-actions">
                    <button onClick={() => openForm(news)} className="btn-edit">
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(news.id)}
                      disabled={deletingId === news.id}
                      className="btn-delete"
                    >
                      {deletingId === news.id ? "⏳ Đang xóa..." : "🗑️ Xóa"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal news-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingNews ? "✏️ Sửa tin tức" : "➕ Thêm tin tức"}</h2>
              <button onClick={closeForm} className="close-btn">✖️</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              {formError && <div className="form-error">{formError}</div>}

              <div className="input-group">
                <label>Tiêu đề *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="VD: iPhone 17 sắp ra mắt"
                  required
                />
              </div>

              <div className="input-group">
                <label>Nội dung *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Nhập nội dung tin tức..."
                  rows="6"
                  required
                />
              </div>

              <div className="input-group">
                <label>Hình ảnh {!editingNews && '*'}</label>
                <div className="file-upload-wrapper">
                  <label 
                    htmlFor="news-image-upload" 
                    className="file-upload-label"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="file-upload-content">
                      {imagePreview ? (
                        <div className="image-preview-container">
                          <img src={imagePreview} alt="Preview" className="preview-image" />
                          <div className="change-image-overlay">
                            <span>📷 Click để thay đổi ảnh</span>
                          </div>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <div className="upload-icon">📷</div>
                          <div className="upload-text">
                            <strong>Click để chọn ảnh từ máy</strong>
                            <small>hoặc kéo thả ảnh vào đây</small>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    id="news-image-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleImageChange}
                    className="file-input-hidden"
                  />
                </div>
                {form.imageFile && (
                  <div className="selected-file-info">
                    ✅ Đã chọn: <strong>{form.imageFile.name}</strong> ({(form.imageFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
                <small className="help-text">
                  💡 Kích thước tối đa: 5MB | Định dạng: JPG, PNG, WEBP
                </small>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  />
                  <span>⭐ Tin tức nổi bật</span>
                </label>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  <span>✅ Hiển thị công khai</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn-save">
                  {editingNews ? "💾 Cập nhật" : "➕ Tạo mới"}
                </button>
                <button type="button" onClick={closeForm} className="btn-cancel">
                  ❌ Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
