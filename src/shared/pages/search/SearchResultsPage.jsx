import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchProducts } from '../../utils/api/productApi';
import ProductCard from '../product/ProductCard';
import './SearchResultsPage.css';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get('q') || '';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (keyword) {
      searchProductsData();
    } else {
      setLoading(false);
    }
  }, [keyword]);

  const searchProductsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await searchProducts(keyword);
      setProducts(results);
      
      // Flatten all variants from products
      const allVariants = [];
      for (const product of results) {
        if (product.productVariants && Array.isArray(product.productVariants)) {
          product.productVariants.forEach(variant => {
            allVariants.push({
              ...variant,
              productName: product.name,
              seriesId: product.categoryChildId
            });
          });
        }
      }
      setVariants(allVariants);
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Không thể tìm kiếm sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Map variants for display
  const variantsForDisplay = variants.map(variant => ({
    id: variant.id,
    name: variant.slug?.replace(/-/g, ' ') || variant.productName || 'Sản phẩm',
    currentPrice: variant.price,
    originalPrice: 0,
    discount: 0,
    image: variant.imageUrl || '/default-product.jpg',
    warranty: "12 tháng",
    installment: true,
    installmentRate: 0,
    seriesId: variant.seriesId,
    productId: variant.productId,
    productName: variant.productName,
    color: variant.color,
    memory: variant.memory,
    quantity: variant.quantity,
    status: variant.status
  }));

  if (loading) {
    return (
      <div className="search-results-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tìm kiếm...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!keyword) {
    return (
      <div className="search-results-page">
        <div className="container">
          <div className="empty-state">
            <h3>Vui lòng nhập từ khóa tìm kiếm</h3>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="container">
        <div className="search-header">
          <h1 className="search-title">
            Kết quả tìm kiếm cho: <span className="search-keyword">"{keyword}"</span>
          </h1>
          <p className="search-count">
            Tìm thấy <strong>{variantsForDisplay.length}</strong> sản phẩm
          </p>
        </div>

        {error && (
          <div className="error-state">
            <p>{error}</p>
          </div>
        )}

        {variantsForDisplay.length === 0 ? (
          <div className="empty-state">
            <h3>Không tìm thấy sản phẩm nào</h3>
            <p>Vui lòng thử lại với từ khóa khác</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Quay về trang chủ
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {variantsForDisplay.map((variant) => (
              <ProductCard key={variant.id} product={variant} isVariant={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
