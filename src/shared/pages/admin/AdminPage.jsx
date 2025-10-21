import React, { useState } from "react";
import "./AdminPage.css";
import UsersSection from "./userSection/UsersSection";
import CategoriesSection from "./categorySection/CategoriesSection";
import CategoryChildSection from "./categoryChildSection/CategoryChildSection";

const ProductsSection = () => (
  <div>
    <h3>🛒 Quản lý sản phẩm</h3>
    <p>Chức năng quản lý sản phẩm sẽ được phát triển tại đây.</p>
  </div>
);

const VariantsSection = () => (
  <div>
    <h3>🎨 Quản lý biến thể sản phẩm</h3>
    <p>Chức năng quản lý biến thể sản phẩm sẽ được phát triển tại đây.</p>
  </div>
);

const OrdersSection = () => (
  <div>
    <h3>📦 Quản lý đơn hàng</h3>
    <p>Chức năng quản lý đơn hàng sẽ được phát triển tại đây.</p>
  </div>
);

const WishlistSection = () => (
  <div>
    <h3>❤️ Quản lý danh sách yêu thích</h3>
    <p>Chức năng quản lý danh sách yêu thích sẽ được phát triển tại đây.</p>
  </div>
);

const CartSection = () => (
  <div>
    <h3>🛍️ Quản lý giỏ hàng</h3>
    <p>Chức năng quản lý giỏ hàng sẽ được phát triển tại đây.</p>
  </div>
);

const ReportsSection = () => (
  <div>
    <h3>📊 Báo cáo thống kê</h3>
    <p>Báo cáo doanh thu, sản phẩm bán chạy, khách hàng, ... sẽ hiển thị tại đây.</p>
  </div>
);

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("users");

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
      case "reports":
        return <ReportsSection />;
      default:
        return <div>Chọn một mục từ menu để hiển thị nội dung.</div>;
    }
  };

  return (
    <div className="admin-page">
      <aside className="sidebar">
        <h2 className="sidebar-title">Trang Admin</h2>
        <nav>
          <button onClick={() => setActiveSection("users")}>👤 Quản lý người dùng</button>
          <button onClick={() => setActiveSection("categories")}>📂 Quản lý danh mục</button>
          <button onClick={() => setActiveSection("subcategories")}>📁 Quản lý danh mục con</button>
          <button onClick={() => setActiveSection("products")}>🛒 Quản lý sản phẩm</button>
          <button onClick={() => setActiveSection("variants")}>🎨 Quản lý biến thể sản phẩm</button>
          <button onClick={() => setActiveSection("orders")}>📦 Quản lý đơn hàng</button>
          <button onClick={() => setActiveSection("wishlist")}>❤️ Quản lý danh sách yêu thích</button>
          <button onClick={() => setActiveSection("cart")}>🛍️ Quản lý giỏ hàng</button>
          <button onClick={() => setActiveSection("reports")}>📊 Báo cáo thống kê</button>
        </nav>
      </aside>

      <section className="content">
        {renderSection()}
      </section>
    </div>
  );
}