import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interactionApi } from '@/api';
import type { 
  Interaction, 
  StartInteractionRequest, 
  PaginationParams 
} from '@/types/api.types';
import type { DurationPredictionRequest } from '@/api/interaction.api';

// Query keys
export const interactionKeys = {
  all: ['interactions'] as const,
  queue: (params?: { department?: string; staffId?: string }) => 
    [...interactionKeys.all, 'queue', params] as const,
  stats: (params?: Record<string, unknown>) => [...interactionKeys.all, 'stats', params] as const,
  details: () => [...interactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...interactionKeys.details(), id] as const,
  byPatient: (patientId: string, params?: PaginationParams) => 
    [...interactionKeys.all, 'patient', patientId, params] as const,
  byStaff: (staffId: string, params?: unknown) => 
    [...interactionKeys.all, 'staff', staffId, params] as const,
  prediction: (data: DurationPredictionRequest) => 
    [...interactionKeys.all, 'prediction', data] as const,
};

// Get current queue
export function useInteractionQueue(params?: { department?: string; staffId?: string }) {
  return useQuery({
    queryKey: interactionKeys.queue(params),
    queryFn: async () => {
      const response = await interactionApi.getQueue(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

// Get interaction stats
export function useInteractionStats(params?: { 
  startDate?: string; 
  endDate?: string; 
  department?: string 
}) {
  return useQuery({
    queryKey: interactionKeys.stats(params),
    queryFn: async () => {
      const response = await interactionApi.getStats(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });
}

// Get interaction by ID
export function useInteraction(interactionId: string) {
  return useQuery({
    queryKey: interactionKeys.detail(interactionId),
    queryFn: async () => {
      const response = await interactionApi.getById(interactionId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!interactionId,
  });
}

// Get patient interactions
export function usePatientInteractions(patientId: string, params?: PaginationParams) {
  return useQuery({
    queryKey: interactionKeys.byPatient(patientId, params),
    queryFn: async () => {
      const response = await interactionApi.getByPatient(patientId, params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!patientId,
  });
}

// Get staff interactions
export function useStaffInteractions(
  staffId: string, 
  params?: PaginationParams & { date?: string }
) {
  return useQuery({
    queryKey: interactionKeys.byStaff(staffId, params),
    queryFn: async () => {
      const response = await interactionApi.getByStaff(staffId, params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!staffId,
  });
}

// Get ML duration prediction
export function useDurationPrediction(data: DurationPredictionRequest) {
  return useQuery({
    queryKey: interactionKeys.prediction(data),
    queryFn: async () => {
      const response = await interactionApi.predictDuration(data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!data.department && !!data.priority && !!data.appointmentType,
  });
}

// Start interaction
export function useStartInteraction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: StartInteractionRequest) => {
      const response = await interactionApi.start(data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interactionKeys.queue() });
      queryClient.invalidateQueries({ queryKey: interactionKeys.stats() });
    },
  });
}

// Start vitals
export function useStartVitals() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (interactionId: string) => {
      const response = await interactionApi.startVitals(interactionId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, interactionId) => {
      queryClient.invalidateQueries({ queryKey: interactionKeys.detail(interactionId) });
      queryClient.invalidateQueries({ queryKey: interactionKeys.queue() });
    },
  });
}

// End vitals
export function useEndVitals() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (interactionId: string) => {
      const response = await interactionApi.endVitals(interactionId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, interactionId) => {
      queryClient.invalidateQueries({ queryKey: interactionKeys.detail(interactionId) });
      queryClient.invalidateQueries({ queryKey: interactionKeys.queue() });
    },
  });
}

// Start consultation
export function useStartConsultation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (interactionId: string) => {
      const response = await interactionApi.startConsultation(interactionId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, interactionId) => {
      queryClient.invalidateQueries({ queryKey: interactionKeys.detail(interactionId) });
      queryClient.invalidateQueries({ queryKey: interactionKeys.queue() });
    },
  });
}

// End consultation
export function useEndConsultation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (interactionId: string) => {
      const response = await interactionApi.endConsultation(interactionId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, interactionId) => {
      queryClient.invalidateQueries({ queryKey: interactionKeys.detail(interactionId) });
      queryClient.invalidateQueries({ queryKey: interactionKeys.queue() });
    },
  });
}

// Checkout
export function useCheckout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (interactionId: string) => {
      const response = await interactionApi.checkout(interactionId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, interactionId) => {
      queryClient.invalidateQueries({ queryKey: interactionKeys.detail(interactionId) });
      queryClient.invalidateQueries({ queryKey: interactionKeys.queue() });
      queryClient.invalidateQueries({ queryKey: interactionKeys.stats() });
    },
  });
}
