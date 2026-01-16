import api from './client';
import type { 
  Prescription, 
  CreatePrescriptionRequest, 
  UpdatePrescriptionRequest,
  PaginationParams,
  PrescriptionStatus,
  PrescriptionStats
} from '@/types/api.types';

export const prescriptionApi = {
  /**
   * Create prescription (staff/admin only)
   * POST /prescriptions
   */
  create: (data: CreatePrescriptionRequest) => 
    api.post<Prescription>('/prescriptions', data),

  /**
   * Get prescription by ID (staff/admin only)
   * GET /prescriptions/:id
   */
  getById: (prescriptionId: string) => 
    api.get<Prescription>(`/prescriptions/${prescriptionId}`),

  /**
   * Get patient prescriptions (staff/admin only)
   * GET /prescriptions/patient/:patientId
   */
  getByPatient: (patientId: string, params?: PaginationParams & { status?: PrescriptionStatus }) => 
    api.get<Prescription[]>(`/prescriptions/patient/${patientId}`, params),

  /**
   * Get staff prescriptions (staff/admin only)
   * GET /prescriptions/staff/:staffId
   */
  getByStaff: (staffId: string, params?: PaginationParams) => 
    api.get<Prescription[]>(`/prescriptions/staff/${staffId}`, params),

  /**
   * Update prescription (staff/admin only)
   * PUT /prescriptions/:id
   */
  update: (prescriptionId: string, data: UpdatePrescriptionRequest) => 
    api.put<Prescription>(`/prescriptions/${prescriptionId}`, data),

  /**
   * Dispense prescription (staff/admin only)
   * POST /prescriptions/:id/dispense
   */
  dispense: (prescriptionId: string) => 
    api.post<Prescription>(`/prescriptions/${prescriptionId}/dispense`),

  /**
   * Complete prescription (staff/admin only)
   * POST /prescriptions/:id/complete
   */
  complete: (prescriptionId: string) => 
    api.post<Prescription>(`/prescriptions/${prescriptionId}/complete`),

  /**
   * Cancel prescription (staff/admin only)
   * POST /prescriptions/:id/cancel
   */
  cancel: (prescriptionId: string, reason?: string) => 
    api.post<Prescription>(`/prescriptions/${prescriptionId}/cancel`, { reason }),

  /**
   * Get active prescriptions (staff/admin only)
   * GET /prescriptions/active
   */
  getActive: (params?: PaginationParams) => 
    api.get<Prescription[]>('/prescriptions/active', params),

  /**
   * Get expiring prescriptions (staff/admin only)
   * GET /prescriptions/expiring
   */
  getExpiring: (params?: PaginationParams & { days?: number }) => 
    api.get<Prescription[]>('/prescriptions/expiring', params),

  /**
   * Get prescription statistics (staff/admin only)
   * GET /prescriptions/stats
   */
  getStats: (params?: { startDate?: string; endDate?: string }) => 
    api.get<PrescriptionStats>('/prescriptions/stats', params),
};

export default prescriptionApi;
