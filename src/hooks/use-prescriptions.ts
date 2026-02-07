import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { prescriptionApi } from '@/api';
import { 
  CreatePrescriptionRequest, 
  UpdatePrescriptionRequest,
  Prescription,
  PrescriptionStatus,
  PaginationParams
} from '@/types/api.types';
import { extractArray } from '@/utils/api-helpers';

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
  byAppointment: (appointmentId: string) =>
    [...prescriptionKeys.all, 'appointment', appointmentId] as const,
  active: (patientId?: string) => [...prescriptionKeys.all, 'active', patientId] as const,
  queue: () => [...prescriptionKeys.all, 'queue'] as const,
  stats: (params?: Record<string, unknown>) => [...prescriptionKeys.all, 'stats', params] as const,
};

// Get prescription by ID
export function usePrescription(prescriptionId: string) {
  return useQuery({
    queryKey: prescriptionKeys.detail(prescriptionId),
    queryFn: () => prescriptionApi.getPrescription(prescriptionId),
    enabled: !!prescriptionId,
  });
}

// Get patient prescriptions - safely extracted as array
export function usePatientPrescriptions(
  patientId: string, 
  params?: {
    page?: number;
    limit?: number;
    status?: PrescriptionStatus;
  }
) {
  return useQuery({
    queryKey: prescriptionKeys.byPatient(patientId, params),
    queryFn: async () => {
      const response = await prescriptionApi.getPatientPrescriptions(patientId, params);
      return extractArray<Prescription>(response);
    },
    enabled: !!patientId,
  });
}

// Get staff prescriptions
export function useStaffPrescriptions(staffId: string, params?: PaginationParams) {
  return useQuery({
    queryKey: prescriptionKeys.byStaff(staffId, params),
    queryFn: () => prescriptionApi.getPrescriptions({ staffId, ...params }),
    enabled: !!staffId,
  });
}

// Get appointment prescriptions
export function useAppointmentPrescriptions(appointmentId: string) {
  return useQuery({
    queryKey: prescriptionKeys.byAppointment(appointmentId),
    queryFn: () => prescriptionApi.getAppointmentPrescriptions(appointmentId),
    enabled: !!appointmentId,
  });
}

// Get active prescriptions for a patient
export function useActivePrescriptions(patientId?: string) {
  return useQuery({
    queryKey: prescriptionKeys.active(patientId),
    queryFn: async () => {
      if (patientId) {
        const data = await prescriptionApi.getActivePrescriptions(patientId);
        // Convert Prescription[] to PaginatedResponse<Prescription>
        return {
          data,
          meta: {
            total: data.length,
            page: 1,
            limit: data.length,
            totalPages: 1,
          },
          success: true,
          message: 'Active prescriptions fetched successfully',
        };
      } else {
        // This already returns PaginatedResponse<Prescription>
        return prescriptionApi.getPrescriptions({ status: PrescriptionStatus.ACTIVE });
      }
    },
  });
}

// Get pharmacy queue
export function usePharmacyQueue() {
  return useQuery({
    queryKey: prescriptionKeys.queue(),
    queryFn: () => prescriptionApi.getPharmacyQueue(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

// Get prescription stats
export function usePrescriptionStats(params?: { 
  startDate?: string; 
  endDate?: string;
  staffId?: string;
}) {
  return useQuery({
    queryKey: prescriptionKeys.stats(params),
    queryFn: () => prescriptionApi.getPrescriptionStats(params),
  });
}

// Create prescription
export function useCreatePrescription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePrescriptionRequest) => 
      prescriptionApi.createPrescription(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.byPatient(data.patientId) });
      if (data.appointmentId) {
        queryClient.invalidateQueries({ 
          queryKey: prescriptionKeys.byAppointment(data.appointmentId) 
        });
      }
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.active() });
    },
  });
}

// Update prescription
export function useUpdatePrescription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ prescriptionId, data }: { 
      prescriptionId: string; 
      data: UpdatePrescriptionRequest 
    }) => prescriptionApi.updatePrescription(prescriptionId, data),
    onSuccess: (data, { prescriptionId }) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.detail(prescriptionId) });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.byPatient(data.patientId) });
    },
  });
}

// Dispense prescription
export function useDispensePrescription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (prescriptionId: string) => 
      prescriptionApi.dispensePrescription(prescriptionId),
    onSuccess: (data, prescriptionId) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.detail(prescriptionId) });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.queue() });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.active(data.patientId) });
    },
  });
}

// Complete prescription
export function useCompletePrescription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (prescriptionId: string) => 
      prescriptionApi.completePrescription(prescriptionId),
    onSuccess: (data, prescriptionId) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.detail(prescriptionId) });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.active(data.patientId) });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.stats() });
    },
  });
}

// Cancel prescription
export function useCancelPrescription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ prescriptionId, reason }: { 
      prescriptionId: string; 
      reason?: string 
    }) => prescriptionApi.cancelPrescription(prescriptionId, reason),
    onSuccess: (data, { prescriptionId }) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.detail(prescriptionId) });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.active(data.patientId) });
    },
  });
}

// Request refill
export function useRequestRefill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (prescriptionId: string) => 
      prescriptionApi.requestRefill(prescriptionId),
    onSuccess: (_, prescriptionId) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.detail(prescriptionId) });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
    },
  });
}

// Approve refill
export function useApproveRefill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (prescriptionId: string) => 
      prescriptionApi.approveRefill(prescriptionId),
    onSuccess: (_, prescriptionId) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.detail(prescriptionId) });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
    },
  });
}

// Deny refill
export function useDenyRefill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ prescriptionId, reason }: { 
      prescriptionId: string; 
      reason: string 
    }) => prescriptionApi.denyRefill(prescriptionId, reason),
    onSuccess: (_, { prescriptionId }) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.detail(prescriptionId) });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
    },
  });
}