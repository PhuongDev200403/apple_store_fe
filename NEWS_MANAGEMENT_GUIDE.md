# Hướng dẫn Quản lý Tin tức

## ✅ Đã hoàn thành

### 1. API Functions (newsApi.js)

**Admin Functions:**
- `getAllNews()` - Lấy tất cả tin tức (chỉ Admin)
- `createNews(formData)` - Tạo tin tức mới với upload ảnh
- `updateNews(id, formData)` - Cập nhật tin tức
- `deleteNews(id)` - Xóa tin tức

**Public Functions:**
- `getFeaturedNews()` - Lấy tin tức nổi bật
- `getActiveNews()` - Lấy tin tức đang hoạt động
- `getNewsById(id)` - Lấy chi tiết tin tức

### 2. News Management Section

**Tính năng:**
- ✅ Hiển thị danh sách tin tức dạng grid cards
- ✅ Tìm kiếm theo tiêu đề, nội dung
- ✅ Thêm tin tức mới với upload ảnh
- ✅ Sửa tin tức (có thể thay đổi ảnh)
- ✅ Xóa tin tức
- ✅ Đánh dấu tin nổi bật (isFeatured)
- ✅ Bật/tắt hiển thị (isActive)
- ✅ Preview ảnh trước khi upload
- ✅ Responsive design

### 3. Chức năng Đăng xuất

**Đã thêm:**
- ✅ Nút đăng xuất ở sidebar footer
- ✅ Confirm trước khi đăng xuất
- ✅ Xóa token, role, username khỏi localStorage
- ✅ Redirect về trang đăng nhập
- ✅ Hiển thị tên admin ở sidebar header

## 📋 Cấu trúc dữ liệu

### Request - Tạo/Cập nhật tin tức

```javascript
// FormData format
const formData = new FormData();
formData.append("title", "Tiêu đề tin tức");
formData.append("content", "Nội dung chi tiết...");
formData.append("isFeatured", true);  // true/false
formData.append("isActive", true);    // true/false
formData.append("imageUrl", fileObject); // File object
```

### Response - Danh sách tin tức

```json
{
  "code": 0,
  "result": [
    {
      "id": 2,
      "title": "Thông tin mới về iPhone 17 sắp ra mắt",
      "content": "Nội dung vẫn đang được cập nhật",
      "imageUrl": "https://res.cloudinary.com/.../image.webp",
      "isFeatured": true,
      "publishedAt": "2025-10-09T16:04:41.526855",
      "isActive": true
    }
  ]
}
```

## 🎯 API Endpoints

| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| GET | `/api/news` | Lấy tất cả tin tức | Admin |
| GET | `/api/news/is_featured` | Lấy tin nổi bật | Public |
| GET | `/api/news/is_active` | Lấy tin đang hoạt động | Public |
| GET | `/api/news/{id}` | Lấy chi tiết tin | Public |
| POST | `/api/news` | Tạo tin mới | Admin |
| PUT | `/api/news/{id}` | Cập nhật tin | Admin |
| DELETE | `/api/news/{id}` | Xóa tin | Admin |

## 🚀 Cách sử dụng

### 1. Truy cập trang Admin

```
http://localhost:5173/admin
```

### 2. Chọn "📰 Quản lý tin tức" từ sidebar

### 3. Thêm tin tức mới

1. Click nút "➕ Thêm tin tức"
2. Nhập tiêu đề và nội dung
3. Upload ảnh (tối đa 5MB)
4. Chọn "⭐ Tin tức nổi bật" nếu muốn
5. Chọn "✅ Hiển thị công khai" để publish
6. Click "➕ Tạo mới"

### 4. Sửa tin tức

1. Click nút "✏️ Sửa" trên card tin tức
2. Chỉnh sửa thông tin
3. Có thể thay đổi ảnh mới
4. Click "💾 Cập nhật"

### 5. Xóa tin tức

1. Click nút "🗑️ Xóa"
2. Confirm xóa
3. Tin tức sẽ bị xóa vĩnh viễn

### 6. Đăng xuất

1. Click nút "🚪 Đăng xuất" ở cuối sidebar
2. Confirm đăng xuất
3. Sẽ redirect về trang đăng nhập

## 💡 Lưu ý

1. **Upload ảnh:**
   - Kích thước tối đa: 5MB
   - Định dạng: JPG, PNG, WEBP
   - Ảnh sẽ được upload lên Cloudinary

2. **Tin nổi bật (isFeatured):**
   - Hiển thị badge vàng "⭐ Nổi bật"
   - Có thể dùng để hiển thị ở trang chủ

3. **Trạng thái (isActive):**
   - `true`: Hiển thị công khai (badge xanh ✅)
   - `false`: Ẩn khỏi public (badge đỏ ❌)

4. **Tìm kiếm:**
   - Tìm theo tiêu đề hoặc nội dung
   - Real-time search

## 🎨 UI/UX Features

- ✅ Grid layout responsive
- ✅ Card design hiện đại
- ✅ Image preview khi upload
- ✅ Loading states
- ✅ Error handling
- ✅ Confirm dialogs
- ✅ Toast notifications
- ✅ Smooth animations
- ✅ Mobile-friendly

## 📱 Responsive Breakpoints

- Desktop: > 768px (Grid 3 columns)
- Tablet: 768px (Grid 2 columns)
- Mobile: < 768px (Grid 1 column)

## 🔐 Security

- Tất cả API calls đều yêu cầu token
- Chỉ Admin mới có quyền CRUD tin tức
- Auto logout khi token hết hạn (401)
- File upload validation (size, type)

## 🎉 Kết quả

Giờ bạn có:
1. ✅ Trang quản lý tin tức đầy đủ chức năng
2. ✅ Upload ảnh lên Cloudinary
3. ✅ Nút đăng xuất cho Admin
4. ✅ UI/UX chuyên nghiệp
5. ✅ Responsive trên mọi thiết bị
