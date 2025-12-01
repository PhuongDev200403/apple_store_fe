import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";
import UsersSection from "./userSection/UsersSection";
import CategoriesSection from "./categorySection/CategoriesSection";
import CategoryChildSection from "./categoryChildSection/CategoryChildSection";
import ProductsSection from "./productSection/ProductsSection";
import SubCategoriesSection from "./subCategoriesSection/SubCategoriesSection";
import VariantsSection from "./variantsSection/VariantsSection";
import ReportsSection from "./reportsSection/ReportsSection";
import OrdersSection from "./ordersSection/OrdersSection";
import WishlistSection from "./wishlistSection/WishlistSection";
import CartSection from "./cartSection/CartSection";
import NewsSection from "./newsSection/NewsSection";

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("users");
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      navigate("/dang-nhap");
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "users":
        return <UsersSection />;
      case "categories":
        return <CategoriesSection />;
      case "subcategories":
        return <CategoryChildSection />;
      case "products":
        return <ProductsSection />;
      case "variants":
        return <VariantsSection />;
      case "orders":
        return <OrdersSection />;
      case "wishlist":
        return <WishlistSection />;
      case "cart":
        return <CartSection />;
      case "news":
        return <NewsSection />;
      case "reports":
        return <ReportsSection />;
      default:
        return <div>Chọn một mục từ menu để hiển thị nội dung.</div>;
    }
  };

  return (
    <div className="admin-page">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">🎛️ Admin Panel</h2>
          <div className="admin-info">
            <span className="admin-name">👤 {localStorage.getItem("username") || "Admin"}</span>
          </div>
        </div>
        <nav>
          <button 
            onClick={() => setActiveSection("users")}
            className={activeSection === "users" ? "active" : ""}
          >
            👤 Quản lý người dùng
          </button>
          <button 
            onClick={() => setActiveSection("categories")}
            className={activeSection === "categories" ? "active" : ""}
          >
            📂 Quản lý danh mục
          </button>
          <button 
            onClick={() => setActiveSection("subcategories")}
            className={activeSection === "subcategories" ? "active" : ""}
          >
            📁 Quản lý danh mục con
          </button>
          <button 
            onClick={() => setActiveSection("products")}
            className={activeSection === "products" ? "active" : ""}
          >
            🛒 Quản lý sản phẩm
          </button>
          <button 
            onClick={() => setActiveSection("variants")}
            className={activeSection === "variants" ? "active" : ""}
          >
            🎨 Quản lý biến thể
          </button>
          <button 
            onClick={() => setActiveSection("orders")}
            className={activeSection === "orders" ? "active" : ""}
          >
            📦 Quản lý đơn hàng
          </button>
          <button 
            onClick={() => setActiveSection("news")}
            className={activeSection === "news" ? "active" : ""}
          >
            📰 Quản lý tin tức
          </button>
          <button 
            onClick={() => setActiveSection("wishlist")}
            className={activeSection === "wishlist" ? "active" : ""}
          >
            ❤️ Danh sách yêu thích
          </button>
          <button 
            onClick={() => setActiveSection("cart")}
            className={activeSection === "cart" ? "active" : ""}
          >
            🛍️ Giỏ hàng
          </button>
          <button 
            onClick={() => setActiveSection("reports")}
            className={activeSection === "reports" ? "active" : ""}
          >
            📊 Báo cáo thống kê
          </button>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      <section className="content">
        {renderSection()}
      </section>
    </div>
  );
}