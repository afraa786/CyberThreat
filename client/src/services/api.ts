import axios from 'axios';
import {
  LoginRequest,
  LoginResponse,
  SendMessageRequest,
  SendMessageResponse,
  MessagesResponse,
  ApiError
} from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api' 
  : 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sessionToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
    };
    return Promise.reject(apiError);
  }
);

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/login', data);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
};

export const messagesApi = {
  getMessages: async (): Promise<MessagesResponse> => {
    try {
      const response = await apiClient.get<MessagesResponse>('/messages');
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    try {
      const response = await apiClient.post<SendMessageResponse>('/message', data);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
};