import api from './client';
import type { 
  Appointment, 
  CreateAppointmentRequest, 
  UpdateAppointmentRequest,
  PaginationParams,
  Department,
  TimeSlot,
  AppointmentStats
} from '@/types/api.types';

export const appointmentApi = {
  /**
   * Create new appointment
   * POST /appointments
   */
  create: (data: CreateAppointmentRequest) => 
    api.post<Appointment>('/appointments', data),

  /**
   * Get appointment by ID
   * GET /appointments/:id
   */
  getById: (appointmentId: string) => 
    api.get<Appointment>(`/appointments/${appointmentId}`),

  /**
   * Get patient appointments
   * GET /appointments/patient/:patientId
   */
  getByPatient: (patientId: string, params?: PaginationParams & { status?: string }) => 
    api.get<Appointment[]>(`/appointments/patient/${patientId}`, params),

  /**
   * Get staff appointments
   * GET /appointments/staff/:staffId
   */
  getByStaff: (staffId: string, params?: PaginationParams & { date?: string }) => 
    api.get<Appointment[]>(`/appointments/staff/${staffId}`, params),

  /**
   * Get today's appointments by department
   * GET /appointments/today/:department
   */
  getTodayByDepartment: (department: Department) => 
    api.get<Appointment[]>(`/appointments/today/${department}`),

  /**
   * Update appointment
   * PUT /appointments/:id
   */
  update: (appointmentId: string, data: UpdateAppointmentRequest) => 
    api.put<Appointment>(`/appointments/${appointmentId}`, data),

  /**
   * Check-in for appointment
   * PUT /appointments/:id/checkin
   */
  checkIn: (appointmentId: string) => 
    api.put<Appointment>(`/appointments/${appointmentId}/checkin`),

  /**
   * Start appointment
   * PUT /appointments/:id/start
   */
  start: (appointmentId: string) => 
    api.put<Appointment>(`/appointments/${appointmentId}/start`),

  /**
   * Complete appointment
   * PUT /appointments/:id/complete
   */
  complete: (appointmentId: string, notes?: string) => 
    api.put<Appointment>(`/appointments/${appointmentId}/complete`, { notes }),

  /**
   * Cancel appointment
   * DELETE /appointments/:id/cancel
   */
  cancel: (appointmentId: string, reason?: string) => 
    api.delete<Appointment>(`/appointments/${appointmentId}/cancel`, { reason }),

  /**
   * Get available time slots
   * GET /appointments/slots
   */
  getAvailableSlots: (params: { 
    date: string; 
    department: Department; 
    staffId?: string 
  }) => 
    api.get<TimeSlot[]>('/appointments/slots', params),

  /**
   * Get appointment statistics
   * GET /appointments/stats
   */
  getStats: (params?: { 
    startDate?: string; 
    endDate?: string; 
    department?: Department 
  }) => 
    api.get<AppointmentStats>('/appointments/stats', params),

  /**
   * Get today's appointments for staff
   * Convenience method
   */
  getToday: (staffId?: string) => 
    api.get<Appointment[]>('/appointments/today', { staffId }),

  /**
   * Get upcoming appointments
   * Convenience method
   */
  getUpcoming: (patientId?: string) => 
    api.get<Appointment[]>('/appointments/upcoming', { patientId }),
};

export default appointmentApi;
