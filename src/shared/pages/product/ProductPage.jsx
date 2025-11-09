import "./ProductPage.css";
import ProductBanner from "./ProductBanner";
import SubcategoryFilter from "./SubcategoryFilter";
import FilterBar from "./FilterBar";
import ProductCard from "./ProductCard";
import { useState } from "react"
const ProductPage = ({ category }) => {
    const [sortBy, setSortBy] = useState("default")
    const [selectedSubcategory, setSelectedSubcategory] = useState("all")
  
    // Sample product data
    const products = [
      {
        id: 1,
        name: "iPhone 13 Pro Max 512GB",
        originalPrice: 43990000,
        currentPrice: 27990000,
        discount: 36,
        image: "/iphone-13-pro-max-white.jpg",
        warranty: "12 tháng",
        installment: true,
        installmentRate: 0,
        series: "iphone-13",
      },
      {
        id: 2,
        name: "iPhone 13 Pro Max 1TB",
        originalPrice: 49990000,
        currentPrice: 29990000,
        discount: 40,
        image: "/iphone-13-pro-max-green.jpg",
        warranty: "24 tháng",
        installment: true,
        installmentRate: 0,
        series: "iphone-13",
      },
      {
        id: 3,
        name: "iPhone 14 256GB - Chính hãng VN/A",
        originalPrice: 0,
        currentPrice: 0,
        discount: 0,
        image: "/iphone-14-red.jpg",
        warranty: "24 tháng",
        installment: false,
        series: "iphone-14",
      },
      {
        id: 4,
        name: "iPhone 14 512GB - Chính hãng VN/A",
        originalPrice: 33990000,
        currentPrice: 27990000,
        discount: 18,
        image: "/iphone-14-yellow.jpg",
        warranty: "24 tháng",
        installment: true,
        installmentRate: 0,
        series: "iphone-14",
      },
    ]
  
    const subcategories = [
      { id: "iphone-14", label: "iPhone 14 Series" },
      { id: "iphone-13", label: "iPhone 13 Series" },
      { id: "iphone-12", label: "iPhone 12 series" },
      { id: "iphone-11", label: "iPhone 11 series" },
    ]
  
    // Filter products
    const filteredProducts =
      selectedSubcategory === "all" ? products : products.filter((p) => p.series === selectedSubcategory)
  
    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "price-asc":
          return a.currentPrice - b.currentPrice
        case "price-desc":
          return b.currentPrice - a.currentPrice
        default:
          return 0
      }
    })
  
    return (
      <div className="product-page">
        <ProductBanner category={category} />
        <div className="product-page-container">
          <SubcategoryFilter
            subcategories={subcategories}
            selectedSubcategory={selectedSubcategory}
            onSelectSubcategory={setSelectedSubcategory}
          />
          <FilterBar sortBy={sortBy} onSortChange={setSortBy} />
          <div className="products-grid">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  export default ProductPage