// ============================================
// DKUT Medical Center - Authentication API Service
// ============================================

import { post, get, put, tokenManager } from './client';
import type {
  LoginRequest,
  LoginResponse,
  PatientRegistrationRequest,
  StaffRegistrationRequest,
  ChangePasswordRequest,
  Patient,
  Staff,
  User,
  ApiResponse
} from '../types/api.types';

// ============================================
// AUTH ENDPOINTS
// ============================================

/**
 * Login user (patient or staff)
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await post<LoginResponse>('/auth/login', credentials);
  // Store tokens
  tokenManager.setTokens(response.token, response.refreshToken);
  return response;
};

/**
 * Register new patient
 */
export const registerPatient = async (data: PatientRegistrationRequest): Promise<LoginResponse> => {
  const response = await post<LoginResponse>('/auth/register/patient', data);
  // Store tokens
  tokenManager.setTokens(response.token, response.refreshToken);
  return response;
};

/**
 * Register new staff member
 */
export const registerStaff = async (data: StaffRegistrationRequest): Promise<LoginResponse> => {
  const response = await post<LoginResponse>('/auth/register/staff', data);
  // Store tokens
  tokenManager.setTokens(response.token, response.refreshToken);
  return response;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await post('/auth/logout');
  } finally {
    tokenManager.clearTokens();
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<ApiResponse> => {
  return get<ApiResponse>('/auth/profile');
};

/**
 * Update patient profile
 */
export const updatePatientProfile = async (data: Partial<Patient>): Promise<Patient> => {
  return put<Patient>('/auth/profile/patient', data);
};

/**
 * Update staff profile
 */
export const updateStaffProfile = async (data: Partial<Staff>): Promise<Staff> => {
  return put<Staff>('/auth/profile/staff', data);
};

/**
 * Change password
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await post('/auth/change-password', data);
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  await post('/auth/forgot-password', { email });
};

/**
 * Reset password with token
 */
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await post('/auth/reset-password', { token, newPassword });
};

/**
 * Refresh access token
 */
export const refreshToken = async (): Promise<{ token: string; refreshToken: string }> => {
  const currentRefreshToken = tokenManager.getRefreshToken();
  if (!currentRefreshToken) {
    throw new Error('No refresh token available');
  }
  const response = await post<{ token: string; refreshToken: string }>(
    '/auth/refresh-token',
    { refreshToken: currentRefreshToken }
  );
  tokenManager.setTokens(response.token, response.refreshToken);
  return response;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return tokenManager.hasTokens();
};

// ============================================
// EXPORT API OBJECT
// ============================================

export const authApi = {
  login,
  registerPatient,
  registerStaff,
  logout,
  getProfile,
  updatePatientProfile,
  updateStaffProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
  refreshToken,
  isAuthenticated,
};

export default authApi;