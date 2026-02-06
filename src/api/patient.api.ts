// ============================================
// DKUT Medical Center - Patient API Service
// ============================================

import { get, post, put, del } from './client';
import type {
  Patient,
  UpdatePatientRequest,
  VitalSigns,
  CreateVitalSignsRequest,
  Appointment,
  Prescription,
  Notification,
  PaginatedResponse,
  PaginationParams,
} from '../types/api.types';

// ============================================
// TYPES
// ============================================

export interface PatientSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PatientVitalsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface PatientAppointmentsParams {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  upcoming?: boolean;
}

export interface PatientPrescriptionsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface PatientNotificationsParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export interface PatientStatsResponse {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  upcomingAppointments: number;
  lastVisit: string | null;
  activePrescriptions: number;
  totalPrescriptions: number;
}

export interface PatientMedicalHistoryResponse {
  appointments: Appointment[];
  prescriptions: Prescription[];
  vitalSigns: VitalSigns[];
}

// ============================================
// PATIENT ENDPOINTS
// ============================================

/**
 * Get patient by ID
 */
export const getPatient = async (patientId: string): Promise<Patient> => {
  return get<Patient>(`/patients/${patientId}`);
};

/**
 * Get current patient profile (for logged-in patient)
 */
export const getMyProfile = async (): Promise<Patient> => {
  return get<Patient>('/patients/me');
};

/**
 * Update patient profile
 */
export const updatePatient = async (
  patientId: string,
  data: UpdatePatientRequest
): Promise<Patient> => {
  return put<Patient>(`/patients/${patientId}`, data);
};

/**
 * Search patients (staff/admin only)
 */
export const searchPatients = async (
  params: PatientSearchParams
): Promise<PaginatedResponse<Patient>> => {
  const response = await get<Patient[]>('/patients', { params: params as unknown as Record<string, unknown> });
  return response as unknown as PaginatedResponse<Patient>;
};

/**
 * Get all patients (staff/admin only)
 */
export const getAllPatients = async (
  params?: PatientSearchParams
): Promise<PaginatedResponse<Patient>> => {
  const response = await get<Patient[]>('/patients', { params: params as unknown as Record<string, unknown> });
  return response as unknown as PaginatedResponse<Patient>;
};

/**
 * Create new patient (staff/admin only)
 */
export const createPatient = async (
  data: Partial<Patient>
): Promise<Patient> => {
  return post<Patient>('/patients', data);
};

// ============================================
// VITAL SIGNS ENDPOINTS
// ============================================

/**
 * Get patient's vital signs history
 */
export const getPatientVitals = async (
  patientId: string,
  params?: PatientVitalsParams
): Promise<VitalSigns[]> => {
  return get<VitalSigns[]>(`/patients/${patientId}/vitals`, { params: params as unknown as Record<string, unknown> });
};

/**
 * Get latest vital signs for patient
 */
export const getLatestVitals = async (patientId: string): Promise<VitalSigns | null> => {
  return get<VitalSigns | null>(`/patients/${patientId}/vitals/latest`);
};

/**
 * Record new vital signs
 */
export const createVitalSigns = async (
  patientId: string,
  data: Omit<CreateVitalSignsRequest, 'patientId'>
): Promise<VitalSigns> => {
  return post<VitalSigns>(`/patients/${patientId}/vitals`, data);
};

// ============================================
// PATIENT APPOINTMENTS
// ============================================

/**
 * Get patient's appointments
 */
export const getPatientAppointments = async (
  patientId: string,
  params?: PatientAppointmentsParams
): Promise<Appointment[]> => {
  return get<Appointment[]>(`/patients/${patientId}/appointments`, { params: params as unknown as Record<string, unknown> });
};

/**
 * Get my appointments (for logged-in patient)
 */
export const getMyAppointments = async (
  params?: PatientAppointmentsParams
): Promise<Appointment[]> => {
  return get<Appointment[]>('/patients/me/appointments', { params: params as unknown as Record<string, unknown> });
};

// ============================================
// PATIENT PRESCRIPTIONS
// ============================================

/**
 * Get patient's prescriptions
 */
export const getPatientPrescriptions = async (
  patientId: string,
  params?: PatientPrescriptionsParams
): Promise<Prescription[]> => {
  return get<Prescription[]>(`/patients/${patientId}/prescriptions`, { params: params as unknown as Record<string, unknown> });
};

/**
 * Get my prescriptions (for logged-in patient)
 */
export const getMyPrescriptions = async (
  params?: PatientPrescriptionsParams
): Promise<Prescription[]> => {
  return get<Prescription[]>('/patients/me/prescriptions', { params: params as unknown as Record<string, unknown> });
};

// ============================================
// PATIENT NOTIFICATIONS
// ============================================

/**
 * Get patient's notifications
 */
export const getPatientNotifications = async (
  patientId: string,
  params?: PatientNotificationsParams
): Promise<Notification[]> => {
  return get<Notification[]>(`/patients/${patientId}/notifications`, { params: params as unknown as Record<string, unknown> });
};

/**
 * Get my notifications (for logged-in patient)
 */
export const getMyNotifications = async (
  params?: PatientNotificationsParams
): Promise<Notification[]> => {
  return get<Notification[]>('/patients/me/notifications', { params: params as unknown as Record<string, unknown> });
};

/**
 * Mark notification as read
 */
export const markNotificationRead = async (notificationId: string): Promise<void> => {
  await put(`/notifications/${notificationId}/read`);
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async (): Promise<void> => {
  await put('/patients/me/notifications/read-all');
};

// ============================================
// PATIENT MEDICAL HISTORY
// ============================================

/**
 * Get patient's medical history
 */
export const getPatientMedicalHistory = async (
  patientId: string
): Promise<PatientMedicalHistoryResponse> => {
  return get<PatientMedicalHistoryResponse>(`/patients/${patientId}/medical-history`);
};

/**
 * Get patient statistics
 */
export const getPatientStats = async (patientId: string): Promise<PatientStatsResponse> => {
  return get<PatientStatsResponse>(`/patients/${patientId}/stats`);
};

// ============================================
// EXPORT API OBJECT
// ============================================

export const patientApi = {
  getPatient,
  getMyProfile,
  updatePatient,
  createPatient,
  searchPatients,
  getAllPatients,
  getPatientVitals,
  getLatestVitals,
  createVitalSigns,
  getPatientAppointments,
  getMyAppointments,
  getPatientPrescriptions,
  getMyPrescriptions,
  getPatientNotifications,
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getPatientMedicalHistory,
  getPatientStats,
};

export default patientApi;