import api from './client';
import type { 
  Staff, 
  PaginationParams,
  Department,
  StaffPosition,
  StaffSchedule,
  StaffStats,
  StaffAvailability
} from '@/types/api.types';

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
  getAll: (params?: PaginationParams & { 
    department?: Department; 
    position?: StaffPosition;
    isActive?: boolean;
  }) => 
    api.get<Staff[]>('/staff', params),

  /**
   * Update staff (admin only)
   * PUT /staff/:id
   */
  update: (staffId: string, data: Partial<Staff>) => 
    api.put<Staff>(`/staff/${staffId}`, data),

  /**
   * Get staff schedule (staff/admin only)
   * GET /staff/:id/schedule
   */
  getSchedule: (staffId: string, params?: { date?: string; startDate?: string; endDate?: string }) => 
    api.get<StaffSchedule>(`/staff/${staffId}/schedule`, params),

  /**
   * Get staff statistics (staff/admin only)
   * GET /staff/:id/stats
   */
  getStats: (staffId: string, dateRange?: { startDate: string; endDate: string }) => 
    api.get<StaffStats>(`/staff/${staffId}/stats`, dateRange),

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
  getByDepartment: (department: Department, params?: PaginationParams) => 
    api.get<Staff[]>('/staff', { ...params, department }),

  /**
   * Get available staff
   * Convenience method
   */
  getAvailable: (params?: { department?: Department; date?: string; time?: string }) => 
    api.get<Staff[]>('/staff', { ...params, isActive: true }),

  /**
   * Search staff
   * Convenience method
   */
  search: (query: string, params?: PaginationParams) => 
    api.get<Staff[]>('/staff', { ...params, search: query }),
};

export default staffApi;
