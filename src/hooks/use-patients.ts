import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientApi } from '@/api';
import type { 
  Patient, 
  UpdatePatientRequest,
  VitalSigns, 
  CreateVitalSignsRequest,
  PaginationParams
} from '@/types/api.types';

// Query keys
export const patientKeys = {
  all: ['patients'] as const,
  lists: () => [...patientKeys.all, 'list'] as const,
  list: (params?: PaginationParams & { search?: string }) => [...patientKeys.lists(), params] as const,
  details: () => [...patientKeys.all, 'detail'] as const,
  detail: (id: string) => [...patientKeys.details(), id] as const,
  byStudentId: (studentId: string) => [...patientKeys.all, 'student', studentId] as const,
  history: (id: string, params?: unknown) => [...patientKeys.all, 'history', id, params] as const,
  stats: (id: string) => [...patientKeys.all, 'stats', id] as const,
  vitalSigns: (id: string, params?: unknown) => [...patientKeys.all, 'vitals', id, params] as const,
  appointments: (id: string, params?: unknown) => [...patientKeys.all, 'appointments', id, params] as const,
  prescriptions: (id: string, params?: unknown) => [...patientKeys.all, 'prescriptions', id, params] as const,
};

// Get all patients (staff/admin)
export function usePatients(params?: PaginationParams & { search?: string }) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => patientApi.getAllPatients(params),
  });
}

// Get patient by ID
export function usePatient(patientId: string) {
  return useQuery({
    queryKey: patientKeys.detail(patientId),
    queryFn: () => patientApi.getPatient(patientId),
    enabled: !!patientId,
  });
}

// Get current patient profile (for logged-in patient)
export function useMyProfile() {
  return useQuery({
    queryKey: patientKeys.detail('me'),
    queryFn: () => patientApi.getMyProfile(),
  });
}

// Get patient by student ID
export function usePatientByStudentId(studentId: string) {
  return useQuery({
    queryKey: patientKeys.byStudentId(studentId),
    queryFn: async () => {
      // Note: This endpoint may not exist in backend, might need to use search
      return patientApi.getAllPatients({ search: studentId });
    },
    enabled: !!studentId,
  });
}

// Get patient medical history
export function usePatientHistory(patientId: string, params?: PaginationParams) {
  return useQuery({
    queryKey: patientKeys.history(patientId, params),
    queryFn: () => patientApi.getPatientMedicalHistory(patientId),
    enabled: !!patientId,
  });
}

// Get patient stats
export function usePatientStats(patientId: string) {
  return useQuery({
    queryKey: patientKeys.stats(patientId),
    queryFn: () => patientApi.getPatientStats(patientId),
    enabled: !!patientId,
  });
}

// Get patient vital signs
export function usePatientVitalSigns(patientId: string, params?: { 
  page?: number; 
  limit?: number;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: patientKeys.vitalSigns(patientId, params),
    queryFn: () => patientApi.getPatientVitals(patientId, params),
    enabled: !!patientId,
  });
}

// Get latest vital signs
export function useLatestVitalSigns(patientId: string) {
  return useQuery({
    queryKey: [...patientKeys.vitalSigns(patientId), 'latest'] as const,
    queryFn: () => patientApi.getLatestVitals(patientId),
    enabled: !!patientId,
  });
}

// Get patient appointments
export function usePatientAppointments(patientId: string, params?: {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  upcoming?: boolean;
}) {
  return useQuery({
    queryKey: patientKeys.appointments(patientId, params),
    queryFn: () => patientApi.getPatientAppointments(patientId, params),
    enabled: !!patientId,
  });
}

// Get my appointments (for logged-in patient)
export function useMyAppointments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  upcoming?: boolean;
}) {
  return useQuery({
    queryKey: patientKeys.appointments('me', params),
    queryFn: () => patientApi.getMyAppointments(params),
  });
}

// Get patient prescriptions
export function usePatientPrescriptions(patientId: string, params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: patientKeys.prescriptions(patientId, params),
    queryFn: () => patientApi.getPatientPrescriptions(patientId, params),
    enabled: !!patientId,
  });
}

// Get my prescriptions (for logged-in patient)
export function useMyPrescriptions(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: patientKeys.prescriptions('me', params),
    queryFn: () => patientApi.getMyPrescriptions(params),
  });
}

// Update patient
export function useUpdatePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ patientId, data }: { 
      patientId: string; 
      data: UpdatePatientRequest 
    }) => patientApi.updatePatient(patientId, data),
    onSuccess: (_, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
}

// Create patient (admin/staff only)
export function useCreatePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Patient>) => patientApi.createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
}

// Add vital signs
export function useAddVitalSigns() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ patientId, data }: { 
      patientId: string; 
      data: Omit<CreateVitalSignsRequest, 'patientId'> 
    }) => patientApi.createVitalSigns(patientId, data),
    onSuccess: (_, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.vitalSigns(patientId) });
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
    },
  });
}

// Search patients
export function useSearchPatients(query: string) {
  return useQuery({
    queryKey: patientKeys.list({ search: query }),
    queryFn: () => patientApi.searchPatients({ search: query }),
    enabled: query.length >= 2,
  });
}