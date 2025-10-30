import React, { useState } from 'react';
import { ShoppingCart, Phone, MapPin, User, Heart } from 'lucide-react';

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('blue');

  const colors = [
    { name: 'blue', code: '#4A90E2' },
    { name: 'black', code: '#1a1a1a' },
    { name: 'purple', code: '#9B59B6' },
    { name: 'white', code: '#F5F5F5' },
    { name: 'red', code: '#E74C3C' },
    { name: 'yellow', code: '#F1C40F' }
  ];

  const relatedProducts = [
    { id: 1, name: 'Ốp lưng MagSafe iPhone 14 Apple', price: '795.000đ', discount: '50%', oldPrice: '1.590.000đ' },
    { id: 2, name: 'Tai nghe Apple EarPods Lightning', price: '600.000đ', discount: '25%', oldPrice: '800.000đ' },
    { id: 3, name: 'Cáp Type-C to Lightning Apple 1m', price: '520.000đ', discount: '12%', oldPrice: '590.000đ' },
    { id: 4, name: 'Cốc sạc nhanh Apple 20W Type-C', price: '690.000đ', discount: '8%', oldPrice: '750.000đ' }
  ];

  const productImages = [
    { id: 1, color: 'blue' },
    { id: 2, color: 'black' },
    { id: 3, color: 'purple' },
    { id: 4, color: 'red' },
    { id: 5, color: 'yellow' }
  ];

  return (
    <div className="bg-light">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#">Sudes Phone</a>
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

      {/* Breadcrumb */}
      <div className="container mt-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="#" className="text-decoration-none">Trang chủ</a></li>
            <li className="breadcrumb-item"><a href="#" className="text-decoration-none">iPad Pro 11</a></li>
            <li className="breadcrumb-item active">iPhone 14 Plus 128GB - Chính hãng VN/A</li>
          </ol>
        </nav>
      </div>

      {/* Main Product Section */}
      <div className="container bg-white rounded shadow-sm p-4 mb-4">
        <div className="row">
          {/* Left: Product Images */}
          <div className="col-lg-5">
            <div className="text-center mb-3">
              <img 
                src="https://images.unsplash.com/photo-1663499482523-1c0d7a6c6d00?w=400&h=400&fit=crop" 
                alt="iPhone 14 Plus" 
                className="img-fluid rounded"
                style={{ maxHeight: '400px' }}
              />
            </div>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              {productImages.map((img) => (
                <div key={img.id} className="border rounded p-2" style={{ width: '70px', cursor: 'pointer' }}>
                  <img 
                    src={`https://images.unsplash.com/photo-1663499482523-1c0d7a6c6d00?w=70&h=70&fit=crop`}
                    alt={`Thumbnail ${img.id}`}
                    className="img-fluid"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Middle: Product Info */}
          <div className="col-lg-4">
            <h2 className="h4 mb-2">iPhone 14 Plus 128GB - Chính hãng VN/A</h2>
            <p className="text-muted small mb-3">
              <span className="badge bg-success me-2">4.5 ⭐</span>
              Thương hiệu: Apple | Tình trạng: Còn hàng
            </p>
            
            <div className="mb-3">
              <h3 className="h3 text-danger fw-bold">21.490.000đ</h3>
              <span className="text-muted text-decoration-line-through small">27.990.000đ</span>
            </div>

            <div className="mb-3">
              <p className="small fw-bold mb-2">Màu sắc: Chọn màu để xem giá</p>
              <div className="d-flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`btn rounded-circle p-0 ${selectedColor === color.name ? 'border-primary border-3' : 'border'}`}
                    style={{ 
                      width: '35px', 
                      height: '35px', 
                      backgroundColor: color.code,
                      border: color.name === 'white' ? '2px solid #ddd' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="text-success">✓</span>
                <span className="small">Máy mới Fullbox 100% - Chính hãng Apple</span>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="text-success">✓</span>
                <span className="small">Bảo hành 12 tháng chính hãng Apple</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="text-success">✓</span>
                <span className="small">Bảo hành chính hãng Apple 12 tháng</span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="small">Số lượng:</span>
              <div className="btn-group">
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >-</button>
                <input 
                  type="text" 
                  className="form-control form-control-sm text-center" 
                  value={quantity}
                  style={{ width: '60px' }}
                  readOnly
                />
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setQuantity(quantity + 1)}
                >+</button>
              </div>
            </div>

            <div className="d-grid gap-2">
              <button className="btn btn-dark btn-lg">MUA NGAY</button>
              <button className="btn btn-outline-danger">Thêm vào giỏ</button>
            </div>
          </div>

          {/* Right: Promotions */}
          <div className="col-lg-3">
            <div className="card border-danger mb-3">
              <div className="card-header bg-danger text-white text-center">
                Khuyến mãi đặc biệt
              </div>
              <div className="card-body">
                <ul className="list-unstyled small mb-0">
                  <li className="mb-2">🎁 Giảm 200.000đ khi mua Airpods</li>
                  <li className="mb-2">🎁 Nhận VIP 12 tháng 1 ĐỔI 1</li>
                  <li className="mb-2">🎁 Giảm thêm 60%, tối đa 60.600.000 VNĐ khi mở thẻ TP Bank EVO</li>
                  <li className="mb-2">🎁 Thu cũ đổi mới: Trợ giá cao trị giá từ 10 triệu đồng</li>
                  <li>* Tặng cường lực</li>
                </ul>
              </div>
            </div>

            <div className="card">
              <div className="card-header bg-dark text-white">
                Chính sách hỗ trợ
              </div>
              <div className="card-body">
                <div className="small mb-2">🚚 Vận chuyển miễn phí</div>
                <div className="small mb-2">📦 Quà tặng</div>
                <div className="small mb-2">✅ Chứng nhận chất lượng</div>
                <div className="small mb-2">☎️ Hotline: 1900 6750</div>
                <div className="small">❤️ Thêm vào yêu thích</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="container bg-white rounded shadow-sm p-4 mb-4">
        <h3 className="h5 mb-4 fw-bold">THƯỜNG ĐƯỢC MUA CÙNG</h3>
        <div className="row g-3">
          {relatedProducts.map((product) => (
            <div key={product.id} className="col-md-3">
              <div className="card h-100 position-relative">
                <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                  Giảm {product.discount}
                </span>
                <img 
                  src={`https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop`}
                  className="card-img-top p-3" 
                  alt={product.name}
                />
                <div className="card-body">
                  <h6 className="card-title small">{product.name}</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-danger fw-bold mb-0">{product.price}</p>
                      <small className="text-muted text-decoration-line-through">{product.oldPrice}</small>
                    </div>
                    <button className="btn btn-dark btn-sm">
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Specifications */}
      <div className="container bg-white rounded shadow-sm p-4 mb-4">
        <div className="row">
          <div className="col-md-6">
            <h3 className="h5 mb-4 fw-bold">THÔNG TIN SẢN PHẨM</h3>
            <p className="small text-justify">
              Mẫu dự đoán: iPhone 2023 về những tính năng iPhone thiết kể mang đầu có cải tiến màn hình iPhone 14 và màn hình lớn 6.7 inch tương tự iPhone 14 Pro Max. 
              Sản phẩm được Apple kì vọng sẽ mang lại doanh số bán kỷ lục quả năm đầu thương được kỹ thuật hoàn thiện trong 
              khúc thân máy với các hoàn thiện và đồ gốn đẹp mắt của series iPhone 14.
            </p>
          </div>
          <div className="col-md-6">
            <h3 className="h5 mb-4 fw-bold">THÔNG SỐ KỸ THUẬT</h3>
            <table className="table table-sm table-bordered small">
              <tbody>
                <tr>
                  <td className="fw-bold">Màng hình rộng</td>
                  <td>Apple</td>
                </tr>
                <tr>
                  <td className="fw-bold">Kích thước màn hình</td>
                  <td>6.7 inches</td>
                </tr>
                <tr>
                  <td className="fw-bold">Độ phân giải màn hình</td>
                  <td>2778 x 1284 pixels</td>
                </tr>
                <tr>
                  <td className="fw-bold">Loại màn hình</td>
                  <td>OLED LTPS</td>
                </tr>
                <tr>
                  <td className="fw-bold">Bộ nhớ trong</td>
                  <td>128GB</td>
                </tr>
                <tr>
                  <td className="fw-bold">Chipset</td>
                  <td>Apple A15 Bionic</td>
                </tr>
                <tr>
                  <td className="fw-bold">CPU</td>
                  <td>A15</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5 className="fw-bold mb-3">Sudes Phone</h5>
              <p className="small">
                Hệ thống của hàng Sudes Phone chuyên bán lẻ điện thoại, máy tính laptop, smartwatch, phụ kiện chính hãng.
              </p>
              <p className="small mb-1">📍 Địa chỉ: L1-01 Giga, Phường 15, Quận 11, Tp.HCM</p>
              <p className="small">📞 Điện thoại: 1900 6750</p>
            </div>
            <div className="col-md-2">
              <h6 className="fw-bold mb-3">CHÍNH SÁCH</h6>
              <ul className="list-unstyled small">
                <li className="mb-2"><a href="#" className="text-white text-decoration-none">Chính sách mua hàng</a></li>
                <li className="mb-2"><a href="#" className="text-white text-decoration-none">Chính sách đổi trả</a></li>
                <li className="mb-2"><a href="#" className="text-white text-decoration-none">Điều khoản sử dụng</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="fw-bold mb-3">HƯỚNG DẪN</h6>
              <ul className="list-unstyled small">
                <li className="mb-2"><a href="#" className="text-white text-decoration-none">Hướng dẫn mua hàng</a></li>
                <li className="mb-2"><a href="#" className="text-white text-decoration-none">Hướng dẫn đổi trả</a></li>
                <li className="mb-2"><a href="#" className="text-white text-decoration-none">Hướng dẫn trả góp</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="fw-bold mb-3">HỖ TRỢ THANH TOÁN</h6>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-light text-dark">ATM</span>
                <span className="badge bg-light text-dark">VISA</span>
                <span className="badge bg-light text-dark">MasterCard</span>
                <span className="badge bg-light text-dark">Momo</span>
              </div>
            </div>
          </div>
          <hr className="my-3 border-secondary" />
          <div className="text-center small">
            © 2024 Sudes Phone. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}