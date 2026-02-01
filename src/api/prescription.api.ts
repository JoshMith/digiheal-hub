// ============================================
// DKUT Medical Center - Prescription API Service
// ============================================

import { get, post, put, patch } from './client';
import type {
  Prescription,
  CreatePrescriptionRequest,
  UpdatePrescriptionRequest,
  PrescriptionStatus,
  PaginatedResponse,
} from '../types/api.types';

// ============================================
// PRESCRIPTION CRUD
// ============================================

/**
 * Create a new prescription
 */
export const createPrescription = async (data: CreatePrescriptionRequest): Promise<Prescription> => {
  return post<Prescription>('/prescriptions', data);
};

/**
 * Get prescription by ID
 */
export const getPrescription = async (prescriptionId: string): Promise<Prescription> => {
  return get<Prescription>(`/prescriptions/${prescriptionId}`);
};

/**
 * Update prescription
 */
export const updatePrescription = async (
  prescriptionId: string,
  data: UpdatePrescriptionRequest
): Promise<Prescription> => {
  return put<Prescription>(`/prescriptions/${prescriptionId}`, data);
};

// ============================================
// PRESCRIPTION LISTING & FILTERING
// ============================================

/**
 * Get all prescriptions with filters
 */
export const getPrescriptions = async (params?: {
  patientId?: string;
  staffId?: string;
  status?: PrescriptionStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Prescription>> => {
  const response = await get<Prescription[]>('/prescriptions', params);
  return response as unknown as PaginatedResponse<Prescription>;
};

/**
 * Get prescriptions for a specific patient
 */
export const getPatientPrescriptions = async (
  patientId: string,
  params?: {
    status?: PrescriptionStatus;
    page?: number;
    limit?: number;
  }
): Promise<Prescription[]> => {
  return get<Prescription[]>(`/patients/${patientId}/prescriptions`, params);
};

/**
 * Get prescriptions by appointment
 */
export const getAppointmentPrescriptions = async (
  appointmentId: string
): Promise<Prescription[]> => {
  return get<Prescription[]>(`/appointments/${appointmentId}/prescriptions`);
};

/**
 * Get active prescriptions for patient
 */
export const getActivePrescriptions = async (patientId: string): Promise<Prescription[]> => {
  return get<Prescription[]>(`/patients/${patientId}/prescriptions/active`);
};

// ============================================
// PRESCRIPTION ACTIONS
// ============================================

/**
 * Dispense prescription (pharmacy)
 */
export const dispensePrescription = async (prescriptionId: string): Promise<Prescription> => {
  return patch<Prescription>(`/prescriptions/${prescriptionId}/dispense`);
};

/**
 * Mark prescription as completed
 */
export const completePrescription = async (prescriptionId: string): Promise<Prescription> => {
  return patch<Prescription>(`/prescriptions/${prescriptionId}/complete`);
};

/**
 * Cancel prescription
 */
export const cancelPrescription = async (
  prescriptionId: string,
  reason?: string
): Promise<Prescription> => {
  return patch<Prescription>(`/prescriptions/${prescriptionId}/cancel`, { reason });
};

/**
 * Mark prescription as expired
 */
export const expirePrescription = async (prescriptionId: string): Promise<Prescription> => {
  return patch<Prescription>(`/prescriptions/${prescriptionId}/expire`);
};

// ============================================
// PRESCRIPTION REFILLS
// ============================================

/**
 * Request prescription refill
 */
export const requestRefill = async (prescriptionId: string): Promise<Prescription> => {
  return post<Prescription>(`/prescriptions/${prescriptionId}/refill-request`);
};

/**
 * Approve prescription refill
 */
export const approveRefill = async (prescriptionId: string): Promise<Prescription> => {
  return patch<Prescription>(`/prescriptions/${prescriptionId}/refill-approve`);
};

/**
 * Deny prescription refill
 */
export const denyRefill = async (
  prescriptionId: string,
  reason: string
): Promise<Prescription> => {
  return patch<Prescription>(`/prescriptions/${prescriptionId}/refill-deny`, { reason });
};

// ============================================
// PRESCRIPTION STATISTICS
// ============================================

/**
 * Get prescription statistics
 */
export const getPrescriptionStats = async (params?: {
  startDate?: string;
  endDate?: string;
  staffId?: string;
}): Promise<{
  totalPrescribed: number;
  totalDispensed: number;
  totalActive: number;
  totalExpired: number;
  topMedications: Array<{ name: string; count: number }>;
}> => {
  return get('/prescriptions/stats', params);
};

// ============================================
// PHARMACY QUEUE
// ============================================

/**
 * Get pharmacy queue (prescriptions ready for dispensing)
 */
export const getPharmacyQueue = async (): Promise<Prescription[]> => {
  return get<Prescription[]>('/prescriptions/pharmacy-queue');
};

// ============================================
// EXPORT API OBJECT
// ============================================

export const prescriptionApi = {
  // CRUD
  createPrescription,
  getPrescription,
  updatePrescription,
  // Listing
  getPrescriptions,
  getPatientPrescriptions,
  getAppointmentPrescriptions,
  getActivePrescriptions,
  // Actions
  dispensePrescription,
  completePrescription,
  cancelPrescription,
  expirePrescription,
  // Refills
  requestRefill,
  approveRefill,
  denyRefill,
  // Stats
  getPrescriptionStats,
  // Pharmacy
  getPharmacyQueue,
};

export default prescriptionApi;