// src/utils/api/categoriesApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const handleResponse = (res) => {
  if (res.data.code === 0) return res.data.result;
  throw new Error(res.data.message || "Lỗi server");
};

export const getCategories = () => API.get("/categories").then(handleResponse);
export const createCategory = (data) => API.post("/categories", data).then(handleResponse);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data).then(handleResponse);
export const deleteCategory = (id) => API.delete(`/categories/${id}`).then(handleResponse);