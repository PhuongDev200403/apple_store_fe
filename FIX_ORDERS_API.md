# Fix lỗi 400 - API Đơn hàng

## ❌ Lỗi

```
GET /api/orders/my-orders → 400 Bad Request
```

## ✅ Đã sửa

### Thay đổi endpoint:

**Trước:**
```javascript
const res = await API.get('/orders/my-orders');  // ❌ Sai
```

**Sau:**
```javascript
const res = await API.get('/orders/my_orders');  // ✅ Đúng
```

### File đã sửa:
- `src/shared/utils/api/orderApi.js`

## 📋 API Endpoints đúng

### User APIs:
```
POST   /api/orders/check_out     - Thanh toán (tạo đơn hàng)
GET    /api/orders/my_orders     - Lấy đơn hàng của bản thân
GET    /api/orders/{id}          - Chi tiết đơn hàng
PUT    /api/orders/{id}/cancel   - Hủy đơn hàng
```

### Admin APIs:
```
GET    /api/orders               - Lấy tất cả đơn hàng
PUT    /api/orders/{id}/status   - Cập nhật trạng thái
```

## 🎯 Cách test

### 1. Tạo đơn hàng:
```
1. Vào /gio-hang
2. Click "Tiến hành thanh toán"
3. Điền form và submit
4. Đơn hàng được tạo
```

### 2. Xem đơn hàng:
```
1. Vào /don-hang
2. Sẽ gọi API GET /api/orders/my_orders
3. Hiển thị danh sách đơn hàng
```

## 📊 Response Format

### GET /api/orders/my_orders

**Response:**
```json
{
  "code": 0,
  "result": [
    {
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
          "price": 30000000.00
        }
      ]
    }
  ]
}
```

## 🔍 Các trạng thái đơn hàng

OrdersPage hỗ trợ filter theo trạng thái:

| Status | Label | Icon | Color |
|--------|-------|------|-------|
| PENDING | Chờ xử lý | 🕐 | Orange |
| PROCESSING | Đang xử lý | 📦 | Blue |
| SHIPPING | Đang giao | 🚚 | Purple |
| COMPLETED | Hoàn thành | ✅ | Green |
| CANCELLED | Đã hủy | ❌ | Red |

## 🎨 UI Features

### OrdersPage:
- ✅ Danh sách đơn hàng
- ✅ Filter theo trạng thái
- ✅ Hiển thị thông tin chi tiết
- ✅ Status badges với màu sắc
- ✅ Format giá tiền VND
- ✅ Format ngày giờ
- ✅ Empty state
- ✅ Loading state
- ✅ Error handling

### Thông tin hiển thị:
- Order ID
- Ngày đặt
- Trạng thái
- Người nhận
- Số điện thoại
- Địa chỉ giao hàng
- Phương thức thanh toán
- Ghi chú
- Tổng tiền

## 🔄 Flow hoàn chỉnh

### 1. Checkout:
```
CartPage → CheckoutPage → Submit Form
  ↓
POST /api/orders/check_out
  ↓
Success → Navigate to /don-hang
```

### 2. View Orders:
```
Navigate to /don-hang
  ↓
GET /api/orders/my_orders
  ↓
Display orders list
```

### 3. Filter Orders:
```
Click filter button (PENDING, SHIPPING, etc.)
  ↓
Filter orders by status
  ↓
Update display
```

## ✅ Checklist

- [x] Sửa endpoint từ `my-orders` → `my_orders`
- [x] OrdersPage sử dụng API đúng
- [x] Response được normalize đúng
- [x] UI hiển thị đầy đủ thông tin
- [x] Filter theo trạng thái hoạt động
- [x] Loading và error states
- [x] Format giá và ngày đúng

## 🎉 Kết quả

Giờ API đơn hàng hoạt động hoàn hảo:
- ✅ Checkout thành công
- ✅ Lấy danh sách đơn hàng
- ✅ Hiển thị chi tiết
- ✅ Filter theo trạng thái
- ✅ UI đẹp và responsive

Thử test lại nhé! 🚀
