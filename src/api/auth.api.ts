import api, { setTokens, clearTokens } from './client';
import { AuthResponse, LoginRequest, PatientRegistrationRequest, StaffRegistrationRequest,  ChangePasswordRequest, User, Patient, Staff, ApiResponse} from '@/types/api.types';

// Response types for specific endpoints
interface ProfileResponse {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string | null;
  patient?: Patient | null;
  staff?: Staff | null;
  profile?: Patient | Staff | null;
}

interface PatientRegistrationResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  patient: {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
  };
  token: string;
  refreshToken: string;
}

interface StaffRegistrationResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  staff: {
    id: string;
    staffId: string;
    firstName: string;
    lastName: string;
    department: string;
    position: string;
  };
  token: string;
  refreshToken: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  profile: Patient | Staff | null;
  token: string;
  refreshToken: string;
}

interface TokenRefreshResponse {
  token: string;
  refreshToken: string;
}

export const authApi = {
  /**
   * Register a new patient
   */
  registerPatient: async (data: PatientRegistrationRequest): Promise<ApiResponse<PatientRegistrationResponse>> => {
    const response = await api.post<PatientRegistrationResponse>('/auth/register/patient', data);
    
    if (response.success && response.data) {
      setTokens(response.data.token, response.data.refreshToken);
    }
    
    return response;
  },

  /**
   * Register a new staff member
   */
  registerStaff: async (data: StaffRegistrationRequest): Promise<ApiResponse<StaffRegistrationResponse>> => {
    const response = await api.post<StaffRegistrationResponse>('/auth/register/staff', data);
    
    if (response.success && response.data) {
      setTokens(response.data.token, response.data.refreshToken);
    }
    
    return response;
  },

  /**
   * Login (works for both patients and staff)
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    
    if (response.success && response.data) {
      setTokens(response.data.token, response.data.refreshToken);
    }
    
    return response;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ApiResponse<ProfileResponse>> => {
    return api.get<ProfileResponse>('/auth/me');
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<Patient | Staff>): Promise<ApiResponse<Patient | Staff>> => {
    return api.put<Patient | Staff>('/auth/profile', data);
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
    return api.put<void>('/auth/change-password', data);
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<TokenRefreshResponse>> => {
    const response = await api.post<TokenRefreshResponse>('/auth/refresh-token', { refreshToken });
    
    if (response.success && response.data) {
      setTokens(response.data.token, response.data.refreshToken);
    }
    
    return response;
  },

  /**
   * Logout
   */
  logout: async (): Promise<ApiResponse<void>> => {
    try {
      await api.post<void>('/auth/logout');
    } catch {
      // Even if the API call fails, clear local tokens
    }
    clearTokens();
    return { success: true, message: 'Logged out successfully' };
  },

  /**
   * Deactivate account
   */
  deactivateAccount: async (password: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<void>('/auth/account', { password });
    
    if (response.success) {
      clearTokens();
    }
    
    return response;
  },

  /**
   * Change user role (Admin only)
   */
  changeUserRole: async (userId: string, newRole: 'PATIENT' | 'STAFF' | 'ADMIN'): Promise<ApiResponse<User>> => {
    return api.put<User>(`/auth/users/${userId}/role`, { newRole });
  },
};

export default authApi;