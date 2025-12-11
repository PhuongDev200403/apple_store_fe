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
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      window.location.href = "/dang-nhap";
    }
    return Promise.reject(error);
  }
);

// Lấy thông tin user hiện tại
export const getCurrentUser = async () => {
  try {
    const res = await API.get('/users/my_infor');
    return res.data?.result || res.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

// Cập nhật thông tin user hiện tại
export const updateCurrentUser = async (userData) => {
  try {
    // Get current user ID first
    const currentUser = await getCurrentUser();
    const res = await API.put(`/users/${currentUser.id}`, userData);
    return res.data?.result || res.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Admin: Lấy tất cả users
export const getAllUsers = async () => {
  try {
    const res = await API.get('/users');
    return res.data?.result || res.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Alias cho compatibility
export const getUsers = getAllUsers;

// Admin: Lấy user theo ID
export const getUserById = async (userId) => {
  try {
    const res = await API.get(`/users/${userId}`);
    return res.data?.result || res.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Admin: Cập nhật user
export const updateUser = async (userId, userData) => {
  try {
    const res = await API.put(`/users/${userId}`, userData);
    return res.data?.result || res.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Admin: Tạo user mới
export const createUser = async (userData) => {
  try {
    const res = await API.post('/users', userData);
    return res.data?.result || res.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Admin: Xóa user
export const deleteUser = async (userId) => {
  try {
    const res = await API.delete(`/users/${userId}`);
    return res.data?.result || res.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Cập nhật mật khẩu
export const updatePassword = async (passwordData) => {
  try {
    const res = await API.put('/users/change-password', passwordData);
    return res.data?.result || res.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export default API;