import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <h3 className="footer-logo">Sudes Phone</h3>
              <p className="footer-desc">
                Hệ thống bán lẻ thiết bị công nghệ và phụ kiện chính hãng. 
                Giá tốt - Giao nhanh - Hỗ trợ tận tâm.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link facebook" aria-label="Facebook">
                  <FaFacebook />
                </a>
                <a href="#" className="social-link instagram" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="#" className="social-link tiktok" aria-label="TikTok">
                  <FaTiktok />
                </a>
                <a href="#" className="social-link youtube" aria-label="YouTube">
                  <FaYoutube />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h4 className="footer-title">Thông tin</h4>
              <ul className="footer-links">
                <li><Link to="/gioi-thieu">Giới thiệu</Link></li>
                <li><Link to="/tin-tuc">Tin tức</Link></li>
                <li><Link to="/lien-he">Liên hệ</Link></li>
                <li><Link to="/chinh-sach">Chính sách bảo mật</Link></li>
              </ul>
            </div>

            {/* Support Links */}
            <div className="footer-column">
              <h4 className="footer-title">Hỗ trợ khách hàng</h4>
              <ul className="footer-links">
                <li><a href="#">Hướng dẫn mua hàng</a></li>
                <li><a href="#">Chính sách vận chuyển</a></li>
                <li><a href="#">Chính sách đổi trả</a></li>
                <li><a href="#">Chính sách bảo hành</a></li>
                <li><a href="#">Câu hỏi thường gặp</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-column">
              <h4 className="footer-title">Liên hệ</h4>
              <ul className="footer-contact">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>70 Lữ Gia, P.15, Q.11, TP.HCM</span>
                </li>
                <li>
                  <FaPhone className="contact-icon" />
                  <span>1900 6750</span>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>support@sudesphone.vn</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3 className="newsletter-title">Đăng ký nhận tin</h3>
              <p className="newsletter-desc">Nhận thông tin khuyến mãi và sản phẩm mới nhất</p>
            </div>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Nhập email của bạn" 
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-button">
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="footer-payment">
              <span className="payment-label">Phương thức thanh toán:</span>
              <div className="payment-methods">
                <span className="payment-badge">Visa</span>
                <span className="payment-badge">Mastercard</span>
                <span className="payment-badge">VNPAY</span>
                <span className="payment-badge">Momo</span>
                <span className="payment-badge">ZaloPay</span>
              </div>
            </div>
            <div className="footer-copyright">
              © {currentYear} Sudes Phone. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
