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

async function httpNoBody(path, method) {
  const url = `${BASE_URL}${path}`;
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { method, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || `Request failed ${res.status}`;
    const error = new Error(message);
    error.code = data?.code;
    throw error;
  }
  return data;
}

function invalidateCacheByPrefix(prefixPath) {
  const prefixUrl = `${BASE_URL}${prefixPath}`;
  for (const key of Array.from(cache.keys())) {
    if (key.startsWith(prefixUrl)) cache.delete(key);
  }
}

export async function getAllOrders() {
  // Backend: GET /api/orders
  return await httpGet('/orders');
}

export async function updateOrderStatus(orderId, newStatus) {
  // Backend: PUT /api/orders/{id}/status?newStatus=STATUS
  const res = await httpNoBody(`/orders/${orderId}/status?newStatus=${encodeURIComponent(newStatus)}`, 'PUT');
  invalidateCacheByPrefix('/orders');
  return res;
}

export const ORDER_STATUSES = ['PENDING', 'SHIPPED', 'COMPLETED', 'CANCELLED'];


