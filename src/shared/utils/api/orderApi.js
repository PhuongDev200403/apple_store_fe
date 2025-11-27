// src/utils/api/orderApi.js
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
      window.location.href = "/dang-nhap";
    }
    return Promise.reject(error);
  }
);

// Tạo đơn hàng mới (mua ngay) - Cần items trong body
export const createOrder = async (orderData) => {
  try {
    const res = await API.post('/orders', orderData);
    return res.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Checkout từ giỏ hàng - Không cần items (backend lấy từ cart)
export const checkout = async (checkoutData) => {
  try {
    const res = await API.post('/orders/check_out', checkoutData);
    return res.data;
  } catch (error) {
    console.error('Error checkout:', error);
    throw error;
  }
};

// Lấy danh sách đơn hàng của user
export const getMyOrders = async () => {
  try {
    const res = await API.get('/orders/my_orders');
    const data = res.data;
    
    // Normalize response - handle different formats
    if (data && data.code === 0 && Array.isArray(data.result)) {
      return data.result;
    }
    if (Array.isArray(data)) {
      return data;
    }
    if (Array.isArray(data?.data)) {
      return data.data;
    }
    if (Array.isArray(data?.result)) {
      return data.result;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (orderId) => {
  try {
    const res = await API.get(`/orders/${orderId}`);
    const data = res.data;
    
    // Normalize response
    if (data && data.code === 0 && data.result) {
      return data.result;
    }
    if (data?.result) {
      return data.result;
    }
    if (data?.data) {
      return data.data;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Hủy đơn hàng
export const cancelOrder = async (orderId) => {
  try {
    const res = await API.put(`/orders/${orderId}/cancel`);
    return res.data;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

export default API;
