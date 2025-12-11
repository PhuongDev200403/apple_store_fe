import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { addToCart } from '../../utils/api/cartApi';
import { addToWishlist } from '../../utils/api/wishlistApi';
import { getVariantById } from '../../utils/api/variantApi';
import { getProductById } from '../../utils/api/productApi';
import './ProductDetail.css';



const relatedProducts = [
  {
    id: 101,
    name: "AirPods Pro (Gen 2)",
    price: 6490000,
    image: "https://res.cloudinary.com/dcv3lxcux/image/upload/v1760153536/apple-devices/airpods-pro.webp",
    category: "Tai nghe",
  },
  {
    id: 102,
    name: "AirPods Max",
    price: 14990000,
    image: "https://res.cloudinary.com/dcv3lxcux/image/upload/v1760675814/apple-devices/airpods-max.webp",
    category: "Tai nghe",
  },
  {
    id: 103,
    name: "Ốp lưng Silicon",
    price: 590000,
    image: "https://res.cloudinary.com/dcv3lxcux/image/upload/v1760690952/apple-devices/case-silicon.webp",
    category: "Phụ kiện",
  },
  {
    id: 104,
    name: "Cáp sạc USB-C",
    price: 290000,
    image: "https://res.cloudinary.com/dcv3lxcux/image/upload/v1760926850/apple-devices/cable-usb-c.webp",
    category: "Phụ kiện",
  },
  {
    id: 105,
    name: "MagSafe Wallet",
    price: 790000,
    image: "https://res.cloudinary.com/dcv3lxcux/image/upload/v1760153536/apple-devices/magsafe-wallet.webp",
    category: "Phụ kiện",
  },
  {
    id: 106,
    name: "Sạc nhanh 20W",
    price: 890000,
    image: "https://res.cloudinary.com/dcv3lxcux/image/upload/v1760675814/apple-devices/charger-20w.webp",
    category: "Phụ kiện",
  },
]

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const extractIdFromSlug = (slug) => {
    if (!slug) return null;
    if (!isNaN(slug)) return parseInt(slug, 10);
    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];
    const id = parseInt(lastPart, 10);
    return isNaN(id) ? null : id;
  };

  // productId in URL is actually variantId
  const variantIdFromUrl = extractIdFromSlug(productId);

  useEffect(() => {
    if (variantIdFromUrl) {
      fetchVariantAndRelated();
    }
  }, [variantIdFromUrl]);

  const fetchVariantAndRelated = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the specific variant
      const currentVariant = await getVariantById(variantIdFromUrl);
      
      if (!currentVariant) {
        setError('Không tìm thấy sản phẩm');
        return;
      }
      
      setSelectedVariant(currentVariant);
      setSelectedMemory(currentVariant.memory);
      
      // Get product information
      if (currentVariant.productId) {
        try {
          const product = await getProductById(currentVariant.productId);
          setProductInfo(product);
        } catch (err) {
          console.warn('Could not fetch product info:', err);
        }
      }
      
      // Get all variants of the same product
      if (currentVariant.productId) {
        try {
          const response = await fetch(`http://localhost:8080/api/variants/${currentVariant.productId}`);
          const data = await response.json();
          
          let variantsList = [];
          if (data.code === 0 && Array.isArray(data.result)) {
            variantsList = data.result;
          } else if (Array.isArray(data)) {
            variantsList = data;
          }
          
          setVariants(variantsList.length > 0 ? variantsList : [currentVariant]);
        } catch (err) {
          console.warn('Could not fetch related variants:', err);
          setVariants([currentVariant]);
        }
      } else {
        setVariants([currentVariant]);
      }
      
    } catch (err) {
      console.error('Error fetching variants:', err);
      setError('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
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

  const handleAddToCart = async () => {
    if (!checkAuth()) return;
    if (!selectedVariant || selectedVariant.quantity === 0) {
      alert('Sản phẩm hiện không khả dụng');
      return;
    }

    try {
      setProcessing(true);
      console.log('Adding to cart - Selected variant:', selectedVariant);
      console.log('Variant ID:', selectedVariant.id);
      console.log('Color:', selectedVariant.color, 'Memory:', selectedVariant.memory);
      
      await addToCart(selectedVariant.id, 1);
      // Dispatch event để cập nhật số lượng giỏ hàng trong header
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`Đã thêm "${selectedVariant.color} - ${selectedVariant.memory}GB" vào giỏ hàng!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    } finally {
      setProcessing(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!checkAuth()) return;

    try {
      setProcessing(true);
      await addToWishlist(selectedVariant.id);
      alert('Đã thêm vào danh sách yêu thích!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert(error.response?.data?.message || 'Không thể thêm vào danh sách yêu thích');
    } finally {
      setProcessing(false);
    }
  };

  // Get unique memory options
  const uniqueMemories = Array.from(new Set(variants.map((item) => item.memory)));

  // Filter variants by selected memory (use selectedVariant's memory if available)
  const currentMemory = selectedVariant?.memory || selectedMemory;
  const variantsByMemory = variants.filter((item) => item.memory === currentMemory);

  // Get unique colors from variants with current memory
  const uniqueColors = Array.from(new Map(variantsByMemory.map((item) => [item.color, item])).values());

  // Handle color selection
  const handleColorSelect = (color) => {
    const variant = variantsByMemory.find((item) => item.color === color);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  // Handle memory selection
  const handleMemorySelect = (memory) => {
    setSelectedMemory(memory);
    const variant = variants.find((item) => item.memory === memory);
    if (variant) {
      setSelectedVariant(variant);
    }
    console.log('Selected memory:', memory);
    console.log('Variants by memory:', variantsByMemory);
    console.log('Selected variant:', variant);
  };

  const getColorHex = (color) => {
    const colorMap = {
      red: "#EF4444",
      pink: "#EC4899",
      yellow: "#FBBF24",
      black: "#000000",
      white: "#FFFFFF",
      blue: "#3B82F6",
      green: "#10B981",
    };
    return colorMap[color?.toLowerCase()] || "#CCCCCC";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getProductTitle = () => {
    if (!selectedVariant) return 'Sản phẩm';
    
    // If we have product info, use product name + variant details
    if (productInfo?.name) {
      const variantDetails = [];
      if (selectedVariant.color) {
        variantDetails.push(selectedVariant.color.charAt(0).toUpperCase() + selectedVariant.color.slice(1));
      }
      if (selectedVariant.memory) {
        variantDetails.push(`${selectedVariant.memory}GB`);
      }
      
      return variantDetails.length > 0 
        ? `${productInfo.name} ${variantDetails.join(' ')}`
        : productInfo.name;
    }
    
    // Fallback: use slug but make it more readable
    if (selectedVariant.slug) {
      return selectedVariant.slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    return 'Sản phẩm';
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedVariant) {
    return (
      <div className="product-detail-container">
        <div className="error-state">
          <h3>{error || 'Không tìm thấy sản phẩm'}</h3>
          <button onClick={() => navigate(-1)} className="back-btn">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Parse specifications if it's a string
  const specs =
    typeof selectedVariant.specifications === "string"
      ? JSON.parse(selectedVariant.specifications)
      : selectedVariant.specifications;

  return (
    <div className="product-detail-container">
      <div className="product-wrapper">
        {/* Left Section - Images */}
        <div className="image-section">
          <div className="main-image" key={selectedVariant.id}>
            <img
              src={selectedVariant.imageUrl || "/placeholder.svg"}
              alt={`${selectedVariant.color} - ${selectedVariant.memory}GB`}
              onError={(e) => (e.target.src = "/placeholder.svg")}
            />
          </div>

          {/* Variant Thumbnails */}
          <div className="thumbnails">
            {variantsByMemory.map((variant) => (
              <div
                key={variant.id}
                className={`thumbnail ${selectedVariant.id === variant.id ? "active" : ""}`}
                onClick={() => setSelectedVariant(variant)}
              >
                <img
                  src={variant.imageUrl || "/placeholder.svg"}
                  alt={variant.color}
                  onError={(e) => (e.target.src = "/placeholder.svg")}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Product Info */}
        <div className="info-section">
          <h1 className="product-title">
            {getProductTitle()}
          </h1>

          <div className="price-section">
            <span className="price">{formatPrice(selectedVariant.price)}</span>
            <span className="stock">
              {selectedVariant.quantity > 0 ? `${selectedVariant.quantity} còn hàng` : "Hết hàng"}
            </span>
          </div>

          {/* Memory Selection */}
          <div className="selection-group">
            <label className="selection-label">Dung lượng</label>
            <div className="memory-options">
              {uniqueMemories.map((memory) => (
                <button
                  key={memory}
                  className={`memory-btn ${selectedMemory === memory ? "active" : ""}`}
                  onClick={() => handleMemorySelect(memory)}
                >
                  {memory}GB
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="selection-group">
            <label className="selection-label">Màu sắc</label>
            <div className="color-options">
              {uniqueColors.map((variant) => (
                <button
                  key={variant.color}
                  className={`color-btn ${selectedVariant.color === variant.color ? "active" : ""}`}
                  onClick={() => handleColorSelect(variant.color)}
                  title={variant.color}
                  style={{
                    backgroundColor: getColorHex(variant.color),
                    borderColor: selectedVariant.color === variant.color ? "#000" : "#ddd",
                  }}
                >
                  {selectedVariant.color === variant.color && <span className="checkmark">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="specs-section">
            <h3 className="specs-title">Thông số kỹ thuật</h3>
            <div className="specs-grid">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-key">{key.replace(/_/g, " ")}</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="btn-primary"
              onClick={handleAddToCart}
              disabled={processing || !selectedVariant || selectedVariant.quantity === 0}
            >
              {processing ? (
                <>Đang thêm...</>
              ) : (
                <>
                  <FaShoppingCart /> Thêm vào giỏ
                </>
              )}
            </button>
            <button 
              className="btn-secondary"
              onClick={handleAddToWishlist}
              disabled={processing}
            >
              <FaHeart /> Yêu thích
            </button>
          </div>

          {/* Product Details */}
          <div className="details-footer">
            <p>
              SKU: <strong>{selectedVariant.sku}</strong>
            </p>
            <p>
              Trạng thái: <strong>{selectedVariant.status === "ACTIVE" ? "Có sẵn" : "Không có"}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="related-products-section">
        <h2 className="related-title">Sản phẩm liên quan</h2>
        <div className="related-grid">
          {relatedProducts.map((product) => (
            <div key={product.id} className="related-product-card">
              <div className="related-image">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  onError={(e) => (e.target.src = "/placeholder.svg")}
                />
              </div>
              <div className="related-info">
                <p className="related-category">{product.category}</p>
                <h3 className="related-name">{product.name}</h3>
                <p className="related-price">{formatPrice(product.price)}</p>
              </div>
              <button className="related-add-btn">Thêm vào giỏ</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
