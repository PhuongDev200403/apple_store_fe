// src/utils/api/cartApi.js
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
  const url = `/carts${path}`;
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

// Admin: Lấy tất cả giỏ hàng
export const getAllCarts = async () => {
  const res = await httpGet("");
  return normalizeListResponse(res);
};

// Admin: Lấy giỏ hàng theo userId
export const getCartByUserId = async (userId) => {
  const res = await httpGet(`/${encodeURIComponent(userId)}`);
  return normalizeDetailResponse(res);
};

// User: Lấy giỏ hàng của bản thân
export const getMyCart = async () => {
  try {
    const res = await API.get('/carts/my-cart');
    return normalizeDetailResponse(res.data);
  } catch (error) {
    console.error('Error fetching my cart:', error);
    throw error;
  }
};

// User: Xóa toàn bộ giỏ hàng
export const clearMyCart = async () => {
  try {
    const res = await API.delete('/carts/clear');
    clearCartCache();
    return res.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// User: Xóa một sản phẩm khỏi giỏ hàng
export const removeItemFromCart = async (productVariantId) => {
  try {
    const res = await API.delete(`/carts/${productVariantId}`);
    clearCartCache();
    return res.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

// User: Thêm sản phẩm vào giỏ hàng
export const addToCart = async (productVariantId, quantity = 1) => {
  try {
    const requestBody = {
      productVariantId,
      quantity
    };
    console.log('Add to cart request:', requestBody);
    
    const res = await API.post('/carts', requestBody);
    console.log('Add to cart response:', res.data);
    
    clearCartCache();
    return res.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const clearCartCache = () => cache.clear();

export default API;