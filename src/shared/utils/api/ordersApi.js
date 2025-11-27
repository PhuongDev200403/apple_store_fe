import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động thêm token vào mọi request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi chung (tùy chọn)
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

// API functions
export const getAllOrders = () => API.get("/orders");

export const updateOrderStatus = (orderId, newStatus) =>
  API.put(`/orders/${orderId}/status`, null, {
    params: { newStatus },
  });

// Export default nếu cần
export default API;