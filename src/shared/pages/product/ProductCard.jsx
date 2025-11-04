import "./ProductCard.css";
const ProductCard = ({ product }) => {
    const formatPrice = (price) => {
      return price.toLocaleString("vi-VN") + "đ"
    }
  
    return (
      <div className="product-card">
        <div className="product-image-container">
          {product.discount > 0 && <div className="discount-badge">Giảm {product.discount}%</div>}
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />
          <button className="settings-btn">⚙️</button>
        </div>
  
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
  
          <div className="price-section">
            {product.originalPrice > 0 && <span className="original-price">{formatPrice(product.originalPrice)}</span>}
            {product.currentPrice > 0 && <span className="current-price">{formatPrice(product.currentPrice)}</span>}
            {product.currentPrice === 0 && <span className="liên-hệ">Liên hệ</span>}
          </div>
  
          {product.installment && <div className="installment-info">Trả góp {product.installmentRate}%</div>}
  
          <div className="warranty-info">BH {product.warranty}</div>
  
          {product.discount > 0 && <div className="promotion-text">Thu cũ đổi mới: Thu giá cao trợ giá đến 90%</div>}
        </div>
      </div>
    )
  }
  
  export default ProductCard