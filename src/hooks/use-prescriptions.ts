import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prescriptionApi } from '@/api';
import type { 
  Prescription, 
  CreatePrescriptionRequest, 
  UpdatePrescriptionRequest,
  PaginationParams,
  PrescriptionStatus
} from '@/types/api.types';

// Query keys
export const prescriptionKeys = {
  all: ['prescriptions'] as const,
  lists: () => [...prescriptionKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...prescriptionKeys.lists(), params] as const,
  details: () => [...prescriptionKeys.all, 'detail'] as const,
  detail: (id: string) => [...prescriptionKeys.details(), id] as const,
  byPatient: (patientId: string, params?: unknown) => 
    [...prescriptionKeys.all, 'patient', patientId, params] as const,
  byStaff: (staffId: string, params?: unknown) => 
    [...prescriptionKeys.all, 'staff', staffId, params] as const,
  active: (params?: PaginationParams) => [...prescriptionKeys.all, 'active', params] as const,
  expiring: (params?: unknown) => [...prescriptionKeys.all, 'expiring', params] as const,
  stats: (params?: Record<string, unknown>) => [...prescriptionKeys.all, 'stats', params] as const,
};

// Get prescription by ID
export function usePrescription(prescriptionId: string) {
  return useQuery({
    queryKey: prescriptionKeys.detail(prescriptionId),
    queryFn: async () => {
      const response = await prescriptionApi.getById(prescriptionId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!prescriptionId,
  });
}

// Get patient prescriptions
export function usePatientPrescriptions(
  patientId: string, 
  params?: PaginationParams & { status?: PrescriptionStatus }
) {
  return useQuery({
    queryKey: prescriptionKeys.byPatient(patientId, params),
    queryFn: async () => {
      const response = await prescriptionApi.getByPatient(patientId, params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!patientId,
  });
}

// Get staff prescriptions
export function useStaffPrescriptions(staffId: string, params?: PaginationParams) {
  return useQuery({
    queryKey: prescriptionKeys.byStaff(staffId, params),
    queryFn: async () => {
      const response = await prescriptionApi.getByStaff(staffId, params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!staffId,
  });
}

// Get active prescriptions
export function useActivePrescriptions(params?: PaginationParams) {
  return useQuery({
    queryKey: prescriptionKeys.active(params),
    queryFn: async () => {
      const response = await prescriptionApi.getActive(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });
}

// Get expiring prescriptions
export function useExpiringPrescriptions(params?: PaginationParams & { days?: number }) {
  return useQuery({
    queryKey: prescriptionKeys.expiring(params),
    queryFn: async () => {
      const response = await prescriptionApi.getExpiring(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });
}

// Get prescription stats
export function usePrescriptionStats(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: prescriptionKeys.stats(params),
    queryFn: async () => {
      const response = await prescriptionApi.getStats(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });
}

// Create prescription
export function useCreatePrescription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreatePrescriptionRequest) => {
      const response = await prescriptionApi.create(data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.active() });
    },
  });
}

// Update prescription
export function useUpdatePrescription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ prescriptionId, data }: { 
      prescriptionId: string; 
      data: UpdatePrescriptionRequest 
    }) => {
      const response = await prescriptionApi.update(prescriptionId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, { prescriptionId }) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.detail(prescriptionId) });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
    },
  });
}

// Dispense prescription
export function useDispensePrescription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (prescriptionId: string) => {
      const response = await prescriptionApi.dispense(prescriptionId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, prescriptionId) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.detail(prescriptionId) });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.active() });
    },
  });
}

// Complete prescription
export function useCompletePrescription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (prescriptionId: string) => {
      const response = await prescriptionApi.complete(prescriptionId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, prescriptionId) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.detail(prescriptionId) });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.active() });
    },
  });
}

// Cancel prescription
export function useCancelPrescription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ prescriptionId, reason }: { prescriptionId: string; reason?: string }) => {
      const response = await prescriptionApi.cancel(prescriptionId, reason);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, { prescriptionId }) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.detail(prescriptionId) });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.active() });
    },
  });
}
