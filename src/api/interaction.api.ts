// ============================================
// DKUT Medical Center - Interaction API Service
// Time tracking for ML training data collection
// ============================================

import { get, post, patch } from './client';
import type {
  Interaction,
  StartInteractionRequest,
  UpdateInteractionPhaseRequest,
  Department,
  PaginatedResponse,
} from '../types/api.types';

// ============================================
// TYPES
// ============================================

export interface InteractionQueryParams {
  department?: Department;
  staffId?: string;
  patientId?: string;
  startDate?: string;
  endDate?: string;
  completed?: boolean;
  page?: number;
  limit?: number;
}

export interface TodayInteractionsParams {
  department?: Department;
}

export interface ActiveInteractionsParams {
  department?: Department;
}

export interface StaffInteractionsParams {
  startDate?: string;
  endDate?: string;
}

export interface InteractionStatsParams {
  department?: Department;
  startDate?: string;
  endDate?: string;
}

export interface DurationByDepartmentParams {
  startDate?: string;
  endDate?: string;
}

export interface PredictionAccuracyParams {
  department?: Department;
  startDate?: string;
  endDate?: string;
}

export interface MLTrainingDataParams {
  startDate?: string;
  endDate?: string;
  minSamples?: number;
}

// ============================================
// INTERACTION LIFECYCLE
// ============================================

/**
 * Start a new interaction (when patient checks in)
 */
export const startInteraction = async (data: StartInteractionRequest): Promise<Interaction> => {
  return post<Interaction>('/interactions', data);
};

/**
 * Get interaction by ID
 */
export const getInteraction = async (interactionId: string): Promise<Interaction> => {
  return get<Interaction>(`/interactions/${interactionId}`);
};

/**
 * Get interaction by appointment ID
 */
export const getInteractionByAppointment = async (appointmentId: string): Promise<Interaction | null> => {
  return get<Interaction | null>(`/appointments/${appointmentId}/interaction`);
};

/**
 * Update interaction phase
 * Phases: vitals_start, vitals_end, interaction_start, interaction_end, checkout
 */
export const updateInteractionPhase = async (
  interactionId: string,
  data: UpdateInteractionPhaseRequest
): Promise<Interaction> => {
  return patch<Interaction>(`/interactions/${interactionId}/phase`, data);
};

// ============================================
// PHASE-SPECIFIC UPDATES
// ============================================

/**
 * Start vitals recording
 */
export const startVitals = async (interactionId: string): Promise<Interaction> => {
  return patch<Interaction>(`/interactions/${interactionId}/vitals-start`);
};

/**
 * End vitals recording
 */
export const endVitals = async (interactionId: string): Promise<Interaction> => {
  return patch<Interaction>(`/interactions/${interactionId}/vitals-end`);
};

/**
 * Start doctor interaction
 */
export const startDoctorInteraction = async (interactionId: string): Promise<Interaction> => {
  return patch<Interaction>(`/interactions/${interactionId}/interaction-start`);
};

/**
 * End doctor interaction
 */
export const endDoctorInteraction = async (interactionId: string): Promise<Interaction> => {
  return patch<Interaction>(`/interactions/${interactionId}/interaction-end`);
};

/**
 * Complete checkout
 */
export const checkout = async (interactionId: string): Promise<Interaction> => {
  return patch<Interaction>(`/interactions/${interactionId}/checkout`);
};

// ============================================
// INTERACTION LISTING
// ============================================

/**
 * Get all interactions with filters
 */
export const getInteractions = async (
  params?: InteractionQueryParams
): Promise<PaginatedResponse<Interaction>> => {
  const response = await get<Interaction[]>('/interactions', { params });
  return response as unknown as PaginatedResponse<Interaction>;
};

/**
 * Get today's interactions
 */
export const getTodayInteractions = async (
  params?: TodayInteractionsParams
): Promise<Interaction[]> => {
  return get<Interaction[]>('/interactions/today', { params });
};

/**
 * Get active (incomplete) interactions
 */
export const getActiveInteractions = async (
  params?: ActiveInteractionsParams
): Promise<Interaction[]> => {
  return get<Interaction[]>('/interactions/active', { params });
};

/**
 * Get interactions for a specific staff member
 */
export const getStaffInteractions = async (
  staffId: string,
  params?: StaffInteractionsParams
): Promise<Interaction[]> => {
  return get<Interaction[]>(`/staff/${staffId}/interactions`, { params });
};

// ============================================
// INTERACTION ANALYTICS
// ============================================

/**
 * Get interaction duration statistics
 */
export const getInteractionStats = async (
  params?: InteractionStatsParams
): Promise<{
  totalInteractions: number;
  avgVitalsDuration: number;
  avgInteractionDuration: number;
  avgTotalDuration: number;
  completedCount: number;
}> => {
  return get('/interactions/stats', { params });
};

/**
 * Get duration breakdown by department
 */
export const getDurationByDepartment = async (
  params?: DurationByDepartmentParams
): Promise<
  Array<{
    department: Department;
    avgVitalsDuration: number;
    avgInteractionDuration: number;
    avgTotalDuration: number;
    count: number;
  }>
> => {
  return get('/interactions/stats/by-department', { params });
};

/**
 * Get prediction accuracy data
 */
export const getPredictionAccuracy = async (
  params?: PredictionAccuracyParams
): Promise<{
  overallAccuracy: number;
  totalSamples: number;
  avgError: number;
  errorDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
}> => {
  return get('/interactions/prediction-accuracy', { params });
};

// ============================================
// ML DATA EXPORT
// ============================================

/**
 * Get interaction data for ML training (admin only)
 */
export const getMLTrainingData = async (
  params?: MLTrainingDataParams
): Promise<{
  data: Array<{
    department: Department;
    priority: string;
    appointmentType: string;
    symptomCount: number;
    timeOfDay: number;
    dayOfWeek: number;
    actualDuration: number;
  }>;
  totalRecords: number;
}> => {
  return get('/interactions/ml-training-data', { params });
};

// ============================================
// EXPORT API OBJECT
// ============================================

export const interactionApi = {
  // Lifecycle
  startInteraction,
  getInteraction,
  getInteractionByAppointment,
  updateInteractionPhase,
  // Phase updates
  startVitals,
  endVitals,
  startDoctorInteraction,
  endDoctorInteraction,
  checkout,
  // Listing
  getInteractions,
  getTodayInteractions,
  getActiveInteractions,
  getStaffInteractions,
  // Analytics
  getInteractionStats,
  getDurationByDepartment,
  getPredictionAccuracy,
  // ML Export
  getMLTrainingData,
};

export default interactionApi;