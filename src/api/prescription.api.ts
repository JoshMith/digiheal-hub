import api from './client';
import type { 
  Prescription, 
  CreatePrescriptionRequest, 
  ApiResponse,
  PaginationParams,
  PrescriptionStatus
} from '@/types/api.types';

export const prescriptionApi = {
  // Create new prescription (staff only)
  create: (data: CreatePrescriptionRequest) => 
    api.post<Prescription>('/prescriptions', data),

  // Get prescription by ID
  getById: (prescriptionId: string) => 
    api.get<Prescription>(`/prescriptions/${prescriptionId}`),

  // Get patient prescriptions
  getByPatient: (patientId: string, params?: PaginationParams & { status?: PrescriptionStatus }) => 
    api.get<Prescription[]>(`/prescriptions/patient/${patientId}`, params),

  // Get current patient's prescriptions
  getMyPrescriptions: (params?: PaginationParams & { status?: PrescriptionStatus }) => 
    api.get<Prescription[]>('/prescriptions/my', params),

  // Get active prescriptions for patient
  getActive: (patientId?: string) => 
    api.get<Prescription[]>('/prescriptions/active', { patientId }),

  // Update prescription status (staff/pharmacist)
  updateStatus: (prescriptionId: string, status: PrescriptionStatus) => 
    api.patch<Prescription>(`/prescriptions/${prescriptionId}/status`, { status }),

  // Dispense prescription (pharmacist)
  dispense: (prescriptionId: string) => 
    api.post<Prescription>(`/prescriptions/${prescriptionId}/dispense`),

  // Get pending prescriptions for pharmacy
  getPending: () => 
    api.get<Prescription[]>('/prescriptions/pending'),

  // Get prescription history
  getHistory: (patientId: string) => 
    api.get<Prescription[]>(`/prescriptions/patient/${patientId}/history`),

  // Request refill (patient)
  requestRefill: (prescriptionId: string) => 
    api.post<Prescription>(`/prescriptions/${prescriptionId}/refill-request`),
};

export default prescriptionApi;
