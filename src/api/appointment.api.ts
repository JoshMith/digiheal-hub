import api from './client';
import type { 
  Appointment, 
  CreateAppointmentRequest, 
  ApiResponse,
  PaginationParams,
  Department
} from '@/types/api.types';

export const appointmentApi = {
  // Create new appointment
  create: (data: CreateAppointmentRequest) => 
    api.post<Appointment>('/appointments', data),

  // Get appointment by ID
  getById: (appointmentId: string) => 
    api.get<Appointment>(`/appointments/${appointmentId}`),

  // Get patient appointments
  getByPatient: (patientId: string, params?: PaginationParams & { status?: string }) => 
    api.get<Appointment[]>(`/appointments/patient/${patientId}`, params),

  // Get current patient's appointments
  getMyAppointments: (params?: PaginationParams & { status?: string }) => 
    api.get<Appointment[]>('/appointments/my', params),

  // Get upcoming appointments
  getUpcoming: (patientId?: string) => 
    api.get<Appointment[]>('/appointments/upcoming', { patientId }),

  // Update appointment
  update: (appointmentId: string, data: Partial<Appointment>) => 
    api.put<Appointment>(`/appointments/${appointmentId}`, data),

  // Cancel appointment
  cancel: (appointmentId: string, reason?: string) => 
    api.post<Appointment>(`/appointments/${appointmentId}/cancel`, { reason }),

  // Check-in for appointment
  checkIn: (appointmentId: string) => 
    api.post<Appointment>(`/appointments/${appointmentId}/check-in`),

  // Start appointment (staff)
  start: (appointmentId: string) => 
    api.post<Appointment>(`/appointments/${appointmentId}/start`),

  // Complete appointment (staff)
  complete: (appointmentId: string, notes?: string) => 
    api.post<Appointment>(`/appointments/${appointmentId}/complete`, { notes }),

  // Get today's queue by department
  getTodayQueue: (department: Department) => 
    api.get<Appointment[]>(`/appointments/department/${department}/today`),

  // Get available time slots
  getAvailableSlots: (date: string, department: Department, staffId?: string) => 
    api.get<string[]>('/appointments/slots/available', { date, department, staffId }),

  // Get staff appointments
  getByStaff: (staffId: string, params?: PaginationParams & { date?: string }) => 
    api.get<Appointment[]>(`/appointments/staff/${staffId}`, params),

  // Get today's appointments (staff)
  getToday: (staffId?: string) => 
    api.get<Appointment[]>('/appointments/today', { staffId }),
};

export default appointmentApi;
