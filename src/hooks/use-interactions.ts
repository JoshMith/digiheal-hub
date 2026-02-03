import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interactionApi } from '@/api';
import type { 
  Interaction, 
  StartInteractionRequest,
  Department,
  PaginationParams 
} from '@/types/api.types';

// Cache durations to prevent rate limiting
const STALE_TIME = 2 * 60 * 1000; // 2 minutes
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Query keys
export const interactionKeys = {
  all: ['interactions'] as const,
  lists: () => [...interactionKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...interactionKeys.lists(), params] as const,
  queue: (params?: { department?: Department; staffId?: string }) => 
    [...interactionKeys.all, 'queue', params] as const,
  stats: (params?: Record<string, unknown>) => [...interactionKeys.all, 'stats', params] as const,
  details: () => [...interactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...interactionKeys.details(), id] as const,
  byPatient: (patientId: string, params?: PaginationParams) => 
    [...interactionKeys.all, 'patient', patientId, params] as const,
  byStaff: (staffId: string, params?: unknown) => 
    [...interactionKeys.all, 'staff', staffId, params] as const,
  byAppointment: (appointmentId: string) =>
    [...interactionKeys.all, 'appointment', appointmentId] as const,
  today: (params?: { department?: Department }) =>
    [...interactionKeys.all, 'today', params] as const,
  active: (params?: { department?: Department }) =>
    [...interactionKeys.all, 'active', params] as const,
  durationByDept: (params?: { startDate?: string; endDate?: string }) =>
    [...interactionKeys.all, 'duration-by-dept', params] as const,
  predictionAccuracy: (params?: { department?: Department; startDate?: string; endDate?: string }) =>
    [...interactionKeys.all, 'prediction-accuracy', params] as const,
};

// Get current queue - uses /interactions/queue endpoint
export function useInteractionQueue(params?: { department?: Department; staffId?: string }) {
  return useQuery({
    queryKey: interactionKeys.queue(params),
    queryFn: () => interactionApi.getQueue(params),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchInterval: 60000, // Refresh every 60 seconds (was 30)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

// Get interaction stats
export function useInteractionStats(params?: { 
  startDate?: string; 
  endDate?: string; 
  department?: Department;
}) {
  return useQuery({
    queryKey: interactionKeys.stats(params),
    queryFn: () => interactionApi.getInteractionStats(params),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

// Get interaction by ID
export function useInteraction(interactionId: string) {
  return useQuery({
    queryKey: interactionKeys.detail(interactionId),
    queryFn: () => interactionApi.getInteraction(interactionId),
    enabled: !!interactionId,
  });
}

// Get interaction by appointment ID
export function useInteractionByAppointment(appointmentId: string) {
  return useQuery({
    queryKey: interactionKeys.byAppointment(appointmentId),
    queryFn: () => interactionApi.getInteractionByAppointment(appointmentId),
    enabled: !!appointmentId,
  });
}

// Get patient interactions
export function usePatientInteractions(patientId: string, params?: PaginationParams) {
  return useQuery({
    queryKey: interactionKeys.byPatient(patientId, params),
    queryFn: () => interactionApi.getInteractions({ 
      patientId, 
      ...params 
    }),
    enabled: !!patientId,
  });
}

// Get staff interactions
export function useStaffInteractions(
  staffId: string, 
  params?: PaginationParams & { startDate?: string; endDate?: string }
) {
  return useQuery({
    queryKey: interactionKeys.byStaff(staffId, params),
    queryFn: () => interactionApi.getStaffInteractions(staffId, params),
    enabled: !!staffId,
  });
}

// Get today's interactions
export function useTodayInteractions(params?: { department?: Department }) {
  return useQuery({
    queryKey: interactionKeys.today(params),
    queryFn: () => interactionApi.getTodayInteractions(params),
  });
}

// Get active (incomplete) interactions
export function useActiveInteractions(params?: { department?: Department }) {
  return useQuery({
    queryKey: interactionKeys.active(params),
    queryFn: () => interactionApi.getActiveInteractions(params),
    refetchInterval: 15000, // Refresh every 15 seconds
  });
}

// Get duration breakdown by department
export function useDurationByDepartment(params?: { 
  startDate?: string; 
  endDate?: string 
}) {
  return useQuery({
    queryKey: interactionKeys.durationByDept(params),
    queryFn: () => interactionApi.getDurationByDepartment(params),
  });
}

// Get prediction accuracy
export function usePredictionAccuracy(params?: { 
  department?: Department;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: interactionKeys.predictionAccuracy(params),
    queryFn: () => interactionApi.getPredictionAccuracy(params),
  });
}

// Start interaction
export function useStartInteraction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: StartInteractionRequest) => 
      interactionApi.startInteraction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interactionKeys.queue() });
      queryClient.invalidateQueries({ queryKey: interactionKeys.active() });
      queryClient.invalidateQueries({ queryKey: interactionKeys.today() });
      queryClient.invalidateQueries({ queryKey: interactionKeys.stats() });
    },
  });
}

