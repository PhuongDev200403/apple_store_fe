# Danh sách API Functions

## userApi.js

### User Functions
- `getMyInfo()` - Lấy thông tin user đang đăng nhập

### Admin Functions  
- `getUsers()` - Lấy danh sách tất cả users
- `createUser(userData)` - Tạo user mới
- `updateUser(userId, userData)` - Cập nhật user
- `deleteUser(userId)` - Xóa user

## productApi.js

- `getAllProducts()` - Lấy tất cả sản phẩm
- `getAllSeries()` - Lấy tất cả series
- `getProductById(id)` - Lấy chi tiết sản phẩm theo ID
- `createProduct(payload)` - Tạo sản phẩm mới
- `updateProduct(id, payload)` - Cập nhật sản phẩm
- `deleteProduct(id)` - Xóa sản phẩm
- `getProductsBySeries(seriesId)` - Lấy sản phẩm theo series

## variantApi.js

- `getVariants()` - Lấy tất cả variants
- `getAllVariants()` - Alias của getVariants
- `createVariant(body)` - Tạo variant mới
- `updateVariant(id, body)` - Cập nhật variant
- `deleteVariant(id)` - Xóa variant
- `createVariantWithImage(formData)` - Tạo variant với hình ảnh
- `clearVariantCache()` - Xóa cache

## cartApi.js

### Admin Functions
- `getAllCarts()` - Lấy tất cả giỏ hàng
- `getCartByUserId(userId)` - Lấy giỏ hàng theo user ID

### User Functions
- `getMyCart()` - Lấy giỏ hàng của bản thân
- `addToCart(productVariantId, quantity)` - Thêm sản phẩm vào giỏ
- `removeItemFromCart(productVariantId)` - Xóa sản phẩm khỏi giỏ
- `clearMyCart()` - Xóa toàn bộ giỏ hàng
- `clearCartCache()` - Xóa cache

## wishlistApi.js

### Admin Functions
- `getAllWishlists()` - Lấy tất cả wishlist
- `getWishlistByUserId(userId)` - Lấy wishlist theo user ID

### User Functions
- `getMyWishlist()` - Lấy wishlist của bản thân
- `removeItemFromWishlist(productVariantId)` - Xóa sản phẩm khỏi wishlist
- `clearMyWishlist()` - Xóa toàn bộ wishlist
- `clearWishlistCache()` - Xóa cache

## ordersApi.js

- `getAllOrders()` - Lấy tất cả đơn hàng
- `updateOrderStatus(orderId, newStatus)` - Cập nhật trạng thái đơn hàng

## categoriesApi.js

- `getCategories()` - Lấy tất cả danh mục
- `createCategory(data)` - Tạo danh mục mới
- `updateCategory(id, data)` - Cập nhật danh mục
- `deleteCategory(id)` - Xóa danh mục

## categoryApi.js

- `getSeries()` - Lấy tất cả series
- `createSeries(data)` - Tạo series mới
- `updateSeries(id, data)` - Cập nhật series
- `deleteSeries(id)` - Xóa series

## authApi.js

- `login(credentials)` - Đăng nhập
- `register(userData)` - Đăng ký
- `logout()` - Đăng xuất

## Lưu ý

- Tất cả API functions đều tự động thêm token từ localStorage
- Xử lý lỗi 401 (Unauthorized) tự động redirect về trang login
- Có caching cho các GET requests để tối ưu performance
- Các function có prefix `getAll` hoặc `get` thường dành cho Admin
- Các function có prefix `getMy` dành cho User lấy dữ liệu của chính mình
