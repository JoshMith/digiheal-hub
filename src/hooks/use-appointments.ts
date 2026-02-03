import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentApi } from "@/api";
import { post } from "@/api/client";
import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  CancelAppointmentRequest,
  Department,
  AppointmentStatus,
  PaginationParams,
  PredictAppointmentDurationRequest,
  MLPredictionResponse,
} from "@/types/api.types";

// Cache durations to prevent rate limiting
const STALE_TIME = 2 * 60 * 1000; // 2 minutes
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Query keys
export const appointmentKeys = {
  all: ["appointments"] as const,
  lists: () => [...appointmentKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...appointmentKeys.lists(), params] as const,
  details: () => [...appointmentKeys.all, "detail"] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
  byPatient: (patientId: string, params?: unknown) =>
    [...appointmentKeys.all, "patient", patientId, params] as const,
  byStaff: (staffId: string, params?: unknown) =>
    [...appointmentKeys.all, "staff", staffId, params] as const,
  today: (department?: Department) =>
    [...appointmentKeys.all, "today", department] as const,
  slots: (params: { date: string; department: Department; staffId?: string }) =>
    [...appointmentKeys.all, "slots", params] as const,
  stats: (params?: Record<string, unknown>) =>
    [...appointmentKeys.all, "stats", params] as const,
};

// Get appointment by ID
export function useAppointment(appointmentId: string) {
  return useQuery({
    queryKey: appointmentKeys.detail(appointmentId),
    queryFn: () => appointmentApi.getAppointment(appointmentId),
    enabled: !!appointmentId,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });
}

// Get patient appointments
export function usePatientAppointments(
  patientId: string,
  params?: PaginationParams & { status?: AppointmentStatus },
) {
  return useQuery({
    queryKey: appointmentKeys.byPatient(patientId, params),
    queryFn: () =>
      appointmentApi.getAppointments({
        patientId,
        ...params,
      }),
    enabled: !!patientId,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });
}

// Get staff appointments
export function useStaffAppointments(
  staffId: string,
  params?: PaginationParams & { date?: string; status?: AppointmentStatus },
) {
  return useQuery({
    queryKey: appointmentKeys.byStaff(staffId, params),
    queryFn: () =>
      appointmentApi.getAppointments({
        staffId,
        ...params,
      }),
    enabled: !!staffId,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });
}

// Get today's appointments by department
export function useTodayAppointments(department?: string) {
  return useQuery({
    queryKey: appointmentKeys.today(department as Department),
    queryFn: () =>
      department
        ? appointmentApi.getTodayAppointments({
            department: department as Department,
          })
        : appointmentApi.getTodayAppointments(),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

// Get available time slots
export function useAvailableSlots(params: {
  date: string;
  department: Department;
  staffId?: string;
  duration?: number;
}) {
  return useQuery({
    queryKey: appointmentKeys.slots(params),
    queryFn: () => appointmentApi.getAvailableSlots(params),
    enabled: !!params.date && !!params.department,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });
}

// Get appointment stats
export function useAppointmentStats(params?: {
  startDate?: string;
  endDate?: string;
  department?: Department;
}) {
  return useQuery({
    queryKey: appointmentKeys.stats(params),
    queryFn: () => appointmentApi.getAppointmentStats(params),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

// Create appointment
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) =>
      appointmentApi.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.stats() });
    },
  });
}

// Update appointment
export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      data,
    }: {
      appointmentId: string;
      data: UpdateAppointmentRequest;
    }) => appointmentApi.updateAppointment(appointmentId, data),
    onSuccess: (_, { appointmentId }) => {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(appointmentId),
      });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() });
    },
  });
}

// Check-in for appointment
export function useCheckInAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) =>
      appointmentApi.checkInAppointment(appointmentId),
    onSuccess: (_, appointmentId) => {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(appointmentId),
      });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() });
    },
  });
}

// Start appointment
export function useStartAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) =>
      appointmentApi.startAppointment(appointmentId),
    onSuccess: (_, appointmentId) => {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(appointmentId),
      });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() });
    },
  });
}

// Complete appointment
export function useCompleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      notes,
    }: {
      appointmentId: string;
      notes?: string;
    }) => appointmentApi.completeAppointment(appointmentId, notes),
    onSuccess: (_, { appointmentId }) => {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(appointmentId),
      });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.stats() });
    },
  });
}

// Cancel appointment
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      data,
    }: {
      appointmentId: string;
      data: CancelAppointmentRequest;
    }) => appointmentApi.cancelAppointment(appointmentId, data),
    onSuccess: (_, { appointmentId }) => {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(appointmentId),
      });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.stats() });
    },
  });
}

// Reschedule appointment
export function useRescheduleAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      data,
    }: {
      appointmentId: string;
      data: { appointmentDate: string; appointmentTime: string };
    }) => appointmentApi.rescheduleAppointment(appointmentId, data),
    onSuccess: (_, { appointmentId }) => {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(appointmentId),
      });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: [...appointmentKeys.all, "slots"],
      });
    },
  });
}

// Mark as no-show
export function useMarkNoShow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) =>
      appointmentApi.markNoShow(appointmentId),
    onSuccess: (_, appointmentId) => {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(appointmentId),
      });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.stats() });
    },
  });
}

// Assign staff to appointment
export function useAssignStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      staffId,
    }: {
      appointmentId: string;
      staffId: string;
    }) => appointmentApi.assignStaff(appointmentId, staffId),
    onSuccess: (_, { appointmentId }) => {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(appointmentId),
      });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}

// Predict appointment duration using ML model
export function usePredictDuration(params: PredictAppointmentDurationRequest) {
  return useQuery({
    queryKey: [...appointmentKeys.all, "predict-duration", params] as const,
    queryFn: async () => {
      const response = await post<MLPredictionResponse>('/appointments/predict-duration', params);
      return response;
    },
    enabled: !!params.department && !!params.priority && !!params.appointmentType,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
