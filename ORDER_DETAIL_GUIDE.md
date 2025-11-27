# Hướng dẫn Trang Chi tiết Đơn hàng

## ✅ Đã hoàn thành

### 1. **Trang Chi tiết Đơn hàng** (`/don-hang/:orderId`)
- ✅ Hiển thị trạng thái đơn hàng với icon và màu sắc
- ✅ Thông tin người nhận đầy đủ
- ✅ Danh sách sản phẩm trong đơn
- ✅ Tóm tắt giá tiền
- ✅ Chức năng hủy đơn hàng
- ✅ Loading và error states
- ✅ Responsive design

### 2. **API Integration**
- ✅ `getOrderById(orderId)` - Lấy chi tiết đơn
- ✅ `cancelOrder(orderId)` - Hủy đơn hàng

### 3. **Routes**
- ✅ `/don-hang/:orderId` - Chi tiết đơn hàng
- ✅ Protected route (cần đăng nhập)

### 4. **Navigation**
- ✅ OrdersPage có link "Xem chi tiết"
- ✅ Click → Navigate đến `/don-hang/{orderId}`
- ✅ Nút "Quay lại" về danh sách

## 📋 API Endpoint

### Get Order Detail:
```
GET /api/orders/{id}
```

### Response:
```json
{
  "code": 0,
  "result": {
    "username": "Vũ Thị Lâm Oanh",
    "email": "vtlo@gmail.com",
    "phone": "0323771922",
    "orderId": 12,
    "orderDate": "2025-11-17T11:05:05.786436",
    "status": "PENDING",
    "totalAmount": 30000000.00,
    "shippingAddress": "Nhà số 12 hẻm 129/29/3...",
    "shippingMethod": "COD",
    "note": "Không được hoàn trả hàng...",
    "items": [
      {
        "productVariantId": 5,
        "productName": "Iphone 15 Pro Max",
        "quantity": 1,
        "price": 30000000.00,
        "imageUrl": "https://...",
        "color": "Đen",
        "storage": "128GB"
      }
    ]
  }
}
```

## 🎨 UI Layout

```
┌─────────────────────────────────────────────┐
│  ← Quay lại                                 │
│  Chi tiết đơn hàng #12                      │
├──────────────────────┬──────────────────────┤
│  MAIN CONTENT        │  SIDEBAR             │
│                      │                      │
│  ┌─────────────────┐│  ┌─────────────────┐ │
│  │ 🕐 Chờ xử lý    ││  │ Tóm tắt đơn     │ │
│  │ Đơn hàng đang...││  │ Tạm tính: 30M   │ │
│  │ Đặt lúc: ...    ││  │ Ship: Miễn phí  │ │
│  └─────────────────┘│  │ Tổng: 30M       │ │
│                      │  └─────────────────┘ │
│  ┌─────────────────┐│                      │
│  │ Thông tin       ││  [Hủy đơn hàng]     │
│  │ 👤 Họ tên       ││  [Xem tất cả]       │
│  │ 📞 SĐT          ││                      │
│  │ 📍 Địa chỉ      ││                      │
│  │ 💵 Thanh toán   ││                      │
│  │ 📝 Ghi chú      ││                      │
│  └─────────────────┘│                      │
│                      │                      │
│  ┌─────────────────┐│                      │
│  │ Sản phẩm        ││                      │
│  │ [Product 1]     ││                      │
│  │ [Product 2]     ││                      │
│  └─────────────────┘│                      │
└──────────────────────┴──────────────────────┘
```

## 🎯 Features

### 1. **Status Card**
- Icon lớn với màu sắc theo trạng thái
- Label và description
- Ngày giờ đặt hàng
- Border màu bên trái

### 2. **Customer Info**
- Grid layout 2 cột
- Icons đẹp cho mỗi field
- Thông tin đầy đủ:
  - Họ tên
  - Số điện thoại
  - Địa chỉ giao hàng
  - Phương thức thanh toán
  - Ghi chú (nếu có)

