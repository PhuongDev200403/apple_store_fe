const BASE_URL = 'http://localhost:8080/api';

const cache = new Map();

async function httpGet(path) {
  const url = `${BASE_URL}${path}`;
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || `Request failed ${res.status}`;
    const error = new Error(message);
    error.code = data?.code;
    throw error;
  }
  cache.set(url, data);
  return data;
}

function normalizeListResponse(res) {
  // Accept sample: { code, result: [...] } or raw array or { data.result }
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.result)) return res.result;
  if (Array.isArray(res?.data?.result)) return res.data.result;
  if (Array.isArray(res?.data)) return res.data;
  return [];
}

export async function getAllWishlists() {
  const res = await httpGet('/wishlist');
  return normalizeListResponse(res);
}

export async function getWishlistByUserId(userId) {
  // Backend: GET /api/wishlist/{id} where id = userId
  const res = await httpGet(`/wishlist/${encodeURIComponent(userId)}`);
  return res; // keep raw detail; component will read fields safely
}


