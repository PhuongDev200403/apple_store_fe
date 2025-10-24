import './footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand">Sudes Phone</div>
          <p>Hệ thống cửa hàng Sudes Phone chuyên bán lẻ điện thoại, máy tính, smartwatch, smarthome, phụ kiện chính hãng - Giá tốt, giao miễn phí.</p>
          <p><strong>Địa chỉ:</strong> 70 Lữ Gia, Phường 15, Quận 11, Tp.HCM</p>
          <p><strong>Điện thoại:</strong> 1900 6750</p>
          <p><strong>Email:</strong> support@sapo.vn</p>
        </div>

        <div>
          <div className="footer-title">Chính sách</div>
          <ul>
            <li>Chính sách mua hàng</li>
            <li>Chính sách đổi trả</li>
            <li>Chính sách vận chuyển</li>
            <li>Chính sách bảo mật</li>
            <li>Cam kết cửa hàng</li>
          </ul>
        </div>

        <div>
          <div className="footer-title">Hướng dẫn</div>
          <ul>
            <li>Hướng dẫn mua hàng</li>
            <li>Hướng dẫn đổi trả</li>
            <li>Hướng dẫn chuyển khoản</li>
            <li>Hướng dẫn trả góp</li>
            <li>Hướng dẫn hoàn hàng</li>
          </ul>
        </div>

        <div>
          <div className="footer-title">Kết nối</div>
          <div className="socials">
            <span className="btn fb">Facebook</span>
            <span className="btn ig">Instagram</span>
            <span className="btn tt">TikTok</span>
          </div>
          <div className="footer-title" style={{marginTop:12}}>Hỗ trợ thanh toán</div>
          <div className="payments">
            <span className="badge">Visa</span>
            <span className="badge">Momo</span>
            <span className="badge">VNPAY</span>
            <span className="badge">ATM</span>
          </div>
        </div>
      </div>
      <div className="copy">© {new Date().getFullYear()} Sudes Phone. All rights reserved.</div>
    </footer>
  );
}