// Update interaction phase (generic)
export function useUpdateInteractionPhase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ interactionId, phase }: { 
      interactionId: string; 
      phase: 'vitals_start' | 'vitals_end' | 'interaction_start' | 'interaction_end' | 'checkout';
    }) => interactionApi.updateInteractionPhase(interactionId, { phase }),
    onSuccess: (_, { interactionId }) => {
      queryClient.invalidateQueries({ queryKey: interactionKeys.detail(interactionId) });
      queryClient.invalidateQueries({ queryKey: interactionKeys.queue() });
      queryClient.invalidateQueries({ queryKey: interactionKeys.active() });
    },
  });
}

// Start vitals
export function useStartVitals() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (interactionId: string) => 
      interactionApi.startVitals(interactionId),
    onSuccess: (_, interactionId) => {
      queryClient.invalidateQueries({ queryKey: interactionKeys.detail(interactionId) });
      queryClient.invalidateQueries({ queryKey: interactionKeys.queue() });
      queryClient.invalidateQueries({ queryKey: interactionKeys.active() });
    },
  });
}

// End vitals
export function useEndVitals() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (interactionId: string) => 
      interactionApi.endVitals(interactionId),
    onSuccess: (_, interactionId) => {
      queryClient.invalidateQueries({ queryKey: interactionKeys.detail(interactionId) });
      queryClient.invalidateQueries({ queryKey: interactionKeys.queue() });
      queryClient.invalidateQueries({ queryKey: interactionKeys.active() });
    },
  });
}

// Start doctor interaction/consultation
export function useStartConsultation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (interactionId: string) => 
      interactionApi.startDoctorInteraction(interactionId),
    onSuccess: (_, interactionId) => {
      queryClient.invalidateQueries({ queryKey: interactionKeys.detail(interactionId) });
      queryClient.invalidateQueries({ queryKey: interactionKeys.queue() });
      queryClient.invalidateQueries({ queryKey: interactionKeys.active() });
    },
  });
}

// End doctor interaction/consultation
export function useEndConsultation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (interactionId: string) => 
      interactionApi.endDoctorInteraction(interactionId),
    onSuccess: (_, interactionId) => {
      queryClient.invalidateQueries({ queryKey: interactionKeys.detail(interactionId) });
      queryClient.invalidateQueries({ queryKey: interactionKeys.queue() });
      queryClient.invalidateQueries({ queryKey: interactionKeys.active() });
    },
  });
}

// Checkout
export function useCheckout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (interactionId: string) => 
      interactionApi.checkout(interactionId),
    onSuccess: (_, interactionId) => {
      queryClient.invalidateQueries({ queryKey: interactionKeys.detail(interactionId) });
      queryClient.invalidateQueries({ queryKey: interactionKeys.queue() });
      queryClient.invalidateQueries({ queryKey: interactionKeys.active() });
      queryClient.invalidateQueries({ queryKey: interactionKeys.today() });
      queryClient.invalidateQueries({ queryKey: interactionKeys.stats() });
    },
  });
}

// Get ML training data (admin only)
export function useMLTrainingData(params?: {
  startDate?: string;
  endDate?: string;
  minSamples?: number;
}) {
  return useQuery({
    queryKey: [...interactionKeys.all, 'ml-training', params] as const,
    queryFn: () => interactionApi.getMLTrainingData(params),
    enabled: false, // Only fetch when explicitly requested
  });
}