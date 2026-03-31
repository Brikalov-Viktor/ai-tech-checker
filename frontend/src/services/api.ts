import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  name: string;
  login: string;
  role: string;
  grade?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export const authAPI = {
  register: async (login: string, password: string, name: string) => {
    const response = await api.post<AuthResponse>('/auth/register', { login, password, name });
    return response.data;
  },
  
  login: async (login: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', { login, password });
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get<{ success: boolean; data: User }>('/auth/me');
    return response.data;
  },
  
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', { oldPassword, newPassword });
    return response.data;
  },
};

export default api;