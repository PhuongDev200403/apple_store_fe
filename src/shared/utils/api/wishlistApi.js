// src/utils/api/wishlistApi.js

const BASE_URL = 'http://localhost:8080/api';

/**
 * Hàm tiện ích gọi API có tự động thêm token Authorization nếu có
 */
async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(localStorage.getItem('token')
      ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
      : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { headers, ...options });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Request failed (${res.status}): ${msg}`);
  }

  const data = await res.json();
  // Chuẩn hóa format trả về từ backend Spring Boot
  return data.result || data.data || data;
}

/* ---------------------------------------------
   🩶 Các hàm thao tác với danh sách yêu thích
---------------------------------------------- */

/**
 * Lấy danh sách yêu thích của người dùng hiện tại
 * GET /api/wishlist/my-wishlist
 */
export async function getMyWishlist() {
  return await request('/wishlist/my-wishlist');
}

/**
 * Thêm sản phẩm vào danh sách yêu thích
 * POST /api/wishlist
 * body: { productVariantId: number }
 */
export async function addToWishlist(productVariantId) {
  return await request('/wishlist', {
    method: 'POST',
    body: JSON.stringify({ productVariantId }),
  });
}

/**
 * Xóa 1 sản phẩm khỏi danh sách yêu thích
 * DELETE /api/wishlist/my-wishlist/{productVariantId}
 */
export async function removeFromWishlist(productVariantId) {
  return await request(`/wishlist/my-wishlist/${productVariantId}`, {
    method: 'DELETE',
  });
}

/**
 * Xóa toàn bộ danh sách yêu thích
 * PUT /api/wishlist/my-wishlist/clear
 */
export async function clearWishlist() {
  return await request('/wishlist/my-wishlist/clear', {
    method: 'PUT',
  });
}

/**
 * (Admin) Lấy tất cả wishlist của mọi user
 * GET /api/wishlist
 */
export async function getAllWishlist() {
  return await request('/wishlist');
}

/**
 * (Admin) Lấy wishlist của 1 user cụ thể theo userId
 * GET /api/wishlist/{userId}
 */
export async function getWishlistByUserId(userId) {
  return await request(`/wishlist/${userId}`);
}
