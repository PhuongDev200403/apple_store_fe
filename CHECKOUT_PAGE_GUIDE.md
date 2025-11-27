# Hướng dẫn Trang Thanh toán

## ✅ Đã hoàn thành

### 1. **Trang Thanh toán** (`/thanh-toan`)
- ✅ Form nhập địa chỉ giao hàng
- ✅ Chọn phương thức thanh toán (COD, Bank Transfer, Credit Card)
- ✅ Nhập ghi chú đơn hàng (tùy chọn)
- ✅ Hiển thị tóm tắt đơn hàng
- ✅ Validation form đầy đủ
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design

### 2. **API Functions** (orderApi.js)
- ✅ `checkout(orderData)` - Tạo đơn hàng
- ✅ `getMyOrders()` - Lấy đơn hàng của user
- ✅ `getOrderById(id)` - Chi tiết đơn hàng
- ✅ `cancelOrder(id)` - Hủy đơn hàng
- ✅ `getAllOrders()` - Admin lấy tất cả đơn
- ✅ `updateOrderStatus(id, status)` - Admin cập nhật trạng thái

### 3. **Routes**
- ✅ `/thanh-toan` - Trang thanh toán
- ✅ Protected route (cần đăng nhập)

### 4. **Integration**
- ✅ CartPage có nút "Tiến hành thanh toán"
- ✅ Click nút → Navigate đến `/thanh-toan`
- ✅ Checkout thành công → Navigate đến `/don-hang`

## 📋 API Endpoint

### Checkout:
```
POST /api/orders/check_out
```

### Request Body:
```json
{
  "shippingAddress": "Nhà số 12 hẻm 129/29/3, Minh Khai, Bắc Từ Liêm, Hà Nội",
  "shippingMethod": "COD",
  "note": "Không được hoàn trả hàng, đây là chính sách riêng của shop"
}
```

### Response:
```json
{
  "code": 0,
  "result": {
    "orderId": 123,
    "status": "PENDING",
    "totalAmount": 29990000,
    "createdAt": "2025-01-17T10:30:00"
  }
}
```

## 🎨 UI Features

### Layout:
```
┌─────────────────────────────────────────────┐
│  🛒 Thanh toán đơn hàng                     │
│  Vui lòng kiểm tra thông tin...            │
├──────────────────────┬──────────────────────┤
│  FORM BÊN TRÁI       │  ORDER SUMMARY       │
│                      │                      │
│  📍 Địa chỉ giao hàng│  [Product 1]         │
│  [Textarea]          │  [Product 2]         │
│                      │  [Product 3]         │
│  🚚 Phương thức      │                      │
│  ○ COD               │  ─────────────────   │
│  ○ Bank Transfer     │  Tạm tính: 29.990đ   │
│  ○ Credit Card       │  Phí ship: Miễn phí  │
│                      │  ─────────────────   │
│  📝 Ghi chú          │  Tổng: 29.990.000đ   │
│  [Textarea]          │                      │
│                      │  💡 Miễn phí ship    │
│  [Hoàn tất đặt hàng] │  🔒 Bảo mật          │
└──────────────────────┴──────────────────────┘
```

### Form Fields:

#### 1. **Địa chỉ giao hàng** (Required)
- Type: Textarea
- Validation: 
  - Không được để trống
  - Tối thiểu 10 ký tự
- Placeholder: "Ví dụ: Nhà số 12 hẻm 129/29/3..."

#### 2. **Phương thức thanh toán** (Required)
- Type: Radio buttons
- Options:
  - 💵 COD (Thanh toán khi nhận hàng)
  - 🏦 Bank Transfer (Chuyển khoản)
  - 💳 Credit Card (Thẻ tín dụng)
- Default: COD

#### 3. **Ghi chú** (Optional)
- Type: Textarea
- Validation: None
- Placeholder: "Ghi chú thêm về đơn hàng..."

### Order Summary:

#### Hiển thị:
- ✅ Danh sách sản phẩm với ảnh
- ✅ Số lượng badge trên ảnh
- ✅ Tên sản phẩm + variant
- ✅ Giá từng item
- ✅ Tạm tính
- ✅ Phí vận chuyển (Miễn phí)
- ✅ Tổng cộng (lớn, nổi bật)
- ✅ Notes về miễn phí ship và bảo mật

## 🔄 Flow hoạt động

### 1. User ở CartPage:
```
[Giỏ hàng] → Click "Tiến hành thanh toán"
```

### 2. Navigate đến CheckoutPage:
```
/thanh-toan
```

### 3. Load dữ liệu:
```javascript
- Lấy giỏ hàng từ API
- Nếu giỏ trống → Redirect về /gio-hang
- Hiển thị form + order summary
```

### 4. User điền form:
```
- Nhập địa chỉ giao hàng
- Chọn phương thức thanh toán
- Nhập ghi chú (optional)
```

### 5. Submit form:
```javascript
- Validate form
- Nếu có lỗi → Hiển thị error messages
- Nếu OK → Call API checkout
- Loading state với spinner
```

### 6. Sau khi checkout thành công:
```
- Alert "Đặt hàng thành công!"
- Navigate đến /don-hang
```

## 💡 Validation Rules

### Địa chỉ giao hàng:
```javascript
- Required: true
- Min length: 10 characters
- Error messages:
  - "Vui lòng nhập địa chỉ giao hàng"
  - "Địa chỉ quá ngắn, vui lòng nhập đầy đủ"
```

### Phương thức thanh toán:
```javascript
- Required: true
- Options: COD, BANK_TRANSFER, CREDIT_CARD
- Error message:
  - "Vui lòng chọn phương thức thanh toán"
```

### Ghi chú:
```javascript
- Required: false
- No validation
```

## 🎯 Key Features

### 1. **Real-time Validation**
- Validate khi user blur khỏi field
- Clear error khi user bắt đầu nhập
- Highlight field có lỗi (border đỏ)

### 2. **Payment Method Selection**
- Radio buttons với icon đẹp
- Hover effect
- Selected state nổi bật
- Smooth transitions

### 3. **Order Summary Sticky**
- Sticky position trên desktop
- Scroll với user
- Hiển thị đầy đủ thông tin

### 4. **Loading States**
- Spinner khi load cart
- Button disabled + spinner khi submit
- Text "Đang xử lý..."

### 5. **Error Handling**
- Form validation errors
- API errors
- Empty cart redirect
- User-friendly messages

### 6. **Responsive Design**
- Desktop: 2 columns (form + summary)
- Tablet: 1 column (stack)
- Mobile: Optimized spacing

## 🎨 Design Highlights

### Colors:
- Primary: #667eea (Purple)
- Success: #10b981 (Green)
- Error: #dc3545 (Red)
- Background: Gradient purple

### Animations:
- Fade in down (header)
- Fade in left (form)
- Fade in right (summary)
- Smooth transitions

### Typography:
- Title: 2.5rem, weight 900
- Section titles: 1.5rem, weight 800
- Body: 1rem, line-height 1.7

### Spacing:
- Section gaps: 35px
- Form groups: 20px
- Padding: 40px (desktop), 20px (mobile)

## 📱 Responsive Breakpoints

### Desktop (> 1024px)
- Grid: 1.5fr 1fr
- Sticky summary
- Full spacing

### Tablet (768px - 1024px)
- Grid: 1 column
- Static summary
- Medium spacing

### Mobile (< 768px)
- Stack layout
- Reduced padding
- Smaller fonts

## 🚀 Usage Example

### Navigate từ CartPage:
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

<button onClick={() => navigate('/thanh-toan')}>
  Tiến hành thanh toán
</button>
```

### Call API checkout:
```javascript
import { checkout } from '../../utils/api/orderApi';

const orderData = {
  shippingAddress: "Nhà số 12...",
  shippingMethod: "COD",
  note: "Ghi chú..."
};

const result = await checkout(orderData);
```

## 🎉 Kết quả

Giờ bạn có:
1. ✅ Trang thanh toán đẹp và chuyên nghiệp
2. ✅ Form validation đầy đủ
3. ✅ 3 phương thức thanh toán
4. ✅ Order summary chi tiết
5. ✅ Loading và error states
6. ✅ Responsive hoàn hảo
7. ✅ Integration với CartPage
8. ✅ Navigate đến OrdersPage sau khi thành công

Trang thanh toán đã sẵn sàng! 🛒✨
