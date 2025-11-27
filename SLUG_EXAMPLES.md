# Ví dụ URL Slug trong dự án

## URL cũ vs URL mới

### Trước khi có slug:
```
http://localhost:5173/san-pham/1/5
http://localhost:5173/san-pham/2/10
http://localhost:5173/san-pham/3/15
```
❌ Không biết sản phẩm gì
❌ Không tốt cho SEO
❌ Khó nhớ và share

### Sau khi có slug:
```
http://localhost:5173/san-pham/iphone/iphone-14-pro-max-123
http://localhost:5173/san-pham/macbook/macbook-air-m2-456
http://localhost:5173/san-pham/laptop/dell-xps-15-789
```
✅ Rõ ràng về sản phẩm
✅ Tốt cho SEO
✅ Dễ nhớ và share

## Cách implement trong code

### 1. Trong ProductCard.jsx (Đã cập nhật)

```jsx
import { useNavigate } from 'react-router-dom';
import { createProductUrl } from '../../utils/slugHelper';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    const url = createProductUrl(
      product.name,           // "iPhone 14 Pro Max"
      product.categoryName,   // "iPhone"
      product.id              // 123
    );
    navigate(url);
  };
  
  return (
    <div className="product-card" onClick={handleCardClick}>
      {/* ... */}
    </div>
  );
};
```

### 2. Trong ProductDetail.jsx (Đã cập nhật)

```jsx
import { useParams } from 'react-router-dom';
import { extractIdFromSlug } from '../../utils/slugHelper';

export default function ProductDetail() {
  const { productId: productSlug } = useParams();
  
  // Extract ID từ slug: "iphone-14-pro-max-123" -> 123
  const productId = extractIdFromSlug(productSlug);
  
  // Fetch product với ID
  const productData = await getProductById(productId);
}
```

### 3. Sử dụng ProductLink component

```jsx
import ProductLink from '../components/ProductLink';

// Trong danh sách sản phẩm
{products.map(product => (
  <ProductLink key={product.id} product={product}>
    <img src={product.image} alt={product.name} />
    <h3>{product.name}</h3>
  </ProductLink>
))}
```

## Cấu trúc dữ liệu product cần có

```javascript
const product = {
  id: 123,                          // Bắt buộc
  name: "iPhone 14 Pro Max",        // Bắt buộc
  categoryName: "iPhone",           // Khuyến nghị (cho URL đẹp)
  // Hoặc
  category: "iPhone",               // Fallback
  
  // Các field khác...
  price: 29990000,
  image: "...",
  // ...
};
```

## Test thử

Bạn có thể test các function trong console:

```javascript
import { createSlug, createProductUrl, extractIdFromSlug } from './src/shared/utils/slugHelper';

// Test 1: Tạo slug từ text
createSlug("iPhone 14 Pro Max");
// Output: "iphone-14-pro-max"

// Test 2: Tạo URL sản phẩm
createProductUrl("iPhone 14 Pro Max", "iPhone", 123);
// Output: "/san-pham/iphone/iphone-14-pro-max-123"

// Test 3: Extract ID từ slug
extractIdFromSlug("iphone-14-pro-max-123");
// Output: 123
```

## Lưu ý quan trọng

1. **ID vẫn cần thiết**: Slug chỉ là phần hiển thị, ID vẫn được dùng để query database
2. **Unique constraint**: ID đảm bảo tính duy nhất, slug có thể trùng nhau
3. **Backward compatible**: Nếu cần, bạn vẫn có thể hỗ trợ URL cũ bằng cách thêm route:
   ```jsx
   { path: 'san-pham/:id', element: <ProductDetailPage /> }
   ```

## Checklist triển khai

- [x] Tạo `slugHelper.js` với các helper functions
- [x] Cập nhật `ProductCard.jsx` để tạo URL slug
- [x] Cập nhật `ProductDetail.jsx` để parse slug
- [x] Tạo `ProductLink` component để dễ sử dụng
- [x] Cập nhật routes trong `AppRoutes.jsx`
- [ ] Đảm bảo API trả về `categoryName` trong product object
- [ ] Test trên các trường hợp: tiếng Việt có dấu, ký tự đặc biệt, số
- [ ] Update tất cả nơi navigate đến product detail

## Kết quả

Giờ khi user click vào sản phẩm, URL sẽ là:
```
http://localhost:5173/san-pham/iphone/iphone-14-pro-max-123
```

Thay vì:
```
http://localhost:5173/san-pham/1/5
```

Đẹp và chuyên nghiệp hơn nhiều! 🎉
