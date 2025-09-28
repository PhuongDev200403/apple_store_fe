import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaTruck, FaGift, FaPhone, FaAward, FaShoppingCart, FaHeart, FaEye, FaSyncAlt, FaCog } from 'react-icons/fa';
import { getAllParentCategories } from '../utils/api/categoryApi';
import './HomePage.css';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);

  // Slider data
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

  // Features data
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

  // Sample products data (in real app, this would come from API)
  const sampleProducts = [
    { id: 1, name: "iPhone 15 Pro Max 256GB - Chính hãng VN/A", price: "32.990.000", originalPrice: "39.990.000", discount: "18%", warranty: "BH 24 tháng", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop" },
    { id: 2, name: "iPhone 15 Pro 128GB - Chính hãng VN/A", price: "28.990.000", originalPrice: "34.990.000", discount: "17%", warranty: "BH 24 tháng", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop" },
    { id: 3, name: "iPhone 15 128GB - Chính hãng VN/A", price: "24.990.000", originalPrice: "29.990.000", discount: "17%", warranty: "BH 24 tháng", image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=300&fit=crop" },
    { id: 4, name: "iPhone 14 Pro Max 256GB - Chính hãng VN/A", price: "29.990.000", originalPrice: "35.990.000", discount: "17%", warranty: "BH 24 tháng", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop" },
    { id: 5, name: "iPhone 14 Pro 128GB - Chính hãng VN/A", price: "25.990.000", originalPrice: "30.990.000", discount: "16%", warranty: "BH 24 tháng", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop" },
    { id: 6, name: "iPhone 14 Plus 128GB - Chính hãng VN/A", price: "21.490.000", originalPrice: "27.990.000", discount: "23%", warranty: "BH 24 tháng", image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=300&fit=crop" },
    { id: 7, name: "iPhone 13 Pro Max 256GB - Chính hãng VN/A", price: "26.990.000", originalPrice: "32.990.000", discount: "18%", warranty: "BH 24 tháng", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop" },
    { id: 8, name: "iPhone 13 Pro 128GB - Chính hãng VN/A", price: "22.990.000", originalPrice: "27.990.000", discount: "18%", warranty: "BH 24 tháng", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop" },
    { id: 9, name: "iPhone 13 128GB - Chính hãng VN/A", price: "18.990.000", originalPrice: "22.990.000", discount: "17%", warranty: "BH 24 tháng", image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=300&fit=crop" },
    { id: 10, name: "iPhone 12 Pro Max 256GB - Chính hãng VN/A", price: "23.990.000", originalPrice: "28.990.000", discount: "17%", warranty: "BH 24 tháng", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop" },
    { id: 11, name: "iPhone 12 Pro 128GB - Chính hãng VN/A", price: "19.990.000", originalPrice: "24.990.000", discount: "20%", warranty: "BH 24 tháng", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop" },
    { id: 12, name: "iPhone 12 128GB - Chính hãng VN/A", price: "15.990.000", originalPrice: "19.990.000", discount: "20%", warranty: "BH 24 tháng", image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=300&fit=crop" }
  ];

  // Category display order (can be configured)
  const categoryDisplayOrder = [1, 3, 2, 4]; // iPhone, Macbook, iPad, Apple Watch

  // News data
  const newsData = [
    {
      id: 1,
      title: "iPhone 15 Pro Max chính thức ra mắt với nhiều tính năng mới",
      excerpt: "Apple vừa chính thức ra mắt iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP...",
      image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=250&fit=crop&q=80",
      date: "15/10/2024",
      category: "iPhone"
    },
    {
      id: 2,
      title: "MacBook Pro M3: Hiệu năng vượt trội cho công việc chuyên nghiệp",
      excerpt: "MacBook Pro M3 mang đến hiệu năng đỉnh cao với chip M3 mới nhất từ Apple...",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=250&fit=crop&q=80",
      date: "12/10/2024",
      category: "MacBook"
    },
    {
      id: 3,
      title: "iPad Air 2024: Thiết kế mỏng nhẹ, hiệu năng mạnh mẽ",
      excerpt: "iPad Air 2024 với thiết kế mỏng nhẹ và chip M1 mạnh mẽ, phù hợp cho mọi nhu cầu...",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=250&fit=crop&q=80",
      date: "10/10/2024",
      category: "iPad"
    },
    {
      id: 4,
      title: "Apple Watch Series 9: Theo dõi sức khỏe thông minh hơn",
      excerpt: "Apple Watch Series 9 với nhiều tính năng theo dõi sức khỏe mới và thiết kế đẹp mắt...",
      image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=250&fit=crop&q=80",
      date: "08/10/2024",
      category: "Apple Watch"
    }
  ];

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

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getCategoryById = (id) => {
    return categories.find(cat => cat.id === id);
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
          
          {/* Slider Controls */}
          <button className="slider-btn prev" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          <button className="slider-btn next" onClick={nextSlide}>
            <FaChevronRight />
          </button>
          
          {/* Slider Indicators */}
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
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      {categoryDisplayOrder.map((categoryId) => {
        const category = getCategoryById(categoryId);
        if (!category) return null;

        return (
          <section key={category.id} className="product-section">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">{category.name}</h2>
                <Link to={`/danh-muc/${category.id}`} className="view-all-btn">
                  Xem tất cả
                </Link>
              </div>
              
              <div className="products-grid">
                {sampleProducts.slice(0, 4).map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                      <div className="discount-badge">Giảm {product.discount}</div>
                      <div className="product-actions">
                        <button className="action-btn">
                          <FaEye />
                        </button>
                        <button className="action-btn">
                          <FaHeart />
                        </button>
                        <button className="action-btn">
                          <FaSyncAlt />
                        </button>
                      </div>
                    </div>
                    <div className="product-info">
                      <div className="warranty-badge">{product.warranty}</div>
                      <h3 className="product-name">{product.name}</h3>
                      <div className="price-section">
                        <span className="original-price">{formatPrice(product.originalPrice)}</span>
                        <span className="current-price">{formatPrice(product.price)}</span>
                      </div>
                      <div className="promo-text">
                        Giảm 250.000đ khi mua kèm gói bảo hành VIP 12 tháng 1 Đổi 1
                      </div>
                      <button className="add-to-cart-btn">
                        <FaCog />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* News Section */}
      <section className="news-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Tin tức công nghệ</h2>
            <Link to="/tin-tuc" className="view-all-btn">
              Xem tất cả
            </Link>
          </div>
          
          <div className="news-grid">
            {newsData.map((news) => (
              <article key={news.id} className="news-card">
                <div className="news-image">
                  <img src={news.image} alt={news.title} />
                  <div className="news-category">{news.category}</div>
                </div>
                <div className="news-content">
                  <h3 className="news-title">{news.title}</h3>
                  <p className="news-excerpt">{news.excerpt}</p>
                  <div className="news-meta">
                    <span className="news-date">{news.date}</span>
                    <Link to={`/tin-tuc/${news.id}`} className="read-more">
                      Đọc tiếp
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

