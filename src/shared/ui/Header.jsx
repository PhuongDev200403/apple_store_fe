import { useEffect, useState } from 'react';
import { FaBars, FaUser, FaShoppingCart, FaSearch, FaHeart, FaSignInAlt, FaSignOutAlt, FaShoppingBag } from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getAllParentCategories } from '../utils/api/categoryApi';
import { getProductsBySeries } from '../utils/api/productApi';
import { getMyCart } from '../utils/api/cartApi';
import './header.css';

// Helper function to create slug
const createProductSlug = (name, id) => {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return `${slug}-${id}`;
};

export default function Header() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [searchQuery, setSearchQuery] = useState('');
  const [seriesProducts, setSeriesProducts] = useState({});
  const [activeMobileCategory, setActiveMobileCategory] = useState(null);
  const [activeMobileSeries, setActiveMobileSeries] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    getAllParentCategories()
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setCategories([]);
      });
  }, []);

  // Lắng nghe sự thay đổi của localStorage (đăng nhập/đăng xuất)
  useEffect(() => {
    const checkLoginStatus = () => {
      const isLoggedInNow = !!localStorage.getItem('token');
      setIsLoggedIn(isLoggedInNow);
      
      // Nếu đăng xuất thì reset cart count
      if (!isLoggedInNow) {
        setCartItemCount(0);
      } else {
        // Nếu đăng nhập thì load cart
        loadCartCount();
      }
    };

    // Kiểm tra khi component mount
    checkLoginStatus();

    // Lắng nghe sự kiện storage (khi localStorage thay đổi từ tab khác)
    window.addEventListener('storage', checkLoginStatus);

    // Lắng nghe custom event (khi localStorage thay đổi từ cùng tab)
    window.addEventListener('loginStatusChanged', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
    };
  }, []);

  // Load số lượng sản phẩm trong giỏ hàng
  const loadCartCount = async () => {
    if (!localStorage.getItem('token')) {
      setCartItemCount(0);
      return;
    }

    try {
      const cartData = await getMyCart();
      // Tính tổng số lượng sản phẩm trong giỏ hàng
      const totalCount = cartData?.cartItems?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;
      setCartItemCount(totalCount);
    } catch (error) {
      console.error('Error loading cart count:', error);
      setCartItemCount(0);
    }
  };

  // Load cart count khi component mount và user đã đăng nhập
  useEffect(() => {
    if (isLoggedIn) {
      loadCartCount();
    }
  }, [isLoggedIn]);

  // Lắng nghe sự kiện cập nhật giỏ hàng
  useEffect(() => {
    const handleCartUpdate = () => {
      if (isLoggedIn) {
        loadCartCount();
      }
    };

    // Lắng nghe custom event khi có thay đổi giỏ hàng
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileDrawerOpen]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setIsLoggedIn(false);
      setIsMobileDrawerOpen(false);
      // Dispatch event để các component khác biết đã đăng xuất
      window.dispatchEvent(new Event('loginStatusChanged'));
      navigate('/dang-nhap');
    } catch (_e) {
      // no-op
    }
  };

  const handleLogin = () => {
    setIsMobileDrawerOpen(false);
    navigate('/dang-nhap');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryHover = async (category) => {
    if (!category.series || category.series.length === 0) return;
    
    // Fetch products for each series if not already loaded
    for (const series of category.series) {
      if (!seriesProducts[series.id]) {
        try {
          const products = await getProductsBySeries(series.id);
          setSeriesProducts(prev => ({
            ...prev,
            [series.id]: products
          }));
        } catch (error) {
          console.error(`Error fetching products for series ${series.id}:`, error);
        }
      }
    }
  };

  const handleMobileCategoryClick = async (category) => {
    if (activeMobileCategory === category.id) {
      setActiveMobileCategory(null);
      setActiveMobileSeries(null);
    } else {
      setActiveMobileCategory(category.id);
      setActiveMobileSeries(null);
      
      // Fetch products for all series in this category
      if (category.series && category.series.length > 0) {
        for (const series of category.series) {
          if (!seriesProducts[series.id]) {
            try {
              const products = await getProductsBySeries(series.id);
              setSeriesProducts(prev => ({
                ...prev,
                [series.id]: products
              }));
            } catch (error) {
              console.error(`Error fetching products for series ${series.id}:`, error);
            }
          }
        }
      }
    }
  };

  const handleMobileSeriesClick = (seriesId) => {
    if (activeMobileSeries === seriesId) {
      setActiveMobileSeries(null);
    } else {
      setActiveMobileSeries(seriesId);
    }
  };

  return (
    <header className="modern-header">
      {/* Phần trên: Logo, Tìm kiếm, Actions */}
      <div className="header-top">
        <div className="container">
          {/* Mobile Toggle */}
          <button 
            className="mobile-toggle"
            onClick={() => setIsMobileDrawerOpen(true)}
            aria-label="Mở menu"
          >
            <FaBars />
          </button>

          {/* Logo */}
          <Link to="/" className="site-logo">
            <h1>Sudes Phone</h1>
          </Link>

          {/* Search Form */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-submit">
                <FaSearch /> Tìm kiếm
              </button>
            </div>
          </form>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Đăng nhập */}
            {!isLoggedIn && (
              <button className="header-btn btn-login" onClick={handleLogin}>
                <FaSignInAlt />
                <span>Đăng nhập</span>
              </button>
            )}

            {/* Đăng ký */}
            {!isLoggedIn && (
              <Link to="/dang-ky" className="header-btn btn-register">
                <FaUser />
                <span>Đăng ký</span>
              </Link>
            )}

            {/* Đăng xuất */}
            {isLoggedIn && (
              <button className="header-btn btn-logout" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Đăng xuất</span>
              </button>
            )}

            {/* Đơn hàng */}
            {isLoggedIn && (
              <Link to="/don-hang" className="header-btn btn-orders">
                <FaShoppingBag />
                <span>Đơn hàng</span>
              </Link>
            )}

            {/* Tài khoản */}
            {isLoggedIn && (
              <Link to="/tai-khoan" className="header-btn btn-account">
                <FaUser />
                <span>Tài khoản</span>
              </Link>
            )}

            {/* Danh sách yêu thích */}
            <Link to="/wishlist" className="header-btn btn-wishlist">
              <FaHeart />
              <span>Yêu thích</span>
            </Link>

            {/* Giỏ hàng */}
            <Link to="/gio-hang" className="header-btn btn-cart">
              <FaShoppingCart />
              <span>Giỏ hàng</span>
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Phần dưới: Navigation Menu */}
      <nav className="header-nav">
        <div className="container">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Trang chủ
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/gioi-thieu" className="nav-link">
                Giới thiệu
              </NavLink>
            </li>

            {/* Categories from API */}
            {Array.isArray(categories) && categories.map((cat) => (
              <li 
                key={cat.id} 
                className={`nav-item ${cat.series && cat.series.length > 0 ? 'has-dropdown' : ''}`}
                onMouseEnter={() => handleCategoryHover(cat)}
              >
                <NavLink to={`/danh-muc/${cat.id}`} className="nav-link">
                  {cat.name}
                </NavLink>
                
                {/* Dropdown nếu có series */}
                {cat.series && cat.series.length > 0 && (
                  <div className="dropdown-mega-menu">
                    <div className="mega-menu-container">
                      {cat.series.map((series) => {
                        const products = seriesProducts[series.id] || [];
                        return (
                          <div key={series.id} className="mega-menu-column">
                            <Link
                              to={`/danh-muc/${cat.id}/series/${series.id}`}
                              className="mega-menu-title"
                            >
                              {series.name}
                            </Link>
                            {products.length > 0 && (
                              <div className="mega-menu-items">
                                {products.slice(0, 6).map((product) => {
                                  const slug = createProductSlug(product.name, product.id);
                                  return (
                                    <Link
                                      key={product.id}
                                      to={`/product/${slug}/variants`}
                                      className="mega-menu-item"
                                    >
                                      {product.name}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </li>
            ))}

            <li className="nav-spacer"></li>

            <li className="nav-item">
              <NavLink to="/chinh-sach" className="nav-link">
                Chính sách
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/tin-tuc" className="nav-link">
                Tin tức
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isMobileDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-title">Menu</span>
          <button
            className="drawer-close"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-label="Đóng menu"
          >
            ✕
          </button>
        </div>

        <div className="drawer-body">
          {/* Login/Register/Logout in mobile */}
          <div className="drawer-section">
            {!isLoggedIn ? (
              <>
                <button 
                  className="drawer-link" 
                  onClick={handleLogin}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    font: 'inherit'
                  }}
                >
                  <FaSignInAlt style={{ marginRight: '8px' }} />
                  Đăng nhập
                </button>
                <Link
                  to="/dang-ky"
                  className="drawer-link"
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  <FaUser style={{ marginRight: '8px' }} />
                  Đăng ký
                </Link>
              </>
            ) : (
              <button 
                className="drawer-link" 
                onClick={handleLogout}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
              >
                <FaSignOutAlt style={{ marginRight: '8px' }} />
                Đăng xuất
              </button>
            )}
          </div>

          {/* Main menu */}
          <div className="drawer-section">
            <Link
              to="/"
              className="drawer-link"
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/gioi-thieu"
              className="drawer-link"
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              Giới thiệu
            </Link>
          </div>

          {/* Categories */}
          {Array.isArray(categories) && categories.length > 0 && (
            <div className="drawer-section">
              <div className="drawer-section-title">Danh mục sản phẩm</div>
              {categories.map((cat) => (
                <div key={cat.id} className="drawer-category">
                  <div className="drawer-category-header">
                    <Link
                      to={`/danh-muc/${cat.id}`}
                      className="drawer-category-link"
                      onClick={() => setIsMobileDrawerOpen(false)}
                    >
                      {cat.name}
                    </Link>
                    {cat.series && cat.series.length > 0 && (
                      <button
                        className="drawer-category-toggle"
                        onClick={() => handleMobileCategoryClick(cat)}
                      >
                        {activeMobileCategory === cat.id ? '−' : '+'}
                      </button>
                    )}
                  </div>
                  
                  {cat.series && cat.series.length > 0 && activeMobileCategory === cat.id && (
                    <div className="drawer-series">
                      {cat.series.map((series) => {
                        const products = seriesProducts[series.id] || [];
                        return (
                          <div key={series.id} className="drawer-series-item">
                            <div className="drawer-series-header">
                              <Link
                                to={`/danh-muc/${cat.id}/series/${series.id}`}
                                className="drawer-series-link"
                                onClick={() => setIsMobileDrawerOpen(false)}
                              >
                                {series.name}
                              </Link>
                              {products.length > 0 && (
                                <button
                                  className="drawer-series-toggle"
                                  onClick={() => handleMobileSeriesClick(series.id)}
                                >
                                  {activeMobileSeries === series.id ? '−' : '+'}
                                </button>
                              )}
                            </div>
                            
                            {products.length > 0 && activeMobileSeries === series.id && (
                              <div className="drawer-products">
                                {products.map((product) => {
                                  const slug = createProductSlug(product.name, product.id);
                                  return (
                                    <Link
                                      key={product.id}
                                      to={`/product/${slug}/variants`}
                                      className="drawer-product-link"
                                      onClick={() => setIsMobileDrawerOpen(false)}
                                    >
                                      {product.name}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Other links */}
          <div className="drawer-section">
            {isLoggedIn && (
              <>
                <Link
                  to="/tai-khoan"
                  className="drawer-link"
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  <FaUser style={{ marginRight: '8px', color: '#2563eb' }} />
                  Tài khoản của tôi
                </Link>
                <Link
                  to="/don-hang"
                  className="drawer-link"
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  <FaShoppingBag style={{ marginRight: '8px', color: '#10b981' }} />
                  Đơn hàng của tôi
                </Link>
              </>
            )}
            <Link
              to="/wishlist"
              className="drawer-link"
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              <FaHeart style={{ marginRight: '8px', color: '#ef4444' }} />
              Danh sách yêu thích
            </Link>
            <Link
              to="/gio-hang"
              className="drawer-link"
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              <FaShoppingCart style={{ marginRight: '8px' }} />
              Giỏ hàng {cartItemCount > 0 && `(${cartItemCount})`}
            </Link>
          </div>

          <div className="drawer-section">
            <Link
              to="/chinh-sach"
              className="drawer-link"
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              Chính sách
            </Link>
            <Link
              to="/tin-tuc"
              className="drawer-link"
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              Tin tức
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`drawer-overlay ${isMobileDrawerOpen ? 'open' : ''}`}
        onClick={() => setIsMobileDrawerOpen(false)}
      />
    </header>
  );
}