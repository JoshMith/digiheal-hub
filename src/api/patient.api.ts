import api from './client';
import type { 
  Patient, 
  PaginationParams,
  VitalSigns,
  CreateVitalSignsRequest,
  PatientStats,
  MedicalHistory
} from '@/types/api.types';

export const patientApi = {
  /**
   * Create patient profile
   * POST /patients
   */
  create: (data: Partial<Patient>) => 
    api.post<Patient>('/patients', data),

  /**
   * Get patient by ID
   * GET /patients/:id
   */
  getById: (patientId: string) => 
    api.get<Patient>(`/patients/${patientId}`),

  /**
   * Get patient by student ID
   * GET /patients/student/:studentId
   */
  getByStudentId: (studentId: string) => 
    api.get<Patient>(`/patients/student/${studentId}`),

  /**
   * Update patient profile
   * PUT /patients/:id
   */
  update: (patientId: string, data: Partial<Patient>) => 
    api.put<Patient>(`/patients/${patientId}`, data),

  /**
   * Get all patients (staff/admin only)
   * GET /patients
   */
  getAll: (params?: PaginationParams & { search?: string }) => 
    api.get<Patient[]>('/patients', params),

  /**
   * Get patient medical history
   * GET /patients/:id/history
   */
  getHistory: (patientId: string) => 
    api.get<MedicalHistory>(`/patients/${patientId}/history`),

  /**
   * Get patient statistics
   * GET /patients/:id/stats
   */
  getStats: (patientId: string) => 
    api.get<PatientStats>(`/patients/${patientId}/stats`),

  /**
   * Add vital signs for patient
   * POST /patients/:id/vital-signs
   */
  addVitalSigns: (patientId: string, data: Omit<CreateVitalSignsRequest, 'patientId'>) => 
    api.post<VitalSigns>(`/patients/${patientId}/vital-signs`, data),

  /**
   * Get patient vital signs
   * GET /patients/:id/vital-signs
   */
  getVitalSigns: (patientId: string) => 
    api.get<VitalSigns[]>(`/patients/${patientId}/vital-signs`),

  /**
   * Search patients (convenience method)
   */
  search: (query: string, params?: PaginationParams) => 
    api.get<Patient[]>('/patients', { ...params, search: query }),
};

export default patientApi;
