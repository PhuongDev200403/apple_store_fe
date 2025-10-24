import { Link, useLocation, useMatches } from 'react-router-dom';
import './breadcrumbs.css';

const VIET_LABELS = {
  '': 'Trang chủ',
  'gioi-thieu': 'Giới thiệu',
  'dang-nhap': 'Đăng nhập',
  'dang-ky': 'Đăng ký',
  'gio-hang': 'Giỏ hàng',
  'tin-tuc': 'Tin tức',
  'chinh-sach': 'Chính sách',
  'lien-he': 'Liên hệ',
  'danh-muc': 'Danh mục',
  'admin': 'Admin',
  'wishlist': 'Wishlist',
};

function humanize(segment) {
  if (VIET_LABELS[segment] ) return VIET_LABELS[segment];
  const decoded = decodeURIComponent(segment).replace(/-/g, ' ');
  return decoded
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function useCrumbs() {
  const location = useLocation();
  const matches = useMatches();

  const parts = location.pathname.split('/').filter(Boolean);
  const crumbs = [];
  let href = '';
  for (const part of parts) {
    href += `/${part}`;
    crumbs.push({ name: humanize(part), href });
  }
  return crumbs;
}

export default function Breadcrumbs() {
  const crumbs = useCrumbs();
  return (
    <div className="breadcrumbs">
      <div className="container">
        <Link to="/">{VIET_LABELS['']}</Link>
        {crumbs.map((c, idx) => (
          <span key={idx}>
            <span className="sep">›</span>
            {idx === crumbs.length - 1 ? (
              <span className="current">{c.name}</span>
            ) : (
              <Link to={c.href}>{c.name}</Link>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

