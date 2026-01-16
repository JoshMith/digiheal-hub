import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentApi } from '@/api';
import type { 
  Appointment, 
  CreateAppointmentRequest, 
  UpdateAppointmentRequest,
  PaginationParams,
  Department
} from '@/types/api.types';

// Query keys
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...appointmentKeys.lists(), params] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
  byPatient: (patientId: string, params?: unknown) => 
    [...appointmentKeys.all, 'patient', patientId, params] as const,
  byStaff: (staffId: string, params?: unknown) =>
    [...appointmentKeys.all, 'staff', staffId, params] as const,
  today: (department?: Department) => [...appointmentKeys.all, 'today', department] as const,
  slots: (params: { date: string; department: Department; staffId?: string }) => 
    [...appointmentKeys.all, 'slots', params] as const,
  stats: (params?: Record<string, unknown>) => [...appointmentKeys.all, 'stats', params] as const,
};

// Get appointment by ID
export function useAppointment(appointmentId: string) {
  return useQuery({
    queryKey: appointmentKeys.detail(appointmentId),
    queryFn: async () => {
      const response = await appointmentApi.getById(appointmentId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!appointmentId,
  });
}

// Get patient appointments
export function usePatientAppointments(
  patientId: string, 
  params?: PaginationParams & { status?: string }
) {
  return useQuery({
    queryKey: appointmentKeys.byPatient(patientId, params),
    queryFn: async () => {
      const response = await appointmentApi.getByPatient(patientId, params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!patientId,
  });
}

// Get staff appointments
export function useStaffAppointments(
  staffId: string, 
  params?: PaginationParams & { date?: string }
) {
  return useQuery({
    queryKey: appointmentKeys.byStaff(staffId, params),
    queryFn: async () => {
      const response = await appointmentApi.getByStaff(staffId, params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!staffId,
  });
}

// Get today's appointments by department
export function useTodayAppointments(department?: Department) {
  return useQuery({
    queryKey: appointmentKeys.today(department),
    queryFn: async () => {
      if (department) {
        const response = await appointmentApi.getTodayByDepartment(department);
        if (!response.success) throw new Error(response.message);
        return response.data;
      }
      const response = await appointmentApi.getToday();
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });
}

// Get available time slots
export function useAvailableSlots(params: { 
  date: string; 
  department: Department; 
  staffId?: string 
}) {
  return useQuery({
    queryKey: appointmentKeys.slots(params),
    queryFn: async () => {
      const response = await appointmentApi.getAvailableSlots(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!params.date && !!params.department,
  });
}

// Get appointment stats
export function useAppointmentStats(params?: { 
  startDate?: string; 
  endDate?: string; 
  department?: Department 
}) {
  return useQuery({
    queryKey: appointmentKeys.stats(params),
    queryFn: async () => {
      const response = await appointmentApi.getStats(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });
}

// Create appointment
export function useCreateAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateAppointmentRequest) => {
      const response = await appointmentApi.create(data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}

// Update appointment
export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ appointmentId, data }: { 
      appointmentId: string; 
      data: UpdateAppointmentRequest 
    }) => {
      const response = await appointmentApi.update(appointmentId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, { appointmentId }) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(appointmentId) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}

// Check-in for appointment
export function useCheckInAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await appointmentApi.checkIn(appointmentId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, appointmentId) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(appointmentId) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}

// Start appointment
export function useStartAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await appointmentApi.start(appointmentId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, appointmentId) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(appointmentId) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}

// Complete appointment
export function useCompleteAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ appointmentId, notes }: { appointmentId: string; notes?: string }) => {
      const response = await appointmentApi.complete(appointmentId, notes);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, { appointmentId }) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(appointmentId) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}

// Cancel appointment
export function useCancelAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ appointmentId, reason }: { appointmentId: string; reason?: string }) => {
      const response = await appointmentApi.cancel(appointmentId, reason);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, { appointmentId }) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(appointmentId) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}
