// src/utils/api/wishlistApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động thêm token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý 401 → logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Cache
const cache = new Map();

const httpGet = async (path) => {
  const url = `/wishlist${path}`;
  if (cache.has(url)) return cache.get(url);

  // eslint-disable-next-line no-useless-catch
  try {
    const res = await API.get(url);
    const data = res.data;
    cache.set(url, data);
    return data;
  } catch (err) {
    throw err;
  }
};

// Normalize danh sách
const normalizeListResponse = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.result)) return res.result;
  if (Array.isArray(res?.data?.result)) return res.data.result;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};

// Normalize chi tiết → chỉ trả về result
const normalizeDetailResponse = (res) => {
  return res?.result || res?.data?.result || res?.data || res || {};
};

// API functions

// Admin: Lấy tất cả wishlist
export const getAllWishlists = async () => {
  const res = await httpGet("");
  return normalizeListResponse(res);
};

// Admin: Lấy wishlist theo userId
export const getWishlistByUserId = async (userId) => {
  const res = await httpGet(`/${encodeURIComponent(userId)}`);
  return normalizeDetailResponse(res);
};

// User: Lấy wishlist của bản thân
export const getMyWishlist = async () => {
  try {
    const res = await API.get('/wishlist/my-wishlist');
    return normalizeDetailResponse(res.data);
  } catch (error) {
    console.error('Error fetching my wishlist:', error);
    throw error;
  }
};

// User: Thêm sản phẩm vào wishlist
export const addToWishlist = async (productVariantId) => {
  try {
    const requestBody = {
      productVariantId
    };
    console.log('Add to wishlist request:', requestBody);
    
    const res = await API.post('/wishlist', requestBody);
    console.log('Add to wishlist response:', res.data);
    
    clearWishlistCache();
    return res.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// User: Xóa một sản phẩm khỏi wishlist
export const removeItemFromWishlist = async (productVariantId) => {
  try {
    const res = await API.delete(`/wishlist/my-wishlist/${productVariantId}`);
    clearWishlistCache();
    return res.data;
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    throw error;
  }
};

// User: Xóa toàn bộ wishlist
export const clearMyWishlist = async () => {
  try {
    const res = await API.put('/wishlist/my-wishlist/clear');
    clearWishlistCache();
    return res.data;
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    throw error;
  }
};

export const clearWishlistCache = () => cache.clear();

export default API;