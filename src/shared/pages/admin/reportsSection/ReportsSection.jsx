import React, { useEffect, useMemo, useState } from "react";
import { getAllProducts } from "../../../utils/api/productApi";
import { getAllVariants } from "../../../utils/api/variantApi";
import "./ReportsSection.css";

function BarChart({ title, data, color = "#3b82f6" }) {
  // data: [{ label, value }]
  const max = useMemo(() => Math.max(1, ...data.map(d => d.value || 0)), [data]);
  return (
    <div className="card">
      <h4 className="card-title">{title}</h4>
      <div className="chart-wrap">
        {data.length === 0 ? (
          <div className="empty">Không có dữ liệu</div>
        ) : (
          data.map((d, i) => (
            <div className="bar-row" key={i}>
              <div className="bar-label" title={d.label}>{d.label}</div>
              <div className="bar-track">
                <div className="bar" style={{ width: `${(d.value / max) * 100}%`, background: color }} />
              </div>
              <div className="bar-value">{d.value}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function LineChart({ title, data, color = "#ef4444" }) {
  // Simple sparkline-like chart using SVG
  const width = 520;
  const height = 180;
  const padding = 24;
  const values = data.map(d => d.value || 0);
  const max = Math.max(1, ...values);
  const min = Math.min(0, ...values);
  const stepX = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;
  const points = values.map((v, i) => {
    const x = padding + i * stepX;
    const y = padding + (1 - (v - min) / (max - min || 1)) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");
  return (
    <div className="card">
      <h4 className="card-title">{title}</h4>
      {data.length === 0 ? (
        <div className="empty">Không có dữ liệu</div>
      ) : (
        <div className="svg-wrap">
          <svg viewBox={`0 0 ${width} ${height}`} className="line-chart">
            <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
            {values.map((v, i) => {
              const x = padding + i * stepX;
              const y = padding + (1 - (v - min) / (max - min || 1)) * (height - padding * 2);
              return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
            })}
          </svg>
          <div className="x-labels">
            {data.map((d, i) => (
              <span key={i} title={d.label} style={{ left: `${(i/(Math.max(1,data.length-1)))*100}%` }}>{d.label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PieChart({ title, data, colors = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"] }) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1;
  let cumulative = 0;
  const radius = 70;
  const cx = 90, cy = 90;
  const arcs = data.map((d, i) => {
    const val = d.value || 0;
    const startAngle = (cumulative / total) * 2 * Math.PI;
    const endAngle = ((cumulative + val) / total) * 2 * Math.PI;
    cumulative += val;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return { path, color: colors[i % colors.length], label: d.label, value: d.value };
  });
  return (
    <div className="card">
      <h4 className="card-title">{title}</h4>
      {data.length === 0 ? (
        <div className="empty">Không có dữ liệu</div>
      ) : (
        <div className="pie-wrap">
          <svg viewBox="0 0 180 180" className="pie-chart">
            {arcs.map((a, i) => (
              <path key={i} d={a.path} fill={a.color} />
            ))}
          </svg>
          <div className="legend">
            {data.map((d, i) => (
              <div key={i} className="legend-item">
                <span className="dot" style={{ background: colors[i % colors.length] }} />
                <span className="name" title={d.label}>{d.label}</span>
                <span className="val">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReportsSection() {
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [prods, vars] = await Promise.all([getAllProducts(), getAllVariants()]);
        if (!mounted) return;
        setProducts(Array.isArray(prods) ? prods : []);
        setVariants(Array.isArray(vars) ? vars : []);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const variantsPerProduct = useMemo(() => {
    const map = new Map();
    for (const v of variants) {
      const pid = v.productId;
      map.set(pid, (map.get(pid) || 0) + 1);
    }
    const rows = products.map(p => ({ label: p.name, value: map.get(p.id) || 0 }));
    return rows.sort((a,b) => b.value - a.value).slice(0, 8);
  }, [products, variants]);

  const inventoryPerProduct = useMemo(() => {
    const map = new Map();
    for (const v of variants) {
      const pid = v.productId;
      map.set(pid, (map.get(pid) || 0) + (Number(v.quantity) || 0));
    }
    const rows = products.map(p => ({ label: p.name, value: map.get(p.id) || 0 }));
    return rows.sort((a,b) => b.value - a.value).slice(0, 8);
  }, [products, variants]);

  const priceBuckets = useMemo(() => {
    const buckets = [
      { label: "< 5tr", test: (x) => x < 5_000_000 },
      { label: "5-10tr", test: (x) => x >= 5_000_000 && x < 10_000_000 },
      { label: "10-20tr", test: (x) => x >= 10_000_000 && x < 20_000_000 },
      { label: ">= 20tr", test: (x) => x >= 20_000_000 },
    ];
    const counts = buckets.map(b => ({ label: b.label, value: 0 }));
    for (const v of variants) {
      const p = Number(v.price) || 0;
      const idx = buckets.findIndex(b => b.test(p));
      if (idx >= 0) counts[idx].value += 1;
    }
    return counts;
  }, [variants]);

  return (
    <div className="reports-section">
      <h3>Báo cáo tổng quan</h3>
      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid charts-3">
          <BarChart title="Số biến thể theo sản phẩm (Top 8)" data={variantsPerProduct} color="#2563eb" />
          <LineChart title="Tồn kho theo sản phẩm (Top 8)" data={inventoryPerProduct} color="#ef4444" />
          <PieChart title="Phân bố giá biến thể" data={priceBuckets} />
        </div>
      )}
    </div>
  );
}


