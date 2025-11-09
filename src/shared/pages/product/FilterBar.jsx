import "./FilterBar.css";
const FilterBar = ({ sortBy, onSortChange }) => {
    return (
      <div className="filter-bar">
        <div className="filter-left">
          <button className="filter-btn">
            <span>🔽</span> Bộ lọc
          </button>
          <button className="sort-btn">
            <span>⇅</span> Xếp theo
          </button>
        </div>
  
        <div className="filter-right">
          <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className="sort-select">
            <option value="default">Mặc định</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao xuống thấp</option>
          </select>
        </div>
      </div>
    )
  }
  
  export default FilterBar
  