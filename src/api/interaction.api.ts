import api from './client';
import type { 
  Interaction, 
  StartInteractionRequest, 
  PaginationParams,
  QueueItem,
  InteractionStats
} from '@/types/api.types';

export interface DurationPredictionRequest {
  department: string;
  priority: string;
  appointmentType: string;
  symptomCount: number;
  timeOfDay?: number;
  dayOfWeek?: number;
}

export interface DurationPredictionResponse {
  predictedDuration: number;
  confidence: number;
  modelVersion?: string;
}

export interface TrainingDataExport {
  id: string;
  department: string;
  priority: string;
  appointmentType: string;
  symptomCount: number;
  actualDuration: number;
  predictedDuration: number;
  timeOfDay: number;
  dayOfWeek: number;
}

export const interactionApi = {
  /**
   * Start a new interaction (check-in)
   * POST /interactions/start
   */
  start: (data: StartInteractionRequest) => 
    api.post<Interaction>('/interactions/start', data),

  /**
   * Start vitals phase
   * POST /interactions/:id/vitals-start
   */
  startVitals: (interactionId: string) => 
    api.post<Interaction>(`/interactions/${interactionId}/vitals-start`),

  /**
   * End vitals phase
   * POST /interactions/:id/vitals-end
   */
  endVitals: (interactionId: string) => 
    api.post<Interaction>(`/interactions/${interactionId}/vitals-end`),

  /**
   * Start consultation/interaction
   * POST /interactions/:id/consultation-start
   */
  startConsultation: (interactionId: string) => 
    api.post<Interaction>(`/interactions/${interactionId}/consultation-start`),

  /**
   * End consultation/interaction
   * POST /interactions/:id/consultation-end
   */
  endConsultation: (interactionId: string) => 
    api.post<Interaction>(`/interactions/${interactionId}/consultation-end`),

  /**
   * Checkout patient
   * POST /interactions/:id/checkout
   */
  checkout: (interactionId: string) => 
    api.post<Interaction>(`/interactions/${interactionId}/checkout`),

  /**
   * Get current queue
   * GET /interactions/queue
   */
  getQueue: (params?: { department?: string; staffId?: string }) => 
    api.get<QueueItem[]>('/interactions/queue', params),

  /**
   * Get interaction statistics
   * GET /interactions/stats
   */
  getStats: (params?: { startDate?: string; endDate?: string; department?: string }) => 
    api.get<InteractionStats>('/interactions/stats', params),

  /**
   * Get interaction by ID
   * GET /interactions/:id
   */
  getById: (interactionId: string) => 
    api.get<Interaction>(`/interactions/${interactionId}`),

  /**
   * Get patient interactions
   * GET /interactions/patient/:patientId
   */
  getByPatient: (patientId: string, params?: PaginationParams) => 
    api.get<Interaction[]>(`/interactions/patient/${patientId}`, params),

  /**
   * Get staff interactions
   * GET /interactions/staff/:staffId
   */
  getByStaff: (staffId: string, params?: PaginationParams & { date?: string }) => 
    api.get<Interaction[]>(`/interactions/staff/${staffId}`, params),

  /**
   * Export training data
   * GET /interactions/export
   */
  exportTrainingData: (params?: { startDate?: string; endDate?: string }) => 
    api.get<TrainingDataExport[]>('/interactions/export', params),

  /**
   * Get ML duration prediction (calls ML service)
   */
  predictDuration: (data: DurationPredictionRequest) => 
    api.post<DurationPredictionResponse>('/ml/predict', data),

  /**
   * Get prediction accuracy stats
   */
  getPredictionStats: () => 
    api.get<{ accuracy: number; totalPredictions: number; averageError: number }>(
      '/analytics/prediction-accuracy'
    ),
};

export default interactionApi;
