import "./SubcategoryFilter.css";
const SubcategoryFilter = ({ subcategories, selectedSubcategory, onSelectSubcategory }) => {
    return (
      <div className="subcategory-filter">
        <button
          className={`subcategory-btn ${selectedSubcategory === "all" ? "active" : ""}`}
          onClick={() => onSelectSubcategory("all")}
        >
          Tất cả
        </button>
        {subcategories.map((sub) => (
          <button
            key={sub.id}
            className={`subcategory-btn ${selectedSubcategory === sub.id ? "active" : ""}`}
            onClick={() => onSelectSubcategory(sub.id)}
          >
            <div className="subcategory-icon">
              <img src="/generic-product-icon.png" alt={sub.label} />
            </div>
            <span>{sub.label}</span>
          </button>
        ))}
      </div>
    )
  }
  
  export default SubcategoryFilter