import './footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container new-footer">
        <div className="nf-row">
          <div className="nf-brand">
            <div className="nf-logo">Sudes Phone</div>
            <div className="nf-desc">Hệ thống bán lẻ thiết bị Apple & phụ kiện chính hãng. Giá tốt - Giao nhanh - Hỗ trợ tận tâm.</div>
          </div>
          <div className="nf-news">
            <div className="nf-title">Nhận ưu đãi độc quyền</div>
            <div className="nf-sub">Đăng ký email để không bỏ lỡ tin khuyến mãi.</div>
            <div className="nf-input">
              <input placeholder="Nhập email của bạn" />
              <button type="button">Đăng ký</button>
            </div>
          </div>
        </div>

        <div className="nf-links">
          <div className="nf-col">
            <div className="nf-title">Thông tin</div>
            <ul>
              <li>Giới thiệu</li>
              <li>Tin tức</li>
              <li>Liên hệ</li>
              <li>Chính sách</li>
            </ul>
          </div>
          <div className="nf-col">
            <div className="nf-title">Hỗ trợ</div>
            <ul>
              <li>Hướng dẫn mua hàng</li>
              <li>Vận chuyển & Đổi trả</li>
              <li>Bảo hành</li>
              <li>Câu hỏi thường gặp</li>
            </ul>
          </div>
          <div className="nf-col nf-contact">
            <div className="nf-title">Liên hệ</div>
            <div>Địa chỉ: 70 Lữ Gia, P.15, Q.11, TP.HCM</div>
            <div>Điện thoại: 1900 6750</div>
            <div>Email: support@sapo.vn</div>
            <div className="nf-socials">
              <a className="s-btn fb">Facebook</a>
              <a className="s-btn ig">Instagram</a>
              <a className="s-btn tt">TikTok</a>
            </div>
          </div>
        </div>

        <div className="nf-bottom">
          <div className="nf-pay">
            <span className="pill">Visa</span>
            <span className="pill">Mastercard</span>
            <span className="pill">VNPAY</span>
            <span className="pill">Momo</span>
          </div>
          <div className="nf-copy">© {new Date().getFullYear()} Sudes Phone. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

