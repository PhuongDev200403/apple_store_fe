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

// Normalize response
const normalizeResponse = (res) => {
  if (res.data?.code === 0) return res.data.result;
  if (Array.isArray(res.data?.result)) return res.data.result;
  if (Array.isArray(res.data)) return res.data;
  return res.data?.result || res.data || {};
};

// Admin: Lấy tất cả tin tức
export const getAllNews = async () => {
  try {
    const res = await API.get('/news');
    return normalizeResponse(res);
  } catch (error) {
    console.error('Error fetching all news:', error);
    throw error;
  }
};

// Public: Lấy tin tức nổi bật
export const getFeaturedNews = async () => {
  try {
    const res = await API.get('/news/is_featured');
    return normalizeResponse(res);
  } catch (error) {
    console.error('Error fetching featured news:', error);
    throw error;
  }
};

// Public: Lấy tin tức đang hoạt động
export const getActiveNews = async () => {
  try {
    const res = await API.get('/news/is_active');
    return normalizeResponse(res);
  } catch (error) {
    console.error('Error fetching active news:', error);
    throw error;
  }
};

// Admin: Tạo tin tức mới (với file upload)
export const createNews = async (formData) => {
  try {
    const res = await API.post('/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return normalizeResponse(res);
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};

// Admin: Cập nhật tin tức
export const updateNews = async (id, formData) => {
  try {
    const res = await API.put(`/news/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return normalizeResponse(res);
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
};

// Admin: Xóa tin tức
export const deleteNews = async (id) => {
  try {
    const res = await API.delete(`/news/${id}`);
    return normalizeResponse(res);
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
};

// Public: Lấy chi tiết tin tức
export const getNewsById = async (id) => {
  try {
    const res = await API.get(`/news/${id}`);
    return normalizeResponse(res);
  } catch (error) {
    console.error('Error fetching news by id:', error);
    throw error;
  }
};

export default API;
