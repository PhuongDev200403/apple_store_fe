import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getCategoryById, getSeriesByCategoryId } from '../../utils/api/categoryApi.js';
import { getAllProducts } from '../../utils/api/productApi.js';
import './CategoryPage.css';

export default function CategoryPage() {
  const { categoryId, seriesId } = useParams();
  const [params, setParams] = useSearchParams();
  const [category, setCategory] = useState(null);
  const [seriesList, setSeriesList] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(params.get('sort') || 'name-asc');
  const [priceMin, setPriceMin] = useState(params.get('min') || '');
  const [priceMax, setPriceMax] = useState(params.get('max') || '');

  const BANNERS = {
    // Map categoryId to banner URL. Replace with real images when available
    'iphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop',
    'ipad': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1600&auto=format&fit=crop',
    'mac': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop',
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [cat, series, allProducts] = await Promise.all([
          getCategoryById(categoryId),
          getSeriesByCategoryId(categoryId),
          getAllProducts(),
        ]);
        if (!mounted) return;
        setCategory(cat);
        setSeriesList(Array.isArray(series) ? series : []);
        setProducts(Array.isArray(allProducts) ? allProducts : []);
      } catch (_e) {
        if (!mounted) return;
        setCategory(null);
        setSeriesList([]);
        setProducts([]);
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

  const bannerUrl = BANNERS[String(category?.id)] || BANNERS[String(categoryId)] || '';

  const filteredProducts = useMemo(() => {
    // Try to filter by series if provided
    const targetSeriesId = seriesId ? parseInt(seriesId) : null;
    let list = Array.isArray(products) ? products : [];
    if (targetSeriesId) list = list.filter(p => parseInt(p?.categoryChildId) === targetSeriesId);
    // fallback: if no series provided, include products whose series belongs to this category
    if (!targetSeriesId && Array.isArray(seriesList) && seriesList.length > 0) {
      const childIds = new Set(seriesList.map(s => s.id));
      list = list.filter(p => childIds.has(parseInt(p?.categoryChildId)));
    }
    const min = priceMin ? parseFloat(priceMin) : null;
    const max = priceMax ? parseFloat(priceMax) : null;
    if (min != null) list = list.filter(p => (p.price ?? p.minPrice ?? 0) >= min);
    if (max != null) list = list.filter(p => (p.price ?? p.minPrice ?? 0) <= max);
    switch (sort) {
      case 'name-asc':
        list = [...list].sort((a,b) => String(a.name).localeCompare(String(b.name)));
        break;
      case 'name-desc':
        list = [...list].sort((a,b) => String(b.name).localeCompare(String(a.name)));
        break;
      case 'price-asc':
        list = [...list].sort((a,b) => (a.price ?? a.minPrice ?? 0) - (b.price ?? b.minPrice ?? 0));
        break;
      case 'price-desc':
        list = [...list].sort((a,b) => (b.price ?? b.minPrice ?? 0) - (a.price ?? a.minPrice ?? 0));
        break;
      default:
        break;
    }
    return list;
  }, [products, seriesList, seriesId, priceMin, priceMax, sort]);

  return (
    <div className="category-page">
      <div className="category-hero" style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : {}}>
        {!bannerUrl && (
          <div className="category-hero-fallback">
            <div className="container">
              <div className="title">{category?.name || 'Danh mục'}</div>
              <div className="desc">Khám phá sản phẩm chính hãng, ưu đãi hấp dẫn</div>
            </div>
          </div>
        )}
        {bannerUrl && (
          <div className="container banner-overlay">
            <div className="title">{category?.name || 'Danh mục'}</div>
            <div className="desc">Khám phá sản phẩm chính hãng, ưu đãi hấp dẫn</div>
          </div>
        )}
      </div>

      <div className="container category-content">
        <div className="subcategory-strip">
          {seriesList.map(s => (
            <Link key={s.id} className={`chip ${String(seriesId)===String(s.id)?'active':''}`} to={`/danh-muc/${categoryId}/series/${s.id}`}>{s.name}</Link>
          ))}
          {seriesList.length === 0 && <div className="muted">Chưa có danh mục con</div>}
        </div>

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
          {!loading && filteredProducts.length === 0 && <div className="empty">Không có sản phẩm</div>}
          {!loading && filteredProducts.map(p => (
            <div key={p.id} className="product-card">
              <div className="thumb" />
              <div className="name">{p.name}</div>
              <div className="price">{Number(p.price ?? p.minPrice ?? 0).toLocaleString()} đ</div>
              <button className="btn-add">Thêm vào giỏ</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

