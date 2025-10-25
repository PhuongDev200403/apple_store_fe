import React, { useState, useEffect } from "react";
import "./VariantsSection.css";

const VariantsSection = () => {
  const [variants, setVariants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingVariant, setEditingVariant] = useState(null);
  const [formData, setFormData] = useState({
    price: "",
    color: "",
    memory: "",
    quantity: "",
    sku: "",
    status: "ACTIVE",
    imageUrl: "",
    productId: "",
  });

  // Giả lập fetch API
  useEffect(() => {
    fetch("/api/variants")
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 0) setVariants(data.result);
      });
  }, []);

  const filteredVariants = variants.filter(
    (v) =>
      v.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (variant) => {
    setEditingVariant(variant);
    setFormData(variant);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa biến thể này không?")) {
      setVariants(variants.filter((v) => v.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingVariant) {
      setVariants(
        variants.map((v) => (v.id === editingVariant.id ? formData : v))
      );
      setEditingVariant(null);
    } else {
      const newVariant = { ...formData, id: Date.now() };
      setVariants([...variants, newVariant]);
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
    });
  };

  return (
    <div className="variants-section">
      <div className="variants-header">
        <h2>
          <i className="fa-solid fa-shapes text-pink-500"></i> Quản lý biến thể
          sản phẩm
        </h2>
        <button className="btn-close">✖ Đóng form</button>
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
            <th>Hình ảnh</th>
            <th>SKU</th>
            <th>Màu</th>
            <th>Dung lượng</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredVariants.map((v, index) => (
            <tr key={v.id}>
              <td>{index + 1}</td>
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
              <td>{v.price.toLocaleString("vi-VN")}₫</td>
              <td>{v.quantity}</td>
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
                >
                  ✏ Sửa
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(v.id)}
                >
                  🗑 Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form className="variant-form" onSubmit={handleSubmit}>
        <h3>{editingVariant ? "Cập nhật biến thể" : "Thêm biến thể mới"}</h3>
        <div className="form-grid">
          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={formData.sku}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="color"
            placeholder="Màu sắc"
            value={formData.color}
            onChange={handleChange}
          />
          <input
            type="text"
            name="memory"
            placeholder="Dung lượng (GB)"
            value={formData.memory}
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Giá"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Số lượng"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
          </select>
          <input
            type="text"
            name="imageUrl"
            placeholder="URL hình ảnh"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn-add">
            {editingVariant ? "Lưu thay đổi" : "Thêm"}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => setEditingVariant(null)}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default VariantsSection;
