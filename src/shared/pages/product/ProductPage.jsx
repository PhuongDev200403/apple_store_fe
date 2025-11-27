import "./ProductPage.css";
import ProductBanner from "./ProductBanner";
import SubcategoryFilter from "./SubcategoryFilter";
import FilterBar from "./FilterBar";
import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCategoryById, getSeriesByCategoryId } from "../../utils/api/categoryApi";
import { getProductsBySeries } from "../../utils/api/productApi";

const ProductPage = ({ category }) => {
    const { categoryId } = useParams();
    const [sortBy, setSortBy] = useState("default");
    const [selectedSubcategory, setSelectedSubcategory] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [series, setSeries] = useState([]);
    const [allVariants, setAllVariants] = useState([]);

    useEffect(() => {
        loadData();
    }, [categoryId]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load category
            const categoryRes = categoryId ? await getCategoryById(categoryId) : null;
            setCategoryData(categoryRes);

            // Get series for this category
            let seriesData = [];
            if (categoryId) {
                seriesData = await getSeriesByCategoryId(categoryId);
                setSeries(seriesData);

                // Load products with variants for all series in this category
                const productsPromises = seriesData.map(s => 
                    getProductsBySeries(s.id).catch(() => [])
                );
                const productsArrays = await Promise.all(productsPromises);
                
                // Flatten all variants from all products
                const variants = [];
                for (const products of productsArrays) {
                    for (const product of products) {
                        if (product.productVariants && Array.isArray(product.productVariants)) {
                            // Add product info to each variant
                            product.productVariants.forEach(variant => {
                                variants.push({
                                    ...variant,
                                    productName: product.name,
                                    seriesId: product.categoryChildId
                                });
                            });
                        }
                    }
                }
                setAllVariants(variants);
            } else {
                setSeries([]);
                setAllVariants([]);
            }
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Không thể tải dữ liệu sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    // Map variants for display
    const variantsForDisplay = allVariants.map(variant => ({
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

    // Filter by selected subcategory (series)
    let filteredVariants = variantsForDisplay;
    if (selectedSubcategory !== "all") {
        filteredVariants = filteredVariants.filter(v => v.seriesId === parseInt(selectedSubcategory));
    }

    // Sort variants
    const sortedVariants = [...filteredVariants].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.currentPrice - b.currentPrice;
        case "price-desc":
          return b.currentPrice - a.currentPrice;
        default:
          return 0;
      }
    });

    // Format series for SubcategoryFilter
    const subcategories = series.map(s => ({
        id: s.id.toString(),
        label: s.name
    }));

    if (loading) {
        return (
            <div className="product-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Đang tải sản phẩm...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-page">
                <div className="error-state">
                    <h3>{error}</h3>
                </div>
            </div>
        );
    }
  
    return (
      <div className="product-page">
        <ProductBanner category={categoryData || category} />
        <div className="product-page-container">
          <SubcategoryFilter
            subcategories={subcategories}
            selectedSubcategory={selectedSubcategory}
            onSelectSubcategory={setSelectedSubcategory}
          />
          <FilterBar sortBy={sortBy} onSortChange={setSortBy} />
          {sortedVariants.length === 0 ? (
            <div className="empty-state">
              <p>Không có sản phẩm nào</p>
            </div>
          ) : (
            <div className="products-grid">
              {sortedVariants.map((variant) => (
                <ProductCard key={variant.id} product={variant} isVariant={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default ProductPage;