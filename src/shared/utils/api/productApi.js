const BASE_URL = 'http://localhost:8080/api';

/**
 * Gọi API GET chung
 */
async function get(url) {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) throw new Error(`Request failed with ${res.status}`);

  const data = await res.json();
  return data.result || data.data || data; // Chuẩn theo ApiResponse
}

/**
 * Lấy tất cả sản phẩm
 * GET /api/products
 */
export async function getAllProducts() {
  return await get('/products');
}

/**
 * Lấy chi tiết sản phẩm
 * GET /api/products/{id}
 */
export async function getProductById(id) {
  return await get(`/products/${id}`);
}

/**
 * Tìm kiếm sản phẩm theo tên
 * GET /api/products/search?keyword={keyword}
 */
export async function searchProducts(keyword) {
  return await get(`/products/search?keyword=${encodeURIComponent(keyword)}`);
}
