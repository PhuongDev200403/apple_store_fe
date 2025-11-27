# Hướng dẫn sử dụng URL Slug

## Tổng quan

Thay vì URL dạng số như `/san-pham/1/5`, giờ bạn có URL thân thiện SEO như:
- `/san-pham/iphone/iphone-14-pro-max-123`
- `/san-pham/macbook/macbook-air-m2-456`
- `/san-pham/laptop/dell-xps-15-789`

## Cách sử dụng

### 1. Trong ProductCard hoặc component khác

```jsx
import { useNavigate } from 'react-router-dom';
import { createProductUrl } from '../../utils/slugHelper';

function ProductCard({ product }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // Tạo URL với slug
    const url = createProductUrl(
      product.name,           // Tên sản phẩm: "iPhone 14 Pro Max"
      product.categoryName,   // Tên danh mục: "iPhone"
      product.id              // ID: 123
    );
    // Kết quả: "/san-pham/iphone/iphone-14-pro-max-123"
    navigate(url);
  };
  
  return <div onClick={handleClick}>...</div>;
}
```

### 2. Trong Link component

```jsx
import { Link } from 'react-router-dom';
import { createProductUrl } from '../../utils/slugHelper';

function ProductList({ products }) {
  return (
    <div>
      {products.map(product => (
        <Link 
          key={product.id}
          to={createProductUrl(product.name, product.categoryName, product.id)}
        >
          {product.name}
        </Link>
      ))}
    </div>
  );
}
```

### 3. Tạo URL cho danh mục

```jsx
import { createCategoryUrl } from '../../utils/slugHelper';

const categoryUrl = createCategoryUrl('iPhone');
// Kết quả: "/san-pham/iphone"
```

## Cấu trúc dữ liệu cần có

Để slug hoạt động tốt, object `product` cần có:

```javascript
{
  id: 123,                    // ID sản phẩm (bắt buộc)
  name: "iPhone 14 Pro Max",  // Tên sản phẩm (bắt buộc)
  categoryName: "iPhone",     // Tên danh mục (khuyến nghị)
  // hoặc
  category: "iPhone"          // Fallback nếu không có categoryName
}
```

## Routes đã được cấu hình

```jsx
// AppRoutes.jsx
{ path: 'san-pham/:category/:productId', element: <ProductDetailPage /> }
```

- `:category` - slug của danh mục (vd: "iphone", "macbook")
- `:productId` - slug của sản phẩm kèm ID (vd: "iphone-14-pro-max-123")

## Ví dụ URL

| Sản phẩm | URL cũ | URL mới (SEO-friendly) |
|----------|--------|------------------------|
| iPhone 14 Pro Max (ID: 123) | `/san-pham/1/123` | `/san-pham/iphone/iphone-14-pro-max-123` |
| MacBook Air M2 (ID: 456) | `/san-pham/2/456` | `/san-pham/macbook/macbook-air-m2-456` |
| Dell XPS 15 (ID: 789) | `/san-pham/3/789` | `/san-pham/laptop/dell-xps-15-789` |

## Lợi ích

1. **SEO tốt hơn**: Google ưu tiên URL có từ khóa
2. **User-friendly**: Người dùng biết họ đang xem gì
3. **Dễ share**: URL dễ đọc và nhớ hơn
4. **Professional**: Trông chuyên nghiệp hơn

## Lưu ý

- ID vẫn được giữ ở cuối slug để đảm bảo tính duy nhất
- Hệ thống tự động chuyển tiếng Việt có dấu thành không dấu
- Khoảng trắng được thay bằng dấu gạch ngang (-)
- Ký tự đặc biệt được loại bỏ
