
import axios from 'axios';
const axiosClient = axios.create({
  baseURL:"http://localhost:8080",
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Tự động gắn JWT vào request nếu đã đăng nhập
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosClient;
