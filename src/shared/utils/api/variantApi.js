const BASE_URL = 'http://localhost:8080/api';

const cache = new Map();

async function httpGet(path) {
  const url = `${BASE_URL}${path}`;
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed ${res.status}`);
  const data = await res.json();
  cache.set(url, data);
  return data;
}

async function httpWithBody(path, method, body) {
  const url = `${BASE_URL}${path}`;
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || `Request failed ${res.status}`;
    const error = new Error(message);
    error.code = data?.code;
    throw error;
  }
  return data;
}

function normalizeList(data) {
  if (data && data.code === 0 && Array.isArray(data.result)) return data.result;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function invalidateCacheByPrefix(prefixPath) {
  const prefixUrl = `${BASE_URL}${prefixPath}`;
  for (const key of Array.from(cache.keys())) {
    if (key.startsWith(prefixUrl)) cache.delete(key);
  }
}

export async function getAllVariants() {
  const data = await httpGet('/variants');
  return normalizeList(data);
}

export async function createVariant(payload) {
  const body = {
    productId: payload?.productId ? parseInt(payload.productId) : undefined,
    price: payload?.price ? Number(payload.price) : undefined,
    sku: payload?.sku,
    memory: payload?.memory,
    color: payload?.color,
    imageUrl: payload?.imageUrl || '',
    specifications: payload?.specifications || '',
    slug: payload?.slug || '',
    quantity: payload?.quantity ? Number(payload.quantity) : undefined,
    status: payload?.status || 'ACTIVE',
  };
  const res = await httpWithBody('/variants', 'POST', body);
  invalidateCacheByPrefix('/variants');
  return res;
}


