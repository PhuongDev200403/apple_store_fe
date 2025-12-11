import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getCategoryById, getSeriesByCategoryId } from '../../utils/api/categoryApi.js';
import { getVariantsByCategory } from '../../utils/api/variantApi.js';
import './CategoryPage.css';

export default function CategoryPage() {
  const { categoryId, seriesId } = useParams();
  const [params, setParams] = useSearchParams();
  const [category, setCategory] = useState(null);
  const [seriesList, setSeriesList] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(params.get('sort') || 'name-asc');
  const [priceMin, setPriceMin] = useState(params.get('min') || '');
  const [priceMax, setPriceMax] = useState(params.get('max') || '');

  // Hàm chuyển đổi tên màu thành mã màu hex
  const getColorHex = (color) => {
    const colorMap = {
      red: "#EF4444",
      pink: "#EC4899", 
      yellow: "#FBBF24",
      black: "#000000",
      white: "#FFFFFF",
      blue: "#3B82F6",
      green: "#10B981",
      purple: "#8B5CF6",
      gray: "#6B7280",
      silver: "#C0C0C0",
      gold: "#FFD700",
      orange: "#F97316",
      brown: "#A16207"
    };
    return colorMap[color?.toLowerCase()] || "#CCCCCC";
  };

  // Cấu hình banner cho từng danh mục
  const getBannerConfig = (categoryName) => {
    const configs = {
      'iPhone': {
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop',
        gradient: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3))',
        title: 'iPhone',
        subtitle: 'Sức mạnh. Đẳng cấp. Khác biệt.',
        description: 'Khám phá dòng iPhone mới nhất với công nghệ tiên tiến'
      },
      'iPad': {
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1600&auto=format&fit=crop',
        gradient: 'linear-gradient(135deg, rgba(59,130,246,0.8), rgba(37,99,235,0.6))',
        title: 'iPad',
        subtitle: 'Mạnh mẽ. Đa năng. Di động.',
        description: 'Trải nghiệm iPad với hiệu năng vượt trội'
      },
      'Mac': {
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop',
        gradient: 'linear-gradient(135deg, rgba(75,85,99,0.8), rgba(55,65,81,0.6))',
        title: 'Mac',
        subtitle: 'Hiệu năng. Sáng tạo. Chuyên nghiệp.',
        description: 'Khám phá dòng Mac với chip Apple Silicon'
      },
      'Apple Watch': {
        image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1600&auto=format&fit=crop',
        gradient: 'linear-gradient(135deg, rgba(239,68,68,0.8), rgba(220,38,38,0.6))',
        title: 'Apple Watch',
        subtitle: 'Sức khỏe. Thể thao. Kết nối.',
        description: 'Đồng hồ thông minh cho cuộc sống năng động'
      },
      'AirPods': {
        image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=1600&auto=format&fit=crop',
        gradient: 'linear-gradient(135deg, rgba(139,92,246,0.8), rgba(124,58,237,0.6))',
        title: 'AirPods',
        subtitle: 'Âm thanh. Tự do. Hoàn hảo.',
        description: 'Trải nghiệm âm thanh không dây đỉnh cao'
      }
    };
    
    return configs[categoryName] || {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
      gradient: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.6))',
      title: categoryName || 'Sản phẩm',
      subtitle: 'Chất lượng. Uy tín. Đảm bảo.',
      description: 'Khám phá sản phẩm chính hãng với ưu đãi hấp dẫn'
    };
  };

  const bannerConfig = getBannerConfig(category?.name);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [cat, series, categoryVariants] = await Promise.all([
          getCategoryById(categoryId),
          getSeriesByCategoryId(categoryId),
          getVariantsByCategory(categoryId),
        ]);
        if (!mounted) return;
        setCategory(cat);
        setSeriesList(Array.isArray(series) ? series : []);
        // Chỉ lấy variants có status ACTIVE
        const activeVariants = Array.isArray(categoryVariants) ? categoryVariants.filter(v => v.status === 'ACTIVE') : [];
        setVariants(activeVariants);
      } catch (_e) {
        if (!mounted) return;
        setCategory(null);
        setSeriesList([]);
        setVariants([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    // keep params in sync with state
    const next = new URLSearchParams(params);
    next.set('sort', sort);
    if (priceMin) next.set('min', priceMin); else next.delete('min');
    if (priceMax) next.set('max', priceMax); else next.delete('max');
    setParams(next, { replace: true });
    return () => { mounted = false; };
  }, [categoryId, seriesId, sort, priceMin, priceMax]);



  const filteredVariants = useMemo(() => {
    // Filter variants by series if provided
    const targetSeriesId = seriesId ? parseInt(seriesId) : null;
    let list = Array.isArray(variants) ? variants : [];
    
    // Filter by series (productId trong variant tương ứng với seriesId)
    if (targetSeriesId) {
      list = list.filter(v => parseInt(v?.productId) === targetSeriesId);
    }
    
    // Filter by price range
    const min = priceMin ? parseFloat(priceMin) : null;
    const max = priceMax ? parseFloat(priceMax) : null;
    if (min != null) list = list.filter(v => (v.price ?? 0) >= min);
    if (max != null) list = list.filter(v => (v.price ?? 0) <= max);
    
    // Sort variants
    switch (sort) {
      case 'name-asc':
        list = [...list].sort((a,b) => String(a.slug || '').localeCompare(String(b.slug || '')));
        break;
      case 'name-desc':
        list = [...list].sort((a,b) => String(b.slug || '').localeCompare(String(a.slug || '')));
        break;
      case 'price-asc':
        list = [...list].sort((a,b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-desc':
        list = [...list].sort((a,b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      default:
        break;
    }
    return list;
  }, [variants, seriesList, seriesId, priceMin, priceMax, sort]);

  return (
    <div className="category-page">
      {/* Hero Banner */}
      <div className="category-hero">
        <div className="hero-background">
          <img src={bannerConfig.image} alt={bannerConfig.title} className="hero-image" />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge">{bannerConfig.subtitle}</span>
            <h1 className="hero-title">{bannerConfig.title}</h1>
            <p className="hero-description">{bannerConfig.description}</p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{filteredVariants.length}</span>
                <span className="stat-label">Sản phẩm</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{seriesList.length}</span>
                <span className="stat-label">Dòng sản phẩm</span>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="floating-card">
              <div className="card-glow"></div>
              <div className="product-preview">
                {filteredVariants.slice(0, 3).map((variant, index) => (
                  <div key={variant.id} className={`preview-item item-${index + 1}`}>
                    <img src={variant.imageUrl} alt={variant.slug} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Series Navigation */}
      <div className="series-section">
        <div className="container">
          <div className="series-header">
            <h2 className="series-title">Dòng sản phẩm {category?.name}</h2>
            <p className="series-subtitle">Chọn dòng sản phẩm để xem chi tiết</p>
          </div>
          
          <div className="series-tabs">
            <Link 
              className={`series-tab ${!seriesId ? 'active' : ''}`} 
              to={`/danh-muc/${categoryId}`}
            >
              <div className="tab-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <span>Tất cả</span>
              <div className="tab-count">{filteredVariants.length}</div>
            </Link>
            
            {seriesList.map(s => (
              <Link 
                key={s.id} 
                className={`series-tab ${String(seriesId) === String(s.id) ? 'active' : ''}`} 
                to={`/danh-muc/${categoryId}/series/${s.id}`}
              >
                <div className="tab-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H7V4h10v16z"/>
                  </svg>
                </div>
                <span>{s.name}</span>
                <div className="tab-count">
                  {variants.filter(v => parseInt(v?.productId) === s.id).length}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container category-content">

        <div className="filters">
          <div className="price">
            <input type="number" placeholder="Giá từ" value={priceMin} onChange={(e)=>setPriceMin(e.target.value)} />
            <span>-</span>
            <input type="number" placeholder="Giá đến" value={priceMax} onChange={(e)=>setPriceMax(e.target.value)} />
          </div>
          <div className="sort">
            <select value={sort} onChange={(e)=>setSort(e.target.value)}>
              <option value="name-asc">Tên A - Z</option>
              <option value="name-desc">Tên Z - A</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>
        </div>

        <div className="product-grid">
          {loading && <div className="loading">Đang tải sản phẩm...</div>}
          {!loading && filteredVariants.length === 0 && <div className="empty">Không có sản phẩm</div>}
          {!loading && filteredVariants.map(variant => (
            <Link 
              key={variant.id} 
              to={`/san-pham/${categoryId}/${variant.id}`}
              className="product-card"
            >
              <div className="thumb">
                <img 
                  src={variant.imageUrl || '/default-product.jpg'} 
                  alt={variant.slug} 
                  onError={(e) => e.target.src = '/default-product.jpg'}
                />
                {variant.quantity < 10 && variant.quantity > 0 && (
                  <div className="stock-badge">Còn {variant.quantity} sp</div>
                )}
                {variant.quantity === 0 && (
                  <div className="stock-badge out-of-stock">Hết hàng</div>
                )}
              </div>
              <div className="name">{variant.slug?.replace(/-/g, ' ') || 'Sản phẩm'}</div>
              <div className="specs">
                <span className="spec-badge memory-badge">{variant.memory}GB</span>
                <span 
                  className="spec-badge color-badge" 
                  style={{ backgroundColor: getColorHex(variant.color) }}
                  title={variant.color}
                >
                  {variant.color === 'white' && <span className="color-border"></span>}
                </span>
              </div>
              <div className="price">{Number(variant.price ?? 0).toLocaleString()} đ</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

