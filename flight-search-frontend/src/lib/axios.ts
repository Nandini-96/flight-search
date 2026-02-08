/// <reference types="vite/client" />
import axios, { AxiosError } from 'axios';
import type { ApiError } from '@/features/flights/types/flight.types';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const apiError: ApiError = {
        message: error.response.data?.message || 'An error occurred',
        code: error.response.data?.code || `HTTP_${error.response.status}`,
        details: error.response.data?.details,
      };
      return Promise.reject(apiError);
    } else if (error.request) {
      // Request made but no response received
      const networkError: ApiError = {
        message: 'Unable to connect to the server. Please check your internet connection.',
        code: 'NETWORK_ERROR',
      };
      return Promise.reject(networkError);
    } else {
      // Something else happened
      const unknownError: ApiError = {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      };
      return Promise.reject(unknownError);
    }
  }
);

export default apiClient;