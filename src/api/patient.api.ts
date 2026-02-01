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
} from '../types/api.types';

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
export const searchPatients = async (params: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Patient>> => {
  const response = await get<Patient[]>('/patients', params);
  // Note: Backend should return PaginatedResponse, adjust if needed
  return response as unknown as PaginatedResponse<Patient>;
};

/**
 * Get all patients (staff/admin only)
 */
export const getAllPatients = async (params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<PaginatedResponse<Patient>> => {
  const response = await get<Patient[]>('/patients', params);
  return response as unknown as PaginatedResponse<Patient>;
};

// ============================================
// VITAL SIGNS ENDPOINTS
// ============================================

/**
 * Get patient's vital signs history
 */
export const getPatientVitals = async (
  patientId: string,
  params?: { page?: number; limit?: number }
): Promise<VitalSigns[]> => {
  return get<VitalSigns[]>(`/patients/${patientId}/vitals`, params);
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
  params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
): Promise<Appointment[]> => {
  return get<Appointment[]>(`/patients/${patientId}/appointments`, params);
};

/**
 * Get my appointments (for logged-in patient)
 */
export const getMyAppointments = async (params?: {
  status?: string;
  upcoming?: boolean;
}): Promise<Appointment[]> => {
  return get<Appointment[]>('/patients/me/appointments', params);
};

// ============================================
// PATIENT PRESCRIPTIONS
// ============================================

/**
 * Get patient's prescriptions
 */
export const getPatientPrescriptions = async (
  patientId: string,
  params?: {
    status?: string;
    page?: number;
    limit?: number;
  }
): Promise<Prescription[]> => {
  return get<Prescription[]>(`/patients/${patientId}/prescriptions`, params);
};

/**
 * Get my prescriptions (for logged-in patient)
 */
export const getMyPrescriptions = async (params?: {
  status?: string;
}): Promise<Prescription[]> => {
  return get<Prescription[]>('/patients/me/prescriptions', params);
};

// ============================================
// PATIENT NOTIFICATIONS
// ============================================

/**
 * Get patient's notifications
 */
export const getPatientNotifications = async (
  patientId: string,
  params?: {
    unreadOnly?: boolean;
    page?: number;
    limit?: number;
  }
): Promise<Notification[]> => {
  return get<Notification[]>(`/patients/${patientId}/notifications`, params);
};

/**
 * Get my notifications (for logged-in patient)
 */
export const getMyNotifications = async (params?: {
  unreadOnly?: boolean;
}): Promise<Notification[]> => {
  return get<Notification[]>('/patients/me/notifications', params);
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
export const getPatientMedicalHistory = async (patientId: string): Promise<{
  appointments: Appointment[];
  prescriptions: Prescription[];
  vitalSigns: VitalSigns[];
}> => {
  return get(`/patients/${patientId}/medical-history`);
};

// ============================================
// EXPORT API OBJECT
// ============================================

export const patientApi = {
  getPatient,
  getMyProfile,
  updatePatient,
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
};

export default patientApi;