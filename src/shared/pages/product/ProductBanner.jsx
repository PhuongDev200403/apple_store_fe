import "./ProductBanner.css";
const ProductBanner = ({ category = "iPhone" }) => {
    const bannerContent = {
      iPhone: {
        title: "iPhone",
        subtitle: "THỨ CỬ - ĐỔI MỚI",
        description: "KHÔNG LỌ BỊ TIỀN",
        gradient: "linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)",
      },
      "Máy tính": {
        title: "Máy tính",
        subtitle: "CÔNG NGHỆ MỚI",
        description: "HIỆU NĂNG CAO",
        gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
      },
      default: {
        title: "Sản phẩm",
        subtitle: "CHẤT LƯỢNG CAO",
        description: "GIẢM GIÁ ĐẶC BIỆT",
        gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
      },
    }
  
    const content = bannerContent[category] || bannerContent.default
  
    return (
      <div className="product-banner" style={{ background: content.gradient }}>
        <div className="banner-content">
          <div className="banner-left">
            <img src="/electronics-product-showcase.jpg" alt={category} className="banner-image" />
          </div>
          <div className="banner-right">
            <div className="banner-tag">{content.subtitle}</div>
            <h1 className="banner-title">{content.title}</h1>
            <p className="banner-description">{content.description}</p>
          </div>
        </div>
      </div>
    )
  }
  
  export default ProductBanner