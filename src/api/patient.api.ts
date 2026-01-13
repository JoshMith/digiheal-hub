import api from './client';
import type { 
  Patient, 
  ApiResponse, 
  PaginationParams,
  VitalSigns,
  CreateVitalSignsRequest 
} from '@/types/api.types';

export const patientApi = {
  // Get current patient profile
  getProfile: () => 
    api.get<Patient>('/patients/me'),

  // Get patient by ID
  getById: (patientId: string) => 
    api.get<Patient>(`/patients/${patientId}`),

  // Get patient by student ID
  getByStudentId: (studentId: string) => 
    api.get<Patient>(`/patients/student/${studentId}`),

  // Update patient profile
  updateProfile: (patientId: string, data: Partial<Patient>) => 
    api.put<Patient>(`/patients/${patientId}`, data),

  // Get all patients (staff only)
  getAll: (params?: PaginationParams & { search?: string }) => 
    api.get<Patient[]>('/patients', params),

  // Search patients
  search: (query: string) => 
    api.get<Patient[]>('/patients/search', { q: query }),

  // Get patient vital signs
  getVitalSigns: (patientId: string) => 
    api.get<VitalSigns[]>(`/patients/${patientId}/vitals`),

  // Record new vital signs
  recordVitals: (data: CreateVitalSignsRequest) => 
    api.post<VitalSigns>('/vitals', data),

  // Get patient medical history
  getMedicalHistory: (patientId: string) => 
    api.get<unknown>(`/patients/${patientId}/history`),

  // Get patient statistics
  getStats: (patientId: string) => 
    api.get<unknown>(`/patients/${patientId}/stats`),
};

export default patientApi;
