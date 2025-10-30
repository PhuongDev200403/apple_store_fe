import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🟢 Gắn token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Đúng endpoint backend
export const getCategoryChildren = () => API.get("/series");
export const getCategoryChildById = (id) => API.get(`/series/${id}`);
export const createCategoryChild = (data) => API.post("/series", data);
export const updateCategoryChild = (id, data) => API.put(`/series/${id}`, data);
export const deleteCategoryChild = (id) => API.delete(`/series/${id}`);
export const getByCategory = (categoryId) => API.get(`/series/category/${categoryId}`);

export default API;
