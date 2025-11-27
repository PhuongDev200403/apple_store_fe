# Hướng dẫn Fix lỗi 404 - Trang Thanh toán

## ✅ Đã kiểm tra

1. ✅ File `CheckoutPage.jsx` đã tồn tại
2. ✅ File `CheckoutPage.css` đã tồn tại  
3. ✅ File `orderApi.js` đã tồn tại
4. ✅ Route đã được thêm vào `AppRoutes.jsx`
5. ✅ Import đã đúng
6. ✅ Export default đã đúng
7. ✅ Không có lỗi syntax

## 🔧 Cách fix lỗi 404

### Bước 1: Restart Dev Server

Lỗi 404 thường do dev server chưa reload file mới. Hãy:

1. **Dừng dev server** (Ctrl + C trong terminal)
2. **Xóa cache** (nếu có):
   ```bash
   rm -rf node_modules/.vite
   # hoặc trên Windows
   rmdir /s /q node_modules\.vite
   ```
3. **Khởi động lại**:
   ```bash
   npm run dev
   # hoặc
   yarn dev
   ```

### Bước 2: Clear Browser Cache

1. Mở DevTools (F12)
2. Right-click vào nút Reload
3. Chọn "Empty Cache and Hard Reload"

### Bước 3: Kiểm tra URL

Đảm bảo URL đúng:
```
✅ http://localhost:5173/thanh-toan
❌ http://localhost:5173/checkout
❌ http://localhost:5173/thanh-toán (có dấu)
```

### Bước 4: Kiểm tra Console

Mở Console (F12) và xem có lỗi gì không:
- Import errors
- Module not found
- Syntax errors

## 🎯 Test thử

### Từ CartPage:

1. Vào `/gio-hang`
2. Click nút "Tiến hành thanh toán"
3. Sẽ navigate đến `/thanh-toan`

### Trực tiếp:

1. Gõ URL: `http://localhost:5173/thanh-toan`
2. Nếu chưa đăng nhập → Redirect đến `/dang-nhap`
3. Nếu đã đăng nhập → Hiển thị trang checkout

## 📋 Checklist

- [ ] Dev server đã restart
- [ ] Browser cache đã clear
- [ ] URL đúng (không có dấu)
- [ ] Đã đăng nhập
- [ ] Console không có lỗi
- [ ] Network tab không có failed requests

## 🔍 Debug Steps

### 1. Kiểm tra file tồn tại:

```bash
# Kiểm tra file CheckoutPage
ls src/shared/pages/checkout/CheckoutPage.jsx

# Kiểm tra file orderApi
ls src/shared/utils/api/orderApi.js
```

### 2. Kiểm tra import trong AppRoutes:

```javascript
// Phải có dòng này
const CheckoutPage = lazy(() => import('../shared/pages/checkout/CheckoutPage.jsx'));

// Và route này
{ path: 'thanh-toan', element: <ProtectedRoute><CheckoutPage /></ProtectedRoute> }
```

### 3. Kiểm tra export trong CheckoutPage:

```javascript
// Phải có dòng này ở cuối file
export default function CheckoutPage() {
  // ...
}
```

### 4. Test import trực tiếp:

Tạo file test:
```javascript
// test-import.js
import CheckoutPage from './src/shared/pages/checkout/CheckoutPage.jsx';
console.log(CheckoutPage); // Should not be undefined
```

## 🆘 Nếu vẫn lỗi

### Option 1: Tạo lại file

1. Backup file hiện tại
2. Xóa file `CheckoutPage.jsx`
3. Tạo lại file mới
4. Copy nội dung từ backup

### Option 2: Kiểm tra path

Đảm bảo path trong lazy import đúng:
```javascript
// Đúng
const CheckoutPage = lazy(() => import('../shared/pages/checkout/CheckoutPage.jsx'));

// Sai
const CheckoutPage = lazy(() => import('../pages/checkout/CheckoutPage.jsx'));
const CheckoutPage = lazy(() => import('./shared/pages/checkout/CheckoutPage.jsx'));
```

### Option 3: Không dùng lazy loading

Thử import trực tiếp:
```javascript
import CheckoutPage from '../shared/pages/checkout/CheckoutPage.jsx';

// Trong routes
{ path: 'thanh-toan', element: <ProtectedRoute><CheckoutPage /></ProtectedRoute> }
```

## ✨ Đã thêm ErrorBoundary

Giờ nếu có lỗi, sẽ hiển thị trang lỗi đẹp thay vì 404:
- ✅ Thông báo lỗi rõ ràng
- ✅ Nút "Về trang chủ"
- ✅ Nút "Tải lại trang"
- ✅ UI đẹp với gradient

## 🎉 Sau khi fix

Trang thanh toán sẽ hoạt động với:
- ✅ Form nhập địa chỉ
- ✅ Chọn phương thức thanh toán
- ✅ Order summary
- ✅ Validation
- ✅ API integration

## 📞 Nếu cần help thêm

Cung cấp thông tin:
1. Console errors (nếu có)
2. Network tab (failed requests)
3. Browser và version
4. Node version
5. Package manager (npm/yarn)

---

**Lưu ý**: Lỗi 404 thường do dev server chưa reload. Restart là cách fix nhanh nhất! 🚀
