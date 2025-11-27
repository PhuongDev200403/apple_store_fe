import { Link } from 'react-router-dom';
import { createProductUrl } from '../utils/slugHelper';

/**
 * Component để tạo link đến trang chi tiết sản phẩm với URL slug
 * 
 * @example
 * <ProductLink product={product}>
 *   Xem chi tiết
 * </ProductLink>
 */
export default function ProductLink({ product, children, className, ...props }) {
  if (!product || !product.id) {
    console.warn('ProductLink: product or product.id is missing');
    return <span className={className}>{children}</span>;
  }

  const url = createProductUrl(
    product.name || 'san-pham',
    product.categoryName || product.category || 'san-pham',
    product.id
  );

  return (
    <Link to={url} className={className} {...props}>
      {children}
    </Link>
  );
}
