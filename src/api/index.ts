// API Module Exports
export { default as api, ApiError, getToken, setTokens, clearTokens, getRefreshToken } from './client';
export { default as authApi } from './auth.api';
export { default as patientApi } from './patient.api';
export { default as appointmentApi } from './appointment.api';
export { default as prescriptionApi } from './prescription.api';
export { default as interactionApi } from './interaction.api';
export { default as analyticsApi } from './analytics.api';
export { default as staffApi } from './staff.api';
export { default as notificationApi } from './notification.api';

// Re-export types for convenience
export type { AnalyticsDateRange } from './analytics.api';
export type { 
  DurationPredictionRequest, 
  DurationPredictionResponse,
  TrainingDataExport 
} from './interaction.api';
