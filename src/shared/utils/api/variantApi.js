const BASE_URL = 'http://localhost:8080/api';
const cache = new Map();

async function httpGet(path) {
  const url = `${BASE_URL}${path}`;
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const data = await res.json();
  cache.set(url, data);
  return data;
}

async function httpPost(path, body) {
  const url = `${BASE_URL}${path}`;
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || `Request failed: ${res.status}`;
    const error = new Error(message);
    error.code = data?.code;
    throw error;
  }
  return data;
}

async function httpPut(path, body) {
  const url = `${BASE_URL}${path}`;
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || `Request failed: ${res.status}`;
    const error = new Error(message);
    error.code = data?.code;
    throw error;
  }
  return data;
}

async function httpDelete(path) {
  const url = `${BASE_URL}${path}`;
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.status === 204 ? null : await res.json();
}

async function httpMultipart(path, method, formData) {
  const url = `${BASE_URL}${path}`;
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || `Request failed: ${res.status}`;
    const error = new Error(message);
    error.code = data?.code;
    throw error;
  }
  return data;
}

function normalizeList(data) {
  return (data?.code === 0 && Array.isArray(data.result)) ? data.result :
         Array.isArray(data) ? data :
         Array.isArray(data?.data) ? data.data : [];
}

function invalidateCacheByPrefix(prefix) {
  const prefixUrl = `${BASE_URL}${prefix}`;
  for (const key of Array.from(cache.keys())) {
    if (key.startsWith(prefixUrl)) cache.delete(key);
  }
}

export async function getVariants() {
  const data = await httpGet('/variants');
  return normalizeList(data);
}

export async function getAllVariants() {
  return getVariants();
}

export async function getVariantsBySeries(seriesId) {
  const data = await httpGet(`/variants/series/${seriesId}`);
  return normalizeList(data);
}

export async function getVariantById(variantId) {
  const data = await httpGet(`/variants/detail/${variantId}`);
  if (data?.code === 0 && data.result) return data.result;
  if (data?.result) return data.result;
  if (data?.data) return data.data;
  return data;
}

export async function createVariant(body) {
  const res = await httpPost('/variants', body);
  invalidateCacheByPrefix('/variants');
  return res;
}

export async function updateVariant(id, body) {
  const res = await httpPut(`/variants/${id}`, body);
  invalidateCacheByPrefix('/variants');
  return res;
}

export async function deleteVariant(id) {
  const res = await httpDelete(`/variants/${id}`);
  invalidateCacheByPrefix('/variants');
  return res;
}

export async function createVariantWithImage(formData) {
  const res = await httpMultipart('/variants', 'POST', formData);
  invalidateCacheByPrefix('/variants');
  return res;
}

export const clearVariantCache = () => invalidateCacheByPrefix('/variants');
