import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../utils/api/productApi';
import { ShoppingCart, Phone, MapPin, User } from 'lucide-react';

export default function IPhoneProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('❌ Lỗi tải sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-secondary" role="status"></div>
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-5 text-danger">
        Không tìm thấy sản phẩm.
      </div>
    );

  return (
    <div className="bg-light">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#">
            Sudes Phone
          </a>
          <div className="d-flex align-items-center gap-3">
            <div className="text-white small">
              <MapPin size={16} className="d-inline me-1" />
              Hệ thống 79 siêu thị
            </div>
            <div className="text-white small">
              <Phone size={16} className="d-inline me-1" />
              Gọi mua hàng: 1900 6750
            </div>
            <div className="text-white small">
              <User size={16} className="d-inline me-1" />
              Đăng nhập
            </div>
            <div className="text-white">
              <ShoppingCart size={20} />
              <span className="badge bg-danger ms-1">0</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Product Detail */}
      <div className="container bg-white rounded shadow-sm p-4 my-4">
        <h3 className="fw-bold mb-3">Thông tin chi tiết sản phẩm</h3>

        <div className="row">
          {/* Ảnh sản phẩm */}
          <div className="col-md-5 text-center mb-3">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/400x400'}
              alt={product.name}
              className="img-fluid rounded"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>

          {/* Dữ liệu chi tiết */}
          <div className="col-md-7">
            <h4>{product.name}</h4>
            <p className="text-danger fw-bold h5">
              {product.price
                ? product.price.toLocaleString() + '₫'
                : 'Liên hệ'}
            </p>
            <p className="text-muted">{product.description}</p>

            {/* Toàn bộ dữ liệu */}
            <div className="mt-4">
              <h5 className="fw-bold">Dữ liệu từ backend (JSON)</h5>
              <pre
                className="bg-light p-3 rounded border"
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  fontSize: '0.9rem',
                }}
              >
                {JSON.stringify(product, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-dark text-white py-3 text-center">
        © 2024 Sudes Phone. All rights reserved.
      </footer>
    </div>
  );
}
