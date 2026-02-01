// ============================================
// DKUT Medical Center - API Client
// Axios instance with JWT interceptors
// ============================================

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse, RefreshTokenResponse } from '../types/api.types';

// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000' || 'https://miffiest-tom-pyramidally.ngrok-free.dev';
const TOKEN_KEY = 'dkut_access_token';
const REFRESH_TOKEN_KEY = 'dkut_refresh_token';

// ============================================
// TOKEN MANAGEMENT
// ============================================

export const tokenManager = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasTokens: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

// ============================================
// AXIOS INSTANCE
// ============================================

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// REQUEST INTERCEPTOR
// Attach JWT token to all requests
// ============================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// Handle token refresh on 401 errors
// ============================================

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints
      if (originalRequest.url?.includes('/auth/login') || 
          originalRequest.url?.includes('/auth/register')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        tokenManager.clearTokens();
        window.location.href = '/auth';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        if (response.data.success && response.data.data) {
          const { token, refreshToken: newRefreshToken } = response.data.data;
          tokenManager.setTokens(token, newRefreshToken);
          processQueue(null, token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        tokenManager.clearTokens();
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// ERROR HANDLING
// ============================================

export class ApiError extends Error {
  status: number;
  errors?: Array<{ field: string; message: string }>;

  constructor(message: string, status: number, errors?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const response = error.response?.data as ApiResponse | undefined;
    return new ApiError(
      response?.message || error.message || 'An unexpected error occurred',
      error.response?.status || 500,
      response?.errors
    );
  }
  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }
  return new ApiError('An unexpected error occurred', 500);
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Make a GET request
 */
export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  try {
    const response = await apiClient.get<ApiResponse<T>>(url, { params });
    if (!response.data.success) {
      throw new ApiError(response.data.message, 400, response.data.errors);
    }
    return response.data.data as T;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Make a POST request
 */
export async function post<T>(url: string, data?: unknown): Promise<T> {
  try {
    const response = await apiClient.post<ApiResponse<T>>(url, data);
    if (!response.data.success) {
      throw new ApiError(response.data.message, 400, response.data.errors);
    }
    return response.data.data as T;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Make a PUT request
 */
export async function put<T>(url: string, data?: unknown): Promise<T> {
  try {
    const response = await apiClient.put<ApiResponse<T>>(url, data);
    if (!response.data.success) {
      throw new ApiError(response.data.message, 400, response.data.errors);
    }
    return response.data.data as T;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Make a PATCH request
 */
export async function patch<T>(url: string, data?: unknown): Promise<T> {
  try {
    const response = await apiClient.patch<ApiResponse<T>>(url, data);
    if (!response.data.success) {
      throw new ApiError(response.data.message, 400, response.data.errors);
    }
    return response.data.data as T;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Make a DELETE request
 */
export async function del<T>(url: string): Promise<T> {
  try {
    const response = await apiClient.delete<ApiResponse<T>>(url);
    if (!response.data.success) {
      throw new ApiError(response.data.message, 400, response.data.errors);
    }
    return response.data.data as T;
  } catch (error) {
    throw handleApiError(error);
  }
}

<<<<<<< HEAD
export default apiClient;
=======
  patch: <T>(endpoint: string, body?: unknown) =>
    fetchApi<T>(endpoint, { method: 'PATCH', body }),

  delete: <T>(endpoint: string, body?: unknown) =>
    fetchApi<T>(endpoint, { method: 'DELETE', body }),
};

export default api;
>>>>>>> e6e6ddedae4b586329dbb3b3e3265dafeeabdb16
