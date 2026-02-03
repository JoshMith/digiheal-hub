// ============================================
// DKUT Medical Center - Appointment API Service (CORRECTED)
// ============================================

import { get, post, put, patch, del } from './client';
import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  CancelAppointmentRequest,
  AvailableSlotsResponse,
  Department,
  AppointmentStatus,
  PaginatedResponse,
  PredictAppointmentDurationRequest,
} from '../types/api.types';

// ============================================
// TYPES
// ============================================

export interface AppointmentQueryParams {
  date?: string;
  department?: Department;
  status?: AppointmentStatus;
  patientId?: string;
  staffId?: string;
  page?: number;
  limit?: number;
}

export interface TodayAppointmentsParams {
  department?: Department;
  status?: AppointmentStatus;
}

export interface UpcomingAppointmentsParams {
  days?: number;
  department?: Department;
}

export interface AvailableSlotsParams {
  date: string;
  department: Department;
  staffId?: string;
  duration?: number;
}

export interface AvailableDatesParams {
  department: Department;
  days?: number;
}

export interface AppointmentStatsParams {
  startDate?: string;
  endDate?: string;
  department?: Department;
}

// ============================================
// APPOINTMENT CRUD
// ============================================

export const predictAppointmentDuration = async (data: PredictAppointmentDurationRequest): Promise<Appointment> => {
  return post<Appointment>('/predict-duration', data);
};

/**
 * Create a new appointment
 */
export const createAppointment = async (data: CreateAppointmentRequest): Promise<Appointment> => {
  return post<Appointment>('/appointments', data);
};

/**
 * Get appointment by ID
 */
export const getAppointment = async (appointmentId: string): Promise<Appointment> => {
  return get<Appointment>(`/appointments/${appointmentId}`);
};

/**
 * Update appointment
 */
export const updateAppointment = async (
  appointmentId: string,
  data: UpdateAppointmentRequest
): Promise<Appointment> => {
  return put<Appointment>(`/appointments/${appointmentId}`, data);
};

/**
 * Cancel appointment
 */
export const cancelAppointment = async (
  appointmentId: string,
  data: CancelAppointmentRequest
): Promise<Appointment> => {
  return del<Appointment>(`/appointments/${appointmentId}/cancel`);
};

/**
 * Delete appointment (admin only)
 */
export const deleteAppointment = async (appointmentId: string): Promise<void> => {
  await del(`/appointments/${appointmentId}`);
};

// ============================================
// APPOINTMENT LISTING & FILTERING
// ============================================

/**
 * Get all appointments with filters
 * FIXED: Use direct params instead of nested object
 */
export const getAppointments = async (
  params?: AppointmentQueryParams
): Promise<PaginatedResponse<Appointment>> => {
  // Backend route: GET /appointments/patient/:patientId
  if (params?.patientId) {
    const { patientId, ...rest } = params;
    return get<PaginatedResponse<Appointment>>(`/appointments/patient/${patientId}`, rest);
  }
  
  // Backend route: GET /appointments/staff/:staffId
  if (params?.staffId) {
    const { staffId, ...rest } = params;
    return get<PaginatedResponse<Appointment>>(`/appointments/staff/${staffId}`, rest);
  }
  
  // Generic appointments list (if route exists)
  return get<PaginatedResponse<Appointment>>('/appointments', { params });
};

/**
 * Get today's appointments
 * FIXED: Route is /appointments/today/:department
 */
export const getTodayAppointments = async (
  params?: TodayAppointmentsParams
): Promise<Appointment[]> => {
  if (params?.department) {
    return get<Appointment[]>(`/appointments/today/${params.department}`);
  }
  // If no department specified, might need to modify backend to support this
  return get<Appointment[]>('/appointments/today/GENERAL_MEDICINE');
};

/**
 * Get upcoming appointments
 */
export const getUpcomingAppointments = async (
  params?: UpcomingAppointmentsParams
): Promise<Appointment[]> => {
  return get<Appointment[]>('/appointments/upcoming', { params });
};

// ============================================
// AVAILABLE SLOTS
// ============================================

/**
 * Get available time slots for a specific date and department
 * FIXED: Route is /appointments/slots with query params
 */
export const getAvailableSlots = async (
  params: AvailableSlotsParams
): Promise<AvailableSlotsResponse> => {
  // Backend expects: GET /appointments/slots?date=2024-01-01&department=GENERAL_MEDICINE
  return get<AvailableSlotsResponse>('/appointments/slots', { params });
};

/**
 * Get available dates for a department (next N days with available slots)
 */
export const getAvailableDates = async (
  params: AvailableDatesParams
): Promise<string[]> => {
  return get<string[]>('/appointments/available-dates', { params });
};

// ============================================
// APPOINTMENT ACTIONS (Status Updates)
// ============================================

/**
 * Check in patient for appointment
 * FIXED: Route is PUT /appointments/:id/checkin
 */
export const checkInAppointment = async (appointmentId: string): Promise<Appointment> => {
  return put<Appointment>(`/appointments/${appointmentId}/checkin`, {});
};

/**
 * Start consultation (move to IN_PROGRESS)
 * FIXED: Route is PUT /appointments/:id/start
 */
export const startAppointment = async (appointmentId: string): Promise<Appointment> => {
  return put<Appointment>(`/appointments/${appointmentId}/start`, {});
};

/**
 * Complete appointment
 * FIXED: Route is PUT /appointments/:id/complete
 */
export const completeAppointment = async (
  appointmentId: string,
  notes?: string
): Promise<Appointment> => {
  return put<Appointment>(`/appointments/${appointmentId}/complete`, { notes });
};

/**
 * Mark as no-show
 */
export const markNoShow = async (appointmentId: string): Promise<Appointment> => {
  return patch<Appointment>(`/appointments/${appointmentId}/no-show`, {});
};

/**
 * Reschedule appointment
 */
export const rescheduleAppointment = async (
  appointmentId: string,
  data: { appointmentDate: string; appointmentTime: string }
): Promise<Appointment> => {
  return patch<Appointment>(`/appointments/${appointmentId}/reschedule`, data);
};

/**
 * Assign staff to appointment
 */
export const assignStaff = async (
  appointmentId: string,
  staffId: string
): Promise<Appointment> => {
  return patch<Appointment>(`/appointments/${appointmentId}/assign`, { staffId });
};

// ============================================
// QUEUE MANAGEMENT
// ============================================

/**
 * Get current queue for department
 */
export const getDepartmentQueue = async (department: Department): Promise<{
  queue: Appointment[];
  totalInQueue: number;
  avgWaitTime: number;
}> => {
  return get(`/appointments/queue/${department}`);
};

/**
 * Get patient's queue position
 */
export const getQueuePosition = async (appointmentId: string): Promise<{
  position: number;
  estimatedWaitTime: number;
  aheadCount: number;
}> => {
  return get(`/appointments/${appointmentId}/queue-position`);
};

/**
 * Call next patient in queue
 */
export const callNextPatient = async (department: Department): Promise<Appointment | null> => {
  return post<Appointment | null>(`/appointments/queue/${department}/call-next`);
};

// ============================================
// APPOINTMENT STATISTICS
// ============================================

/**
 * Get appointment statistics
 * FIXED: Route is GET /appointments/stats
 */
export const getAppointmentStats = async (
  params?: AppointmentStatsParams
): Promise<{
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
  completionRate: number;
  noShowRate: number;
}> => {
  return get('/appointments/stats', { params });
};

// ============================================
// EXPORT API OBJECT
// ============================================

export const appointmentApi = {
  // CRUD
  createAppointment,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
  // Listing
  getAppointments,
  getTodayAppointments,
  getUpcomingAppointments,
  // Slots
  getAvailableSlots,
  getAvailableDates,
  // Actions
  checkInAppointment,
  startAppointment,
  completeAppointment,
  markNoShow,
  rescheduleAppointment,
  assignStaff,
  // Queue
  getDepartmentQueue,
  getQueuePosition,
  callNextPatient,
  // Stats
  getAppointmentStats,
};

export default appointmentApi;