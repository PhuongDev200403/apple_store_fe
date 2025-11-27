import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaHeart, FaBolt } from 'react-icons/fa';
import { addToCart } from '../../utils/api/cartApi';
import { addToWishlist } from '../../utils/api/wishlistApi';
import './ProductVariantsPage.css';

export default function ProductVariantsPage() {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingVariantId, setProcessingVariantId] = useState(null);

  const extractIdFromSlug = (slug) => {
    if (!slug) return null;
    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];
    const id = parseInt(lastPart, 10);
    return isNaN(id) ? null : id;
  };

  useEffect(() => {
    fetchProductVariants();
  }, [productSlug]);

  const fetchProductVariants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Extract ID from slug (e.g., "iphone-14-pro-1" -> 1)
      const productId = extractIdFromSlug(productSlug);
      
      if (!productId) {
        setError('URL không hợp lệ');
        return;
      }

      // Fetch product info
      const productResponse = await fetch(`http://localhost:8080/api/products/${productId}`);
      const productData = await productResponse.json();
      
      if (productData.code === 0 && productData.result) {
        setProduct(productData.result);
      }

      // Fetch variants by product ID
      const variantsResponse = await fetch(`http://localhost:8080/api/variants/${productId}`);
      const variantsData = await variantsResponse.json();
      
      if (variantsData.code === 0 && Array.isArray(variantsData.result)) {
        setVariants(variantsData.result);
      } else if (Array.isArray(variantsData)) {
        setVariants(variantsData);
      } else {
        setVariants([]);
      }
      
      if (!productData.result && variants.length === 0) {
        setError('Không tìm thấy sản phẩm');
      }
    } catch (err) {
      console.error('Error fetching variants:', err);
      setError('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để thực hiện chức năng này');
      navigate('/dang-nhap');
      return false;
    }
    return true;
  };

  const handleAddToCart = async (e, variant) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!checkAuth()) return;
    
    if (variant.status !== 'ACTIVE' || variant.quantity === 0) {
      alert('Sản phẩm hiện không khả dụng');
      return;
    }

    try {
      setProcessingVariantId(variant.id);
      await addToCart(variant.id, 1);
      alert('Đã thêm vào giỏ hàng!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    } finally {
      setProcessingVariantId(null);
    }
  };

  const handleAddToWishlist = async (e, variant) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!checkAuth()) return;

    try {
      setProcessingVariantId(variant.id);
      await addToWishlist(variant.id);
      alert('Đã thêm vào danh sách yêu thích!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert(error.response?.data?.message || 'Không thể thêm vào danh sách yêu thích');
    } finally {
      setProcessingVariantId(null);
    }
  };

  const handleBuyNow = (e, variant) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!checkAuth()) return;
    
    if (variant.status !== 'ACTIVE' || variant.quantity === 0) {
      alert('Sản phẩm hiện không khả dụng');
      return;
    }

    // Navigate to checkout with variant info
    navigate('/thanh-toan', {
      state: {
        buyNow: true,
        items: [{
          productVariantId: variant.id,
          quantity: 1,
          variant: variant
        }]
      }
    });
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page">
        <div className="container">
          <div className="error-state">
            <h3>{error || 'Không tìm thấy sản phẩm'}</h3>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page product-variants-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <button className="btn-back" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Quay lại
          </button>
          <div className="page-title-section">
            <h1 className="page-title">{product.name}</h1>
            {product.description && (
              <p className="page-description">{product.description}</p>
            )}
          </div>
        </div>

        {/* Variants Grid */}
        {variants.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có phiên bản nào cho sản phẩm này</p>
          </div>
        ) : (
          <div className="variants-grid">
            {variants.map((variant) => {
              const isProcessing = processingVariantId === variant.id;
              const isAvailable = variant.status === 'ACTIVE' && variant.quantity > 0;
              
              return (
                <div key={variant.id} className="variant-card">
                  <Link to={`/san-pham/${product.categoryChildId || 1}/${variant.id}`} className="variant-card-link">
                    <div className="variant-image">
                      <img
                        src={variant.imageUrl || '/default-product.jpg'}
                        alt={variant.slug}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f0f0f0" width="300" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      {variant.status === 'INACTIVE' && (
                        <div className="variant-badge badge-inactive">Ngừng bán</div>
                      )}
                      {variant.quantity === 0 && variant.status === 'ACTIVE' && (
                        <div className="variant-badge badge-out-of-stock">Hết hàng</div>
                      )}
                    </div>
                    <div className="variant-info">
                      <h3 className="variant-name">
                        {variant.slug?.replace(/-/g, ' ') || 'Sản phẩm'}
                      </h3>
                      <div className="variant-specs">
                        {variant.color && (
                          <div className="spec-item">
                            <span className="spec-label">Màu</span>
                            <span className="spec-value">{variant.color}</span>
                          </div>
                        )}
                        {variant.memory && (
                          <div className="spec-item">
                            <span className="spec-label">Bộ nhớ</span>
                            <span className="spec-value">{variant.memory}GB</span>
                          </div>
                        )}
                      </div>
                      <div className="variant-price">
                        {formatPrice(variant.price)}
                      </div>
                      {variant.quantity > 0 && variant.status === 'ACTIVE' && (
                        <div className="variant-stock">
                          Còn {variant.quantity} sản phẩm
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  {/* Action Buttons */}
                  <div className="variant-actions">
                    <button
                      className="btn-action btn-wishlist"
                      onClick={(e) => handleAddToWishlist(e, variant)}
                      disabled={isProcessing}
                      title="Thêm vào yêu thích"
                    >
                      <FaHeart />
                    </button>
                    <button
                      className="btn-action btn-cart"
                      onClick={(e) => handleAddToCart(e, variant)}
                      disabled={!isAvailable || isProcessing}
                      title="Thêm vào giỏ hàng"
                    >
                      <FaShoppingCart />
                    </button>
                    <button
                      className="btn-action btn-buy-now"
                      onClick={(e) => handleBuyNow(e, variant)}
                      disabled={!isAvailable || isProcessing}
                      title="Mua ngay"
                    >
                      <FaBolt />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