### 3. **Order Items**
- Danh sách sản phẩm
- Ảnh sản phẩm với quantity badge
- Tên, variant, giá
- Thành tiền từng item
- Hover effect

### 4. **Order Summary**
- Tạm tính
- Phí vận chuyển (Miễn phí)
- Tổng cộng (nổi bật)
- Sticky sidebar

### 5. **Actions**
- Nút "Hủy đơn hàng" (chỉ hiện với PENDING, PROCESSING)
- Confirm trước khi hủy
- Loading state khi hủy
- Nút "Xem tất cả đơn hàng"

## 🔄 Flow hoạt động

### 1. Từ OrdersPage:
```
[Danh sách đơn] → Click "Xem chi tiết"
  ↓
Navigate to /don-hang/{orderId}
```

### 2. Load chi tiết:
```
GET /api/orders/{orderId}
  ↓
Display order detail
```

### 3. Hủy đơn hàng:
```
Click "Hủy đơn hàng"
  ↓
Confirm dialog
  ↓
PUT /api/orders/{orderId}/cancel
  ↓
Reload order detail
```

## 🎨 Status Colors

| Status | Color | Icon | Can Cancel |
|--------|-------|------|------------|
| PENDING | Orange (#f59e0b) | 🕐 | ✅ Yes |
| PROCESSING | Blue (#3b82f6) | 📦 | ✅ Yes |
| SHIPPING | Purple (#8b5cf6) | 🚚 | ❌ No |
| COMPLETED | Green (#10b981) | ✅ | ❌ No |
| CANCELLED | Red (#ef4444) | ❌ | ❌ No |

## 💡 Business Logic

### Cancel Order Rules:
```javascript
const canCancelOrder = (status) => {
  return status === 'PENDING' || status === 'PROCESSING';
};
```

- ✅ PENDING: Có thể hủy
- ✅ PROCESSING: Có thể hủy
- ❌ SHIPPING: Không thể hủy (đang giao)
- ❌ COMPLETED: Không thể hủy (đã hoàn thành)
- ❌ CANCELLED: Không thể hủy (đã hủy rồi)

## 🎭 States

### Loading State:
- Spinner animation
- Text "Đang tải thông tin đơn hàng..."

### Error State:
- Icon 😕
- Message lỗi
- Nút "Quay lại danh sách đơn hàng"

### Success State:
- Hiển thị đầy đủ thông tin
- Actions buttons
- Smooth animations

## 📱 Responsive

### Desktop (> 1024px)
- Grid: 2fr 1fr (main + sidebar)
- Sticky sidebar
- Full spacing

### Tablet (768px - 1024px)
- Grid: 1 column
- Static sidebar
- Medium spacing

### Mobile (< 768px)
- Stack layout
- Info grid: 1 column
- Order items: column layout
- Reduced padding

## 🚀 Usage

### Navigate từ OrdersPage:
```javascript
<Link to={`/don-hang/${order.orderId}`}>
  Xem chi tiết
</Link>
```

### Direct URL:
```
http://localhost:5173/don-hang/12
```

### Cancel Order:
```javascript
const handleCancelOrder = async () => {
  if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
    return;
  }
  
  await cancelOrder(orderId);
  alert('Đã hủy đơn hàng thành công');
  fetchOrderDetail(); // Reload
};
```

## 🎉 Kết quả

Giờ bạn có:
1. ✅ Trang chi tiết đơn hàng đẹp và chuyên nghiệp
2. ✅ Hiển thị đầy đủ thông tin
3. ✅ Status với màu sắc và icons
4. ✅ Danh sách sản phẩm chi tiết
5. ✅ Chức năng hủy đơn hàng
6. ✅ Loading và error states
7. ✅ Responsive hoàn hảo
8. ✅ Navigation mượt mà
9. ✅ Animations đẹp
10. ✅ UX tốt với confirm dialogs

Trang chi tiết đơn hàng đã hoàn thiện! 🛍️✨
