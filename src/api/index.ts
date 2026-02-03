// ============================================
// DKUT Medical Center - API Module Exports
// ============================================

// Core API client and utilities
export { default as api, ApiError, tokenManager } from './client';

// Authentication API
export { default as authApi } from './auth.api';

// Patient API
export { default as patientApi } from './patient.api';

// Appointment API
export { default as appointmentApi } from './appointment.api';

// Prescription API
export { default as prescriptionApi } from './prescription.api';

// Interaction API
export { default as interactionApi } from './interaction.api';

// Analytics API
export { default as analyticsApi } from './analytics.api';

// Staff API
export { default as staffApi } from './staff.api';

// Notification API
export { default as notificationApi } from './notification.api';

// ============================================
// Re-export Types for Convenience
// ============================================

// Analytics types
export type { 
  AnalyticsDateRange,
  PatientFlowParams,
  WaitTimeParams,
  StaffPerformanceParams,
  WaitTimeData,
  TodayStats,
  PeakHourData,
  ExportDataParams,
  ExportDataResponse,
  AppointmentStatsParams,
  AppointmentStatsResponse,
  InteractionStatsResponse
} from './analytics.api';

// Interaction types
export type { 
  startInteraction, 
  updateInteractionPhase
} from './interaction.api';

// Notification types
export type {
  NotificationQueryParams,
  NotificationPreferences,
  UnreadCountResponse,
  MarkAllReadResponse
} from './notification.api';

// Staff types
export type {
  StaffSchedule,
  StaffStats,
  StaffAvailability,
  StaffSearchParams,
  StaffScheduleParams,
  StaffStatsParams,
  StaffAvailableParams,
  StaffAppointmentsParams
} from './staff.api';

// Patient types
export type {
  PatientSearchParams,
  PatientVitalsParams,
  PatientAppointmentsParams,
  PatientPrescriptionsParams,
  PatientNotificationsParams,
  PatientStatsResponse,
  PatientMedicalHistoryResponse
} from './patient.api';