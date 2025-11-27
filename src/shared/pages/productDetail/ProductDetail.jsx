import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaArrowLeft } from 'react-icons/fa';
import { addToCart } from '../../utils/api/cartApi';
import { addToWishlist } from '../../utils/api/wishlistApi';
import './ProductDetail.css';

const sampleData = {
  code: 0,
  result: [
    {
      id: 4,
      price: 30000000.0,
      status: "ACTIVE",
      imageUrl:
        "https://res.cloudinary.com/dcv3lxcux/image/upload/v1760153536/apple-devices/e56079ec-78ec-4e2d-b357-d61a2dff96ff.webp",
      quantity: 9,
      memory: "256",
      sku: "IP15-RED-256",
      color: "red",
      specifications: {
        ram: "8GB",
        storage: "256GB",
        chip: "A17 Pro",
        screen_size: "6.7 inch",
        battery: "4422 mAh",
        camera: "48MP + 12MP + 12MP",
        os: "iOS 17",
        weight: "221g",
      },
    },
    {
      id: 5,
      price: 30000000.0,
      status: "ACTIVE",
      imageUrl:
        "https://res.cloudinary.com/dcv3lxcux/image/upload/v1760675814/apple-devices/6c944c39-042e-44ce-8aa2-51e24d0e337d.webp",
      quantity: 23,
      memory: "256",
      sku: "IP15-PINK-256",
      color: "pink",
      specifications: {
        ram: "8GB",
        storage: "256GB",
        chip: "A17 Pro",
        screen_size: "6.7 inch",
        battery: "4422 mAh",
        camera: "48MP + 12MP + 12MP",
        os: "iOS 17",
        weight: "221g",
      },
    },
    {
      id: 6,
      price: 30000000.0,
      status: "ACTIVE",
      imageUrl:
        "https://res.cloudinary.com/dcv3lxcux/image/upload/v1760690952/apple-devices/be7c7878-f9c7-4b0c-a9ad-80dcd8ee4bc7.webp",
      quantity: 19,
      memory: "256",
      sku: "IP15-YELOW-256",
      color: "yellow",
      specifications: {
        ram: "8GB",
        storage: "256GB",
        chip: "A17 Pro",
        screen_size: "6.7 inch",
        battery: "4422 mAh",
        camera: "48MP + 12MP + 12MP",
        os: "iOS 17",
        weight: "221g",
      },
    },
    {
      id: 7,
      price: 23000000.0,
      status: "ACTIVE",
      imageUrl:
        "https://res.cloudinary.com/dcv3lxcux/image/upload/v1760926850/apple-devices/77e1ccb2-8258-4b45-9d74-068f528e20a8.webp",
      quantity: 10,
      memory: "128",
      sku: "IP15-YELLOW-128",
      color: "yellow",
      specifications: {
        ram: "8GB",
        storage: "128GB",
        chip: "A17 Pro",
        screen_size: "6.7 inch",
        battery: "4422 mAh",
        camera: "48MP + 12MP + 12MP",
        os: "iOS 17",
        weight: "221g",
      },
    },
  ],
}

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
  const { productId, category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Extract variant ID and product ID from URL or state
  const clickedVariantId = location.state?.variantId;
  const actualProductId = location.state?.productId || extractIdFromSlug(productId);

  useEffect(() => {
    if (actualProductId) {
      fetchVariants();
    }
  }, [actualProductId]);

  const extractIdFromSlug = (slug) => {
    if (!slug) return null;
    if (!isNaN(slug)) return parseInt(slug, 10);
    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];
    const id = parseInt(lastPart, 10);
    return isNaN(id) ? null : id;
  };

  const fetchVariants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8080/api/variants/${actualProductId}`);
      const data = await response.json();
      
      let variantsList = [];
      if (data.code === 0 && Array.isArray(data.result)) {
        variantsList = data.result;
      } else if (Array.isArray(data)) {
        variantsList = data;
      }
      
      setVariants(variantsList);
      
      // Set selected variant
      if (clickedVariantId) {
        const clickedVariant = variantsList.find(v => v.id === clickedVariantId);
        if (clickedVariant) {
          setSelectedVariant(clickedVariant);
          setSelectedMemory(clickedVariant.memory);
        } else {
          setSelectedVariant(variantsList[0]);
          setSelectedMemory(variantsList[0]?.memory);
        }
      } else {
        setSelectedVariant(variantsList[0]);
        setSelectedMemory(variantsList[0]?.memory);
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
          <h1 className="product-title">iPhone 15 Pro Max</h1>

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
