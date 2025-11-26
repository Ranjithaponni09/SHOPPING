import axios from 'axios';
import store from '../store/store';
import { loginSuccess, logout } from '../store/slices/authSlice';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5005';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Add token before request
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ---------- REFRESH TOKEN HANDLING ----------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) =>
    error ? p.reject(error) : p.resolve(token)
  );
  failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;

    if (err.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      const state = store.getState();
      const refreshToken =
        state.auth.refreshToken || localStorage.getItem('refreshToken');

      if (!refreshToken) {
        store.dispatch(logout());
        return Promise.reject(err);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalReq.headers.Authorization = `Bearer ${token}`;
            return api(originalReq);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const resp = await axios.post(`${API_BASE}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefresh, user } = resp.data;

        store.dispatch(
          loginSuccess({
            token: accessToken,
            refreshToken: newRefresh,
            user,
          })
        );

        localStorage.setItem('refreshToken', newRefresh);

        processQueue(null, accessToken);

        originalReq.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalReq);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
