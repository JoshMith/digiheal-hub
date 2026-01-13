import api from './client';
import type { 
  Interaction, 
  StartInteractionRequest, 
  UpdateInteractionRequest,
  ApiResponse,
  PaginationParams
} from '@/types/api.types';

export interface DurationPredictionRequest {
  department: string;
  priority: string;
  appointmentType: string;
  symptomCount: number;
}

export interface DurationPredictionResponse {
  predictedDuration: number;
  confidence: number;
}

export const interactionApi = {
  // Start a new interaction (check-in)
  start: (data: StartInteractionRequest) => 
    api.post<Interaction>('/interactions', data),

  // Get interaction by ID
  getById: (interactionId: string) => 
    api.get<Interaction>(`/interactions/${interactionId}`),

  // Get interaction by appointment ID
  getByAppointment: (appointmentId: string) => 
    api.get<Interaction>(`/interactions/appointment/${appointmentId}`),

  // Update interaction phases
  update: (interactionId: string, data: UpdateInteractionRequest) => 
    api.patch<Interaction>(`/interactions/${interactionId}`, data),

  // Start vitals recording
  startVitals: (interactionId: string) => 
    api.patch<Interaction>(`/interactions/${interactionId}`, { 
      vitalsStartTime: new Date().toISOString() 
    }),

  // End vitals recording
  endVitals: (interactionId: string) => 
    api.patch<Interaction>(`/interactions/${interactionId}`, { 
      vitalsEndTime: new Date().toISOString() 
    }),

  // Start patient interaction
  startInteraction: (interactionId: string) => 
    api.patch<Interaction>(`/interactions/${interactionId}`, { 
      interactionStartTime: new Date().toISOString() 
    }),

  // End patient interaction
  endInteraction: (interactionId: string) => 
    api.patch<Interaction>(`/interactions/${interactionId}`, { 
      interactionEndTime: new Date().toISOString() 
    }),

  // Complete checkout
  checkout: (interactionId: string) => 
    api.patch<Interaction>(`/interactions/${interactionId}`, { 
      checkoutTime: new Date().toISOString() 
    }),

  // Get today's interactions for staff
  getToday: (staffId?: string) => 
    api.get<Interaction[]>('/interactions/today', { staffId }),

  // Get interaction history with pagination
  getHistory: (params?: PaginationParams & { 
    staffId?: string; 
    department?: string;
    startDate?: string;
    endDate?: string;
  }) => 
    api.get<Interaction[]>('/interactions', params),

  // Get ML duration prediction
  predictDuration: (data: DurationPredictionRequest) => 
    api.post<DurationPredictionResponse>('/interactions/predict-duration', data),

  // Get prediction accuracy stats
  getPredictionStats: () => 
    api.get<{ accuracy: number; totalPredictions: number; averageError: number }>(
      '/interactions/prediction-stats'
    ),
};

export default interactionApi;
