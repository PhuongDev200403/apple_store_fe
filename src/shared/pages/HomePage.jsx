import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaTruck, FaGift, FaPhone, FaAward, FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';
import { getAllParentCategories } from '../utils/api/categoryApi';
import { getAllVariants } from '../utils/api/variantApi';
import { addToCart } from '../utils/api/cartApi';
import { addToWishlist } from '../utils/api/wishlistApi';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingProductId, setProcessingProductId] = useState(null);

  const sliderData = [
    {
      id: 1,
      title: "iPhone 15 Pro Max",
      subtitle: "Titanium. So Pro.",
      description: "Trải nghiệm sức mạnh vượt trội với chip A17 Pro và camera 48MP",
      image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&h=600&fit=crop&q=80",
      link: "/danh-muc/1"
    },
    {
      id: 2,
      title: "MacBook Pro M3",
      subtitle: "Mind-blowing performance",
      description: "Hiệu năng đỉnh cao với chip M3, màn hình Liquid Retina XDR",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=600&fit=crop&q=80",
      link: "/danh-muc/3"
    },
    {
      id: 3,
      title: "iPad Air",
      subtitle: "Light. Bright. Full of might.",
      description: "Màn hình 10.9 inch Liquid Retina, chip M1 mạnh mẽ",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&h=600&fit=crop&q=80",
      link: "/danh-muc/2"
    }
  ];

  const featuresData = [
    {
      id: 1,
      icon: <FaTruck />,
      title: "Vận chuyển miễn phí",
      description: "Miễn phí vận chuyển toàn quốc cho đơn hàng từ 500k"
    },
    {
      id: 2,
      icon: <FaGift />,
      title: "Quà tặng hấp dẫn",
      description: "Nhiều ưu đãi và quà tặng hấp dẫn mỗi ngày"
    },
    {
      id: 3,
      icon: <FaPhone />,
      title: "Hotline 24/7",
      description: "Hỗ trợ khách hàng 24/7 qua hotline 1900 6750"
    },
    {
      id: 4,
      icon: <FaAward />,
      title: "Chứng nhận chất lượng",
      description: "100% sản phẩm chính hãng, bảo hành toàn quốc"
    }
  ];

  useEffect(() => {
    Promise.all([
      getAllParentCategories(),
      getAllVariants()
    ])
      .then(([categoriesData, variantsData]) => {
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setProducts(Array.isArray(variantsData) ? variantsData.filter(v => v.status === 'ACTIVE') : []);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  const goToSlide = (index) => setCurrentSlide(index);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getProductsByCategory = (categoryId) => {
    return products.filter(p => p.productId === categoryId).slice(0, 8);
  };

  // Fake products for other categories (temporary until API is ready)
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để thực hiện chức năng này');
      navigate('/dang-nhap');
      return false;
    }
    return true;
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!checkAuth()) return;
    
    if (product.status !== 'ACTIVE' || product.quantity === 0) {
      alert('Sản phẩm hiện không khả dụng');
      return;
    }

    try {
      setProcessingProductId(product.id);
      console.log('Adding product to cart:', product);
      console.log('Product ID:', product.id);
      console.log('Product name:', product.slug);
      await addToCart(product.id, 1);
      alert(`Đã thêm "${product.slug?.replace(/-/g, ' ')}" vào giỏ hàng!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    } finally {
      setProcessingProductId(null);
    }
  };

  const handleAddToWishlist = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!checkAuth()) return;

    try {
      setProcessingProductId(product.id);
      console.log('Adding product to wishlist:', product);
      console.log('Product ID:', product.id);
      console.log('Product name:', product.slug);
      await addToWishlist(product.id);
      alert(`Đã thêm "${product.slug?.replace(/-/g, ' ')}" vào danh sách yêu thích!`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert(error.response?.data?.message || 'Không thể thêm vào danh sách yêu thích');
    } finally {
      setProcessingProductId(null);
    }
  };

  const getFakeProducts = (categoryId, categoryName) => {
    const fakeProducts = [
      {
        id: `fake-${categoryId}-1`,
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
        slug: `${categoryName.toLowerCase()}-pro-11-inch-256gb`,
        memory: "256",
        color: "silver",
        price: 25000000,
        quantity: 15,
        status: "ACTIVE",
        productId: categoryId
      },
      {
        id: `fake-${categoryId}-2`,
        imageUrl: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop",
        slug: `${categoryName.toLowerCase()}-air-10-9-inch-128gb`,
        memory: "128",
        color: "space-gray",
        price: 18000000,
        quantity: 20,
        status: "ACTIVE",
        productId: categoryId
      },
      {
        id: `fake-${categoryId}-3`,
        imageUrl: "https://images.unsplash.com/photo-1585790050230-5dd28404f1e4?w=400&h=400&fit=crop",
        slug: `${categoryName.toLowerCase()}-mini-8-3-inch-256gb`,
        memory: "256",
        color: "pink",
        price: 16000000,
        quantity: 12,
        status: "ACTIVE",
        productId: categoryId
      },
      {
        id: `fake-${categoryId}-4`,
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
        slug: `${categoryName.toLowerCase()}-pro-12-9-inch-512gb`,
        memory: "512",
        color: "gold",
        price: 35000000,
        quantity: 8,
        status: "ACTIVE",
        productId: categoryId
      }
    ];
    return fakeProducts;
  };

  return (
    <div className="homepage">
      {/* Hero Slider */}
      <section className="hero-slider">
        <div className="slider-container">
          {sliderData.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="slide-overlay">
                <div className="container">
                  <div className="slide-content">
                    <h1 className="slide-title">{slide.title}</h1>
                    <h2 className="slide-subtitle">{slide.subtitle}</h2>
                    <p className="slide-description">{slide.description}</p>
                    <Link to={slide.link} className="btn btn-primary slide-btn">
                      Khám phá ngay
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button className="slider-btn prev" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          <button className="slider-btn next" onClick={nextSlide}>
            <FaChevronRight />
          </button>
          
          <div className="slider-indicators">
            {sliderData.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {featuresData.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      {loading ? (
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      ) : (
        categories.map((category) => {
          let categoryProducts = getProductsByCategory(category.id);
          
          // If no real products, use fake data for demo
          if (categoryProducts.length === 0) {
            categoryProducts = getFakeProducts(category.id, category.name);
          }

          return (
            <section key={category.id} className="product-section">
              <div className="container">
                <div className="section-header">
                  <h2 className="section-title">{category.name}</h2>
                  <Link to={`/danh-muc/${category.id}`} className="view-all-btn">
                    Xem tất cả →
                  </Link>
                </div>
                
                <div className="products-grid">
                  {categoryProducts.map((product) => (
                    <Link 
                      key={product.id} 
                      to={`/san-pham/${category.id}/${product.id}`}
                      state={{ variantId: product.id, productId: product.productId }}
                      className="product-card"
                    >
                      <div className="product-image">
                        <img src={product.imageUrl || '/default-product.jpg'} alt={product.slug} />
                        {product.quantity < 10 && product.quantity > 0 && (
                          <div className="stock-badge">Còn {product.quantity} sp</div>
                        )}
                        {product.quantity === 0 && (
                          <div className="stock-badge out-of-stock">Hết hàng</div>
                        )}
                        <div className="product-overlay">
                          <button 
                            className="action-btn"
                            onClick={(e) => handleAddToWishlist(e, product)}
                            disabled={processingProductId === product.id}
                            title="Thêm vào yêu thích"
                          >
                            <FaHeart /> Yêu thích
                          </button>
                        </div>
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">
                          {product.slug?.replace(/-/g, ' ') || 'Sản phẩm'}
                        </h3>
                        <div className="product-specs">
                          <span className="spec-badge">{product.memory}GB</span>
                          <span className="spec-badge color-badge" style={{
                            background: product.color || '#ccc'
                          }}>{product.color}</span>
                        </div>
                        <div className="price-section">
                          <span className="current-price">{formatPrice(product.price)}</span>
                        </div>
                        <button 
                          className="add-to-cart-btn"
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={processingProductId === product.id || product.quantity === 0}
                        >
                          {processingProductId === product.id ? (
                            <>Đang thêm...</>
                          ) : (
                            <>
                              <FaShoppingCart /> Thêm vào giỏ
                            </>
                          )}
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
