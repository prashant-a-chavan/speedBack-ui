import axios from 'axios';
import { clearAuthSession, getAccessToken, triggerUnauthorized } from '../auth/authSession';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  const isLoginRequest = config.url?.includes('/auth/login');

  if (token && !isLoginRequest) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      clearAuthSession();
      triggerUnauthorized();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
