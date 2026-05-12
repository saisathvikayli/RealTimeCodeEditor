import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Depending on backend port, fallback to 4000
});

// Interceptor to attach token
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('cc_user') || '{}');
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
