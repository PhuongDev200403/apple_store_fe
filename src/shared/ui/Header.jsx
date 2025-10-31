import { useEffect, useState } from 'react';
import { FaBars, FaUser, FaShoppingCart, FaSearch, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getAllParentCategories } from '../utils/api/categoryApi';
import './header.css';


export default function Header() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    getAllParentCategories()
      .then((data) => {
        // Đảm bảo data luôn là array
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setCategories([]);
      });
  }, []);

  // Đóng menu tài khoản khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAccountOpen && !event.target.closest('.account')) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isAccountOpen]);

  // categories state is populated from API

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setIsLoggedIn(false);
      setIsAccountOpen(false);
      navigate('/dang-nhap');
    } catch (_e) {
      // no-op
    }
  };

  return (
    <header className="header">
      {/* Block 1: top bar */}
      <div className="header-top container">
        <button className="icon-btn menu-btn" onClick={()=>setIsMobileNavOpen(true)} aria-label="Mở menu"><FaBars /></button>
        <Link to="/" className="logo">Sudes Phone</Link>

        <div className="search-box">
          <input type="text" placeholder="Tìm sản phẩm..." />
          <button aria-label="Tìm kiếm"><FaSearch /></button>
        </div>

        <div className="store-info">
          <FaMapMarkerAlt />
          <div className="store-info-text">
            <span className="store-info-text-title">Hệ thống cửa hàng</span>
            <span className="quantity">1</span>
          </div>
        </div>

        <div className="contact-info">
          <FaPhone />
          <div className="contact-info-text">
            <span className="contact-info-text-title">Gọi mua hàng</span>
            <span className="phone">0327391502</span>
          </div>
        </div>

        <div className="account" onClick={() => setIsAccountOpen(!isAccountOpen)}>
          <FaUser />
          <div className="account-text">
            <span className="account-text-title">Thông tin</span>
            <span className="account-text-value">Tài khoản</span>
          </div>
          {isAccountOpen && (
            <div className="account-menu">
              {!isLoggedIn && (
                <>
                  <Link to="/dang-nhap" onClick={() => setIsAccountOpen(false)}>Đăng nhập</Link>
                  <Link to="/dang-ky" onClick={() => setIsAccountOpen(false)}>Đăng ký</Link>
                </>
              )}
              <Link to="/wishlist" onClick={() => setIsAccountOpen(false)}>Sản phẩm yêu thích</Link>
              {isLoggedIn && (
                <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
              )}
            </div>
          )}
        </div>

        <Link to="/gio-hang" className="cart">
          <FaShoppingCart />
          <span className="cart-badge">2</span>
        </Link>
      </div>

      {/* Block 2: navigation */}
      <nav className="header-nav container">
        <NavLink to="/">Trang chủ</NavLink>
        <NavLink to="/gioi-thieu">Giới thiệu</NavLink>
        {Array.isArray(categories) && categories.map((cat) => (
          <div 
            key={cat.id} 
            className="category-item"
            onMouseEnter={() => setHoveredCategory(cat.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <NavLink to={`/danh-muc/${cat.id}`}>{cat.name}</NavLink>
            {cat.series && cat.series.length > 0 && hoveredCategory === cat.id && (
              <div 
                className="category-dropdown"
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {cat.series.map((series) => (
                  <Link 
                    key={series.id} 
                    to={`/danh-muc/${cat.id}/series/${series.id}`}
                    className="series-link"
                  >
                    {series.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="spacer" />
        <NavLink to="/chinh-sach">Chính sách</NavLink>
        <NavLink to="/tin-tuc">Tin tức</NavLink>
      </nav>

      {/* Mobile drawer for navigation */}
      {isMobileNavOpen && (
        <>
          <div className="drawer" role="dialog" aria-modal="true">
            <div className="drawer-header">
              <span>Menu</span>
              <button className="icon-btn" onClick={()=>setIsMobileNavOpen(false)} aria-label="Đóng">✕</button>
            </div>
            <div className="drawer-content">
              <Link to="/" onClick={()=>setIsMobileNavOpen(false)}>Trang chủ</Link>
              <Link to="/gioi-thieu" onClick={()=>setIsMobileNavOpen(false)}>Giới thiệu</Link>
              {Array.isArray(categories) && categories.map((cat) => (
                <div key={cat.id} className="mobile-category-item">
                  <Link to={`/danh-muc/${cat.id}`} onClick={()=>setIsMobileNavOpen(false)}>
                    {cat.name}
                  </Link>
                  {cat.series && cat.series.length > 0 && (
                    <div className="mobile-series-list">
                      {cat.series.map((series) => (
                        <Link 
                          key={series.id} 
                          to={`/danh-muc/${cat.id}/series/${series.id}`}
                          onClick={()=>setIsMobileNavOpen(false)}
                          className="mobile-series-link"
                        >
                          {series.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link to="/chinh-sach" onClick={()=>setIsMobileNavOpen(false)}>Chính sách</Link>
              <Link to="/tin-tuc" onClick={()=>setIsMobileNavOpen(false)}>Tin tức</Link>
            </div>
          </div>
          <div className="drawer-backdrop" onClick={()=>setIsMobileNavOpen(false)} />
        </>
      )}
    </header>
  );
}