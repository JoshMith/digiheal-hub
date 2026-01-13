import api from './client';
import type { 
  Staff, 
  ApiResponse, 
  PaginationParams,
  Department,
  StaffPosition
} from '@/types/api.types';

export const staffApi = {
  // Get current staff profile
  getProfile: () => 
    api.get<Staff>('/staff/me'),

  // Get staff by ID
  getById: (staffId: string) => 
    api.get<Staff>(`/staff/${staffId}`),

  // Get all staff (with filters)
  getAll: (params?: PaginationParams & { 
    department?: Department; 
    position?: StaffPosition;
    isActive?: boolean;
  }) => 
    api.get<Staff[]>('/staff', params),

  // Get staff by department
  getByDepartment: (department: Department) => 
    api.get<Staff[]>(`/staff/department/${department}`),

  // Update staff profile
  updateProfile: (staffId: string, data: Partial<Staff>) => 
    api.put<Staff>(`/staff/${staffId}`, data),

  // Toggle availability
  toggleAvailability: (staffId: string) => 
    api.patch<Staff>(`/staff/${staffId}/availability`),

  // Set availability status
  setAvailability: (staffId: string, isAvailable: boolean) => 
    api.patch<Staff>(`/staff/${staffId}/availability`, { isAvailable }),

  // Get staff schedule
  getSchedule: (staffId: string, date?: string) => 
    api.get<unknown>(`/staff/${staffId}/schedule`, { date }),

  // Get staff statistics
  getStats: (staffId: string, dateRange?: { startDate: string; endDate: string }) => 
    api.get<{
      patientsServed: number;
      averageInteractionTime: number;
      appointmentsCompleted: number;
      prescriptionsIssued: number;
    }>(`/staff/${staffId}/stats`, dateRange),

  // Get available staff for scheduling
  getAvailable: (department?: Department, date?: string, time?: string) => 
    api.get<Staff[]>('/staff/available', { department, date, time }),

  // Search staff
  search: (query: string) => 
    api.get<Staff[]>('/staff/search', { q: query }),
};

export default staffApi;
