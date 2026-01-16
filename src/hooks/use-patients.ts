import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientApi } from '@/api';
import type { 
  Patient, 
  PaginationParams, 
  VitalSigns, 
  CreateVitalSignsRequest 
} from '@/types/api.types';

// Query keys
export const patientKeys = {
  all: ['patients'] as const,
  lists: () => [...patientKeys.all, 'list'] as const,
  list: (params?: PaginationParams & { search?: string }) => [...patientKeys.lists(), params] as const,
  details: () => [...patientKeys.all, 'detail'] as const,
  detail: (id: string) => [...patientKeys.details(), id] as const,
  byStudentId: (studentId: string) => [...patientKeys.all, 'student', studentId] as const,
  history: (id: string) => [...patientKeys.all, 'history', id] as const,
  stats: (id: string) => [...patientKeys.all, 'stats', id] as const,
  vitalSigns: (id: string) => [...patientKeys.all, 'vitals', id] as const,
};

// Get all patients (staff/admin)
export function usePatients(params?: PaginationParams & { search?: string }) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: async () => {
      const response = await patientApi.getAll(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });
}

// Get patient by ID
export function usePatient(patientId: string) {
  return useQuery({
    queryKey: patientKeys.detail(patientId),
    queryFn: async () => {
      const response = await patientApi.getById(patientId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!patientId,
  });
}

// Get patient by student ID
export function usePatientByStudentId(studentId: string) {
  return useQuery({
    queryKey: patientKeys.byStudentId(studentId),
    queryFn: async () => {
      const response = await patientApi.getByStudentId(studentId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!studentId,
  });
}

// Get patient medical history
export function usePatientHistory(patientId: string) {
  return useQuery({
    queryKey: patientKeys.history(patientId),
    queryFn: async () => {
      const response = await patientApi.getHistory(patientId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!patientId,
  });
}

// Get patient stats
export function usePatientStats(patientId: string) {
  return useQuery({
    queryKey: patientKeys.stats(patientId),
    queryFn: async () => {
      const response = await patientApi.getStats(patientId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!patientId,
  });
}

// Get patient vital signs
export function usePatientVitalSigns(patientId: string) {
  return useQuery({
    queryKey: patientKeys.vitalSigns(patientId),
    queryFn: async () => {
      const response = await patientApi.getVitalSigns(patientId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!patientId,
  });
}

// Update patient
export function useUpdatePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ patientId, data }: { patientId: string; data: Partial<Patient> }) => {
      const response = await patientApi.update(patientId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
}

// Add vital signs
export function useAddVitalSigns() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ patientId, data }: { 
      patientId: string; 
      data: Omit<CreateVitalSignsRequest, 'patientId'> 
    }) => {
      const response = await patientApi.addVitalSigns(patientId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.vitalSigns(patientId) });
    },
  });
}

// Search patients
export function useSearchPatients(query: string) {
  return useQuery({
    queryKey: patientKeys.list({ search: query }),
    queryFn: async () => {
      const response = await patientApi.search(query);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: query.length >= 2,
  });
}
