# Product Detail Page

## Cấu trúc dữ liệu API cần trả về

### GET /api/products/{id}

API cần trả về dữ liệu sản phẩm với cấu trúc như sau:

```json
{
  "code": 0,
  "result": {
    "id": 1,
    "name": "iPhone 14 Pro Max",
    "description": "Mô tả chi tiết về sản phẩm...",
    "variants": [
      {
        "id": 101,
        "color": "Đen",
        "storage": "128GB",
        "price": 29990000,
        "originalPrice": 34990000,
        "stock": 50,
        "images": [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg"
        ],
        "specifications": {
          "Màn hình": "6.7 inch, Super Retina XDR",
          "Chip": "Apple A16 Bionic",
          "Camera": "48MP + 12MP + 12MP",
          "Pin": "4323 mAh",
          "RAM": "6GB",
          "Hệ điều hành": "iOS 16"
        }
      },
      {
        "id": 102,
        "color": "Tím",
        "storage": "256GB",
        "price": 32990000,
        "originalPrice": 37990000,
        "stock": 30,
        "images": [
          "https://example.com/image3.jpg",
          "https://example.com/image4.jpg"
        ],
        "specifications": {
          "Màn hình": "6.7 inch, Super Retina XDR",
          "Chip": "Apple A16 Bionic",
          "Camera": "48MP + 12MP + 12MP",
          "Pin": "4323 mAh",
          "RAM": "6GB",
          "Hệ điều hành": "iOS 16"
        }
      }
    ]
  }
}
```

## Tính năng

1. **Hiển thị ảnh chính**: Ảnh đầu tiên của variant được chọn sẽ hiển thị to
2. **Chọn biến thể**: Click vào thumbnail để chọn màu/dung lượng khác
3. **Thêm vào giỏ hàng**: Gọi API POST /api/carts với body:
   ```json
   {
     "productVariantId": 101,
     "quantity": 2
   }
   ```
4. **Thêm vào yêu thích**: Chức năng đang chờ API
5. **Responsive**: Tối ưu cho mobile, tablet, desktop
6. **Thông số kỹ thuật**: Hiển thị dạng bảng từ specifications object

## Cách sử dụng

### Với URL Slug (Khuyến nghị)

```jsx
import { useNavigate } from 'react-router-dom';
import { createProductUrl } from '../../utils/slugHelper';

// Navigate với SEO-friendly URL
const url = createProductUrl(
  product.name,         // "iPhone 14 Pro Max"
  product.categoryName, // "iPhone"
  product.id            // 123
);
navigate(url);
// Kết quả: /san-pham/iphone/iphone-14-pro-max-123
```

### Hoặc sử dụng ProductLink component

```jsx
import ProductLink from '../../components/ProductLink';

<ProductLink product={product}>
  Xem chi tiết
</ProductLink>
```
