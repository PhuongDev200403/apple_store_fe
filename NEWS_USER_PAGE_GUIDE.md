# Hướng dẫn Trang Tin tức cho Người dùng

## ✅ Đã hoàn thành

### 1. **Trang Danh sách Tin tức** (`/tin-tuc`)
- ✅ Lấy dữ liệu từ API `getActiveNews()` - Tin đang hoạt động
- ✅ Lấy tin nổi bật từ API `getFeaturedNews()`
- ✅ Hiển thị grid 2 cột cho danh sách tin
- ✅ Sidebar hiển thị tin nổi bật
- ✅ Click vào tin → Chuyển đến trang chi tiết
- ✅ Loading state với spinner
- ✅ Error handling với nút retry
- ✅ Empty state khi không có tin
- ✅ Badge "⭐ Nổi bật" cho tin featured
- ✅ Format ngày tháng theo chuẩn Việt Nam

### 2. **Trang Chi tiết Tin tức** (`/tin-tuc/:newsId`)
- ✅ Lấy chi tiết tin từ API `getNewsById(newsId)`
- ✅ Hiển thị ảnh, tiêu đề, nội dung đầy đủ
- ✅ Sidebar tin liên quan (4 tin)
- ✅ Nút "Quay lại tin tức"
- ✅ Loading state
- ✅ Error handling
- ✅ Badge "⭐ Tin nổi bật"
- ✅ Format ngày giờ chi tiết
- ✅ Responsive design

### 3. **Routes**
- ✅ `/tin-tuc` - Danh sách tin tức
- ✅ `/tin-tuc/:newsId` - Chi tiết tin tức

## 📋 API Endpoints được sử dụng

### NewsPage sử dụng:
```javascript
// Lấy tin đang hoạt động (isActive = true)
GET /api/news/is_active

// Lấy tin nổi bật (isFeatured = true)
GET /api/news/is_featured
```

### NewsDetailPage sử dụng:
```javascript
// Lấy chi tiết tin theo ID
GET /api/news/{id}

// Lấy tin liên quan (dùng is_active)
GET /api/news/is_active
```

## 🎯 Cấu trúc dữ liệu

### Response từ API:
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

## 🎨 UI Features

### NewsPage:
```
┌─────────────────────────────────────────────┐
│  Tin tức công nghệ                          │
├──────────────────┬──────────────────────────┤
│  [Tin 1]         │  [Tin 2]                 │
│  [Tin 3]         │  [Tin 4]                 │
│  [Tin 5]         │  [Tin 6]                 │
└──────────────────┴──────────────────────────┘
                   │
                   │  Tin tức nổi bật
                   │  [Featured News]
                   └──────────────────
```

### NewsDetailPage:
```
┌─────────────────────────────────────────────┐
│  ← Quay lại tin tức                         │
├─────────────────────────────────────────────┤
│  ⭐ Tin nổi bật                              │
│  [Tiêu đề tin tức]                          │
│  📅 Ngày đăng                                │
├─────────────────────────────────────────────┤
│  [Ảnh lớn]                                  │
├─────────────────────────────────────────────┤
│  [Nội dung chi tiết...]                     │
│                                             │
│  ❤️ Thích    🔗 Chia sẻ                     │
└─────────────────────────────────────────────┘
                   │
                   │  Tin tức liên quan
                   │  [Related 1]
                   │  [Related 2]
                   │  [Related 3]
                   │  [Related 4]
                   └──────────────────
```

## 🔄 Flow hoạt động

### Xem danh sách tin:
1. User vào `/tin-tuc`
2. Hiển thị loading spinner
3. Gọi API `getActiveNews()` và `getFeaturedNews()`
4. Hiển thị danh sách tin + tin nổi bật
5. User click vào tin → Navigate đến `/tin-tuc/{id}`

### Xem chi tiết tin:
1. User vào `/tin-tuc/{id}`
2. Hiển thị loading spinner
3. Gọi API `getNewsById(id)` và `getActiveNews()`
4. Hiển thị chi tiết tin + tin liên quan
5. User click tin liên quan → Reload với ID mới

## 💡 Tính năng đặc biệt

### 1. **Badge Nổi bật**
- Tin có `isFeatured: true` → Hiển thị badge "⭐ Nổi bật"
- Màu vàng gradient đẹp mắt

### 2. **Format ngày tháng**
- NewsPage: `28/04/2023`
- NewsDetailPage: `28/04/2023, 16:04`
- Tự động format theo locale Việt Nam

### 3. **Excerpt tự động**
- Cắt nội dung dài thành 150 ký tự (NewsPage)
- Cắt nội dung dài thành 100 ký tự (Related news)
- Thêm "..." nếu nội dung dài hơn

### 4. **Loading States**
- Spinner animation mượt mà
- Text "Đang tải tin tức..."
- Không block UI

### 5. **Error Handling**
- Hiển thị thông báo lỗi rõ ràng
- Nút "Thử lại" để reload
- Nút "Quay lại" khi không tìm thấy tin

### 6. **Responsive**
- Desktop: Grid 2 cột + sidebar
- Tablet: Grid 1 cột + sidebar dưới
- Mobile: Stack layout

## 🚀 Cách sử dụng

### Xem danh sách tin tức:
```
http://localhost:5173/tin-tuc
```

### Xem chi tiết tin tức:
```
http://localhost:5173/tin-tuc/2
http://localhost:5173/tin-tuc/5
```

## 🔗 Liên kết với Admin

- Admin tạo tin → Đặt `isActive: true` → Hiển thị ở NewsPage
- Admin đánh dấu `isFeatured: true` → Hiển thị ở sidebar nổi bật
- Admin xóa tin → Không còn hiển thị

## 📱 Responsive Breakpoints

- Desktop: > 1024px (Grid 2 cột)
- Tablet: 768px - 1024px (Grid 1 cột)
- Mobile: < 768px (Stack layout)

## 🎉 Kết quả

Giờ bạn có:
1. ✅ Trang danh sách tin tức lấy từ API
2. ✅ Trang chi tiết tin tức với nội dung đầy đủ
3. ✅ Click vào tin → Chuyển đến trang chi tiết
4. ✅ Tin nổi bật hiển thị ở sidebar
5. ✅ Tin liên quan ở trang chi tiết
6. ✅ Loading và error states hoàn chỉnh
7. ✅ Responsive trên mọi thiết bị
8. ✅ UI/UX chuyên nghiệp

Tất cả đã hoạt động với API thật! 🚀
