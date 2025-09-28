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
  // Normalize to array of groups: [{title, items:[{name,slug}]}]
  const list = Array.isArray(data) ? data : data?.data || [];
  if (list.length === 0) return [];

  // If server already groups, passthrough
  if (list[0]?.items || list[0]?.children) return list;

  // Otherwise group by `group` or `series` field
  const byGroup = {};
  for (const item of list) {
    const groupName = item.group || item.series || 'Khác';
    if (!byGroup[groupName]) byGroup[groupName] = [];
    byGroup[groupName].push({ id: item.id, slug: item.slug, name: item.name });
  }
  return Object.entries(byGroup).map(([title, items]) => ({ title, items }));
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

