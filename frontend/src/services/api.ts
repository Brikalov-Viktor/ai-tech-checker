import axios from 'axios';
import type {
  User,
  StartInterviewResponse,
  SubmitAnswerResponse,
  CompleteInterviewResponse,
  Interview,
  InterviewStats
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const interviewAPI = {
  start: async (questionsCount: number = 5, subjects?: number[]) => {
    const response = await api.post<StartInterviewResponse>('/interviews/start', {
      questionsCount,
      subjects
    });
    return response.data;
  },
  
  submitAnswer: async (interviewId: string, questionId: number, answer: string) => {
    const response = await api.post<SubmitAnswerResponse>(`/interviews/${interviewId}/answer`, {
      questionId,
      answer
    });
    return response.data;
  },
  
  complete: async (interviewId: string) => {
    const response = await api.post<CompleteInterviewResponse>(`/interviews/${interviewId}/complete`, {});
    return response.data;
  },
  
  getHistory: async (period?: string) => {
    const url = period ? `/interviews?period=${period}` : '/interviews';
    const response = await api.get<{ success: boolean; data: Interview[] }>(url);
    return response.data;
  },
  
  getDetails: async (interviewId: string) => {
    const response = await api.get<{ success: boolean; data: CompleteInterviewResponse['data'] }>(`/interviews/${interviewId}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get<{ success: boolean; data: InterviewStats }>('/interviews/stats');
    return response.data;
  },
};

export default api;