# Hướng dẫn Upload Ảnh cho Tin tức

## ✅ Đã cải thiện

### Trước đây:
- Input file đơn giản, không rõ ràng
- Không có preview ảnh trực quan
- Không có drag & drop

### Bây giờ:
- ✅ UI đẹp với vùng upload lớn, rõ ràng
- ✅ Preview ảnh ngay lập tức
- ✅ Hỗ trợ drag & drop (kéo thả ảnh)
- ✅ Hiển thị thông tin file đã chọn
- ✅ Validation file type và size
- ✅ Hover effect để thay đổi ảnh
- ✅ Icon và text hướng dẫn rõ ràng

## 🎯 Cách sử dụng

### Cách 1: Click để chọn ảnh

1. Click vào vùng upload (có icon 📷)
2. Chọn file ảnh từ máy tính
3. Ảnh sẽ hiển thị preview ngay lập tức
4. Thông tin file sẽ hiển thị bên dưới

### Cách 2: Kéo thả (Drag & Drop)

1. Kéo file ảnh từ máy tính
2. Thả vào vùng upload
3. Ảnh sẽ tự động được chọn và preview

### Thay đổi ảnh đã chọn

1. Hover chuột lên ảnh preview
2. Sẽ hiện overlay "📷 Click để thay đổi ảnh"
3. Click để chọn ảnh mới

## 📋 Quy định

### File được chấp nhận:
- ✅ JPG / JPEG
- ✅ PNG
- ✅ WEBP

### Kích thước:
- ✅ Tối đa: 5MB
- ❌ Quá 5MB sẽ báo lỗi

### Validation:
- Kiểm tra định dạng file
- Kiểm tra kích thước file
- Hiển thị lỗi rõ ràng nếu không hợp lệ

## 🎨 UI Features

### Khi chưa chọn ảnh:
```
┌─────────────────────────────┐
│                             │
│           📷                │
│                             │
│  Click để chọn ảnh từ máy   │
│  hoặc kéo thả ảnh vào đây   │
│                             │
└─────────────────────────────┘
```

### Khi đã chọn ảnh:
```
┌─────────────────────────────┐
│                             │
│      [Preview Image]        │
│                             │
│  (Hover để thấy nút đổi)    │
└─────────────────────────────┘

✅ Đã chọn: image.jpg (2.5 MB)
```

### Hover trên ảnh:
```
┌─────────────────────────────┐
│    [Overlay màu tối]        │
│                             │
│  📷 Click để thay đổi ảnh   │
│                             │
└─────────────────────────────┘
```

## 💡 Thông báo lỗi

### Lỗi định dạng:
```
❌ Chỉ chấp nhận file ảnh định dạng JPG, PNG, WEBP
```

### Lỗi kích thước:
```
❌ Kích thước ảnh không được vượt quá 5MB
```

## 🔄 Flow hoạt động

1. **User chọn file** (click hoặc drag & drop)
2. **Validate file type** → Nếu sai → Hiển thị lỗi
3. **Validate file size** → Nếu quá lớn → Hiển thị lỗi
4. **Create preview URL** → Hiển thị ảnh
5. **Save file to form state** → Sẵn sàng upload
6. **Submit form** → Upload lên server (Cloudinary)

## 📱 Responsive

- Desktop: Vùng upload lớn, dễ thao tác
- Tablet: Vẫn giữ kích thước thoải mái
- Mobile: Thu nhỏ phù hợp, vẫn dễ dùng

## 🎉 Kết quả

Giờ form upload ảnh:
- ✅ Trực quan, dễ hiểu
- ✅ Hỗ trợ nhiều cách chọn file
- ✅ Preview ngay lập tức
- ✅ Validation đầy đủ
- ✅ UX chuyên nghiệp
- ✅ Responsive tốt

## 🔧 Technical Details

### State Management:
```javascript
const [form, setForm] = useState({
  imageFile: null,  // File object
  // ...
});

const [imagePreview, setImagePreview] = useState(""); // URL.createObjectURL
```

### File Handling:
```javascript
const handleImageChange = (e) => {
  const file = e.target.files[0];
  // Validate type & size
  // Create preview URL
  // Update state
};
```

### Drag & Drop:
```javascript
const handleDragOver = (e) => {
  e.preventDefault();
};

const handleDrop = (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  // Process file
};
```

### Upload to Server:
```javascript
const formData = new FormData();
formData.append("imageUrl", form.imageFile);
// Send to API
```

Hoàn hảo! 🎨
