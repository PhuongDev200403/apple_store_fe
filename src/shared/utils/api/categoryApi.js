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

function invalidateCacheByPrefix(prefixPath) {
  const prefixUrl = `${BASE_URL}${prefixPath}`;
  for (const key of Array.from(cache.keys())) {
    if (key.startsWith(prefixUrl)) {
      cache.delete(key);
    }
  }
}

export async function getAllParentCategories() {
  // Expecting format: { code: 0, result: [{id, name, description, series}, ...] }
  const data = await httpGet('/categories');
  
  // Handle the new API response format
  if (data && data.code === 0 && Array.isArray(data.result)) {
    return data.result;
  }
  
  // Fallback for old format
  return Array.isArray(data) ? data : data?.data || [];
}

export async function getAllSeries(categorySlug) {
  // Backend may accept optional category filter; if not, client groups later
  const qs = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : '';
  const data = await httpGet(`/series${qs}`);
  // Normalize common response shapes
  // Expected: { code: 0, result: [...] } or direct array
  let list = [];
  if (data && data.code === 0 && Array.isArray(data.result)) {
    list = data.result;
  } else if (Array.isArray(data)) {
    list = data;
  } else if (Array.isArray(data?.data)) {
    list = data.data;
  }
  if (list.length === 0) return [];
  // Return flat list for admin usage
  return list;
}

export async function getCategoryById(categoryId) {
  // Get specific category with its series
  const data = await httpGet('/categories');
  
  if (data && data.code === 0 && Array.isArray(data.result)) {
    const category = data.result.find(cat => cat.id === parseInt(categoryId));
    return category || null;
  }
  
  return null;
}

export async function getSeriesByCategoryId(categoryId) {
  // Get series for a specific category
  const category = await getCategoryById(categoryId);
  return category ? category.series || [] : [];
}

export async function updateSeries(id, payload) {
  // Normalize payload fields
  const body = {
    name: payload?.name,
    description: payload?.description || '',
    categoryId: payload?.categoryId ? parseInt(payload.categoryId) : undefined,
  };
  const res = await httpWithBody(`/series/${id}`, 'PUT', body);
  invalidateCacheByPrefix('/series');
  return res;
}

export async function deleteSeries(id) {
  const res = await httpWithBody(`/series/${id}`, 'DELETE');
  invalidateCacheByPrefix('/series');
  return res;
}

export async function createSeries(payload) {
  const body = {
    name: payload?.name,
    description: payload?.description || '',
    categoryId: payload?.categoryId ? parseInt(payload.categoryId) : undefined,
  };
  const res = await httpWithBody(`/series`, 'POST', body);
  invalidateCacheByPrefix('/series');
  return res;
}

