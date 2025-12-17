import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { getToken, clearTokens } from '@/api/client';
import { LoginRequest, PatientRegistrationRequest, StaffRegistrationRequest, ChangePasswordRequest, Patient, Staff} from '@/types/api.types';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

/**
 * Hook to get current user profile
 */
export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await authApi.getProfile();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch profile');
      }
      return response.data;
    },
    enabled: !!getToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

/**
 * Hook for patient login
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await authApi.login(data);
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

/**
 * Hook for patient registration
 */
export function usePatientRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PatientRegistrationRequest) => {
      const response = await authApi.registerPatient(data);
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

/**
 * Hook for staff registration
 */
export function useStaffRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StaffRegistrationRequest) => {
      const response = await authApi.registerStaff(data);
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

/**
 * Hook for logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
    },
    onError: () => {
      // Even on error, clear tokens and queries
      clearTokens();
      queryClient.clear();
    },
  });
}

/**
 * Hook for updating profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Patient | Staff>) => {
      const response = await authApi.updateProfile(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update profile');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

/**
 * Hook for changing password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await authApi.changePassword(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to change password');
      }
      return response;
    },
  });
}

/**
 * Hook for deactivating account
 */
export function useDeactivateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      const response = await authApi.deactivateAccount(password);
      if (!response.success) {
        throw new Error(response.message || 'Failed to deactivate account');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

/**
 * Hook for changing user role (Admin only)
 */
export function useChangeUserRole() {
  return useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: 'PATIENT' | 'STAFF' | 'ADMIN' }) => {
      const response = await authApi.changeUserRole(userId, newRole);
      if (!response.success) {
        throw new Error(response.message || 'Failed to change user role');
      }
      return response.data;
    },
  });
}