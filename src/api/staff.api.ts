// ============================================
// DKUT Medical Center - Staff API Service
// ============================================

import api from './client';
import type { 
  Staff, 
  PaginationParams,
  Department,
  StaffPosition
} from '@/types/api.types';

// ============================================
// TYPES
// ============================================

// StaffSchedule, StaffStats, StaffAvailability interfaces
// These should be in api.types.ts, but defining them here for completeness
export interface StaffSchedule {
  id: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  breaks?: Array<{ startTime: string; endTime: string }>;
}

export interface StaffStats {
  totalPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  avgConsultationTime: number;
  avgWaitTime: number;
  patientSatisfaction?: number;
}

export interface StaffAvailability {
  staffId: string;
  isAvailable: boolean;
  currentPatients: number;
  maxCapacity: number;
  nextAvailableSlot?: string;
}

export interface StaffSearchParams {
  page?: number;
  limit?: number;
  department?: Department;
  position?: StaffPosition;
  isActive?: boolean;
  search?: string;
}

export interface StaffScheduleParams {
  date?: string;
  startDate?: string;
  endDate?: string;
}

export interface StaffStatsParams {
  startDate: string;
  endDate: string;
}

export interface StaffAvailableParams {
  department?: Department;
  date?: string;
  time?: string;
}

export interface StaffAppointmentsParams {
  status?: string;
  startDate?: string;
  endDate?: string;
}

// ============================================
// STAFF API
// ============================================

export const staffApi = {
  /**
   * Create staff profile (admin only)
   * POST /staff
   */
  create: (data: Partial<Staff>) => 
    api.post<Staff>('/staff', data),

  /**
   * Get staff by ID (staff/admin only)
   * GET /staff/:id
   */
  getById: (staffId: string) => 
    api.get<Staff>(`/staff/${staffId}`),

  /**
   * Get all staff (staff/admin only)
   * GET /staff
   */
  getAll: (params?: StaffSearchParams) => 
    api.get<Staff[]>('/staff', { params }),

  /**
   * Update staff (admin only)
   * PUT /staff/:id
   */
  update: (staffId: string, data: Partial<Staff>) => 
    api.put<Staff>(`/staff/${staffId}`, data),

  /**
   * Delete/deactivate staff (admin only)
   * DELETE /staff/:id
   */
  delete: (staffId: string) => 
    api.delete(`/staff/${staffId}`),

  /**
   * Get current staff profile
   * GET /staff/me
   */
  getMyProfile: () => 
    api.get<Staff>('/staff/me'),

  /**
   * Get staff schedule (staff/admin only)
   * GET /staff/:id/schedule
   */
  getSchedule: (staffId: string, params?: StaffScheduleParams) => 
    api.get<StaffSchedule>(`/staff/${staffId}/schedule`, { params }),

  /**
   * Update staff schedule (admin only)
   * PUT /staff/:id/schedule
   */
  updateSchedule: (staffId: string, data: Partial<StaffSchedule>) => 
    api.put<StaffSchedule>(`/staff/${staffId}/schedule`, data),

  /**
   * Get staff statistics (staff/admin only)
   * GET /staff/:id/stats
   */
  getStats: (staffId: string, dateRange?: StaffStatsParams) => 
    api.get<StaffStats>(`/staff/${staffId}/stats`, { params: dateRange }),

  /**
   * Get staff availability (staff/admin only)
   * GET /staff/:id/availability
   */
  getAvailability: (staffId: string) => 
    api.get<StaffAvailability>(`/staff/${staffId}/availability`),

  /**
   * Update staff availability (staff/admin only)
   * PATCH /staff/:id/availability
   */
  updateAvailability: (staffId: string, data: Partial<StaffAvailability>) => 
    api.patch<StaffAvailability>(`/staff/${staffId}/availability`, data),

  /**
   * Get staff by department
   * Convenience method
   */
  getByDepartment: (department: Department, params?: Partial<PaginationParams>) => 
    api.get<Staff[]>('/staff', { params: { ...params, department } }),

  /**
   * Get available staff
   * Convenience method
   */
  getAvailable: (params?: StaffAvailableParams) => 
    api.get<Staff[]>('/staff', { params: { ...params, isActive: true } }),

  /**
   * Search staff
   * Convenience method
   */
  search: (query: string, params?: Partial<PaginationParams>) => 
    api.get<Staff[]>('/staff', { params: { ...params, search: query } }),

  /**
   * Get staff appointments
   * GET /staff/:id/appointments
   */
  getAppointments: (staffId: string, params?: StaffAppointmentsParams) => 
    api.get(`/staff/${staffId}/appointments`, { params }),

  /**
   * Get staff patients (current/assigned)
   * GET /staff/:id/patients
   */
  getPatients: (staffId: string, params?: Partial<PaginationParams>) => 
    api.get(`/staff/${staffId}/patients`, { params }),

  /**
   * Toggle staff active status
   * PATCH /staff/:id/status
   */
  toggleStatus: (staffId: string, isActive: boolean) => 
    api.patch<Staff>(`/staff/${staffId}/status`, { isActive }),
};

export default staffApi;