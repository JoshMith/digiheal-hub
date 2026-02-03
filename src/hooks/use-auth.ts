import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { tokenManager } from '@/api/client';
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
    enabled: !!tokenManager.getAccessToken(),
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

      return response;
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
  
      return response;
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
      
      return response;
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
      tokenManager.clearTokens();
      queryClient.clear();
    },
  });
}

/**
 * Hook for updating profile
 */
export function useUpdatePatientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Patient | Staff>) => {
      const response = await authApi.updatePatientProfile(data);
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

export function useUpdateStaffProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Patient | Staff>) => {
      const response = await authApi.updateStaffProfile(data);
      
      return response;
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
      
      return response;
    },
  });
}
