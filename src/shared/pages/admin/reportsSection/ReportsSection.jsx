import React, { useEffect, useMemo, useState } from "react";
import { getAllProducts } from "../../../utils/api/productApi";
import { getAllVariants } from "../../../utils/api/variantApi";
import { getAllOrders } from "../../../utils/api/ordersApi";
import "./ReportsSection.css";

export default function ReportsSection() {
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [prods, vars, ordsRes] = await Promise.all([
          getAllProducts(),
          getAllVariants(),
          getAllOrders().catch(() => ({ data: [] }))
        ]);
        if (!mounted) return;
        setProducts(Array.isArray(prods) ? prods : []);
        setVariants(Array.isArray(vars) ? vars : []);
        // Normalize orders response
        const ords = Array.isArray(ordsRes) 
          ? ordsRes 
          : ordsRes?.data?.data || ordsRes?.data?.result || ordsRes?.data || [];
        setOrders(Array.isArray(ords) ? ords : []);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // Statistics
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalVariants = variants.length;
    const totalStock = variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
    const totalValue = variants.reduce((sum, v) => sum + (Number(v.price) || 0) * (Number(v.quantity) || 0), 0);
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    
    return [
      { label: "Tổng sản phẩm", value: totalProducts, icon: "📦", color: "#2563eb" },
      { label: "Tổng biến thể", value: totalVariants, icon: "🎨", color: "#10b981" },
      { label: "Tồn kho", value: totalStock, icon: "📊", color: "#f59e0b" },
      { label: "Giá trị kho", value: `${(totalValue / 1_000_000).toFixed(1)}M`, icon: "💰", color: "#8b5cf6" },
      { label: "Đơn hàng", value: totalOrders, icon: "🛒", color: "#ef4444" },
      { label: "Doanh thu", value: `${(totalRevenue / 1_000_000).toFixed(1)}M`, icon: "💵", color: "#06b6d4" },
    ];
  }, [products, variants, orders]);

  // Top products by variants
  const topProductsByVariants = useMemo(() => {
    const map = new Map();
    for (const v of variants) {
      const pid = v.productId;
      map.set(pid, (map.get(pid) || 0) + 1);
    }
    const rows = products.map(p => ({ label: p.name, value: map.get(p.id) || 0 }));
    return rows.sort((a,b) => b.value - a.value).slice(0, 5);
  }, [products, variants]);

  // Stock by product
  const stockByProduct = useMemo(() => {
    const map = new Map();
    for (const v of variants) {
      const pid = v.productId;
      map.set(pid, (map.get(pid) || 0) + (Number(v.quantity) || 0));
    }
    const rows = products.map(p => ({ label: p.name, value: map.get(p.id) || 0 }));
    return rows.sort((a,b) => b.value - a.value).slice(0, 5);
  }, [products, variants]);

  // Price distribution
  const priceDistribution = useMemo(() => {
    const buckets = [
      { label: "< 10M", min: 0, max: 10_000_000, color: "#10b981" },
      { label: "10-20M", min: 10_000_000, max: 20_000_000, color: "#f59e0b" },
      { label: "20-30M", min: 20_000_000, max: 30_000_000, color: "#ef4444" },
      { label: "> 30M", min: 30_000_000, max: Infinity, color: "#8b5cf6" },
    ];
    const counts = buckets.map(b => ({ ...b, value: 0 }));
    for (const v of variants) {
      const p = Number(v.price) || 0;
      const idx = buckets.findIndex(b => p >= b.min && p < b.max);
      if (idx >= 0) counts[idx].value += 1;
    }
    return counts;
  }, [variants]);

  // Order status distribution
  const orderStatusDistribution = useMemo(() => {
    const statusMap = {
      PENDING: { label: "Chờ xử lý", color: "#f59e0b" },
      PROCESSING: { label: "Đang xử lý", color: "#2563eb" },
      SHIPPED: { label: "Đã giao", color: "#8b5cf6" },
      COMPLETED: { label: "Hoàn thành", color: "#10b981" },
      CANCELLED: { label: "Đã hủy", color: "#ef4444" },
    };
    const counts = {};
    for (const o of orders) {
      counts[o.status] = (counts[o.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, value]) => ({
      label: statusMap[status]?.label || status,
      value,
      color: statusMap[status]?.color || "#6b7280"
    }));
  }, [orders]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  if (loading) {
    return (
      <div className="reports-section">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-section">
      <div className="reports-header">
        <h2 className="reports-title">📊 Báo cáo & Thống kê</h2>
        <p className="reports-subtitle">Tổng quan hoạt động kinh doanh</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card" style={{ '--card-color': stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Top Products by Variants */}
        <div className="chart-card">
          <h3 className="chart-title">🎨 Top sản phẩm theo biến thể</h3>
          <div className="bar-chart">
            {topProductsByVariants.map((item, i) => {
              const max = Math.max(...topProductsByVariants.map(x => x.value), 1);
              const percent = (item.value / max) * 100;
              return (
                <div key={i} className="bar-item">
                  <div className="bar-label">{item.label}</div>
                  <div className="bar-container">
                    <div className="bar-fill" style={{ width: `${percent}%` }}>
                      <span className="bar-value">{item.value}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stock by Product */}
        <div className="chart-card">
          <h3 className="chart-title">📦 Tồn kho theo sản phẩm</h3>
          <div className="bar-chart bar-chart-green">
            {stockByProduct.map((item, i) => {
              const max = Math.max(...stockByProduct.map(x => x.value), 1);
              const percent = (item.value / max) * 100;
              return (
                <div key={i} className="bar-item">
                  <div className="bar-label">{item.label}</div>
                  <div className="bar-container">
                    <div className="bar-fill" style={{ width: `${percent}%` }}>
                      <span className="bar-value">{formatNumber(item.value)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Distribution */}
        <div className="chart-card">
          <h3 className="chart-title">💰 Phân bố giá sản phẩm</h3>
          <div className="pie-chart">
            {priceDistribution.map((item, i) => (
              <div key={i} className="pie-item">
                <div className="pie-bar" style={{ 
                  width: `${(item.value / Math.max(...priceDistribution.map(x => x.value), 1)) * 100}%`,
                  background: item.color
                }}>
                  <span className="pie-value">{item.value}</span>
                </div>
                <div className="pie-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status */}
        {orderStatusDistribution.length > 0 && (
          <div className="chart-card">
            <h3 className="chart-title">🛒 Trạng thái đơn hàng</h3>
            <div className="donut-chart">
              {orderStatusDistribution.map((item, i) => (
                <div key={i} className="donut-item">
                  <div className="donut-dot" style={{ background: item.color }}></div>
                  <div className="donut-label">{item.label}</div>
                  <div className="donut-value">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
