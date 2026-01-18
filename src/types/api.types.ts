// ============================================
// User and Authentication Types
// ============================================

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'PATIENT' | 'STAFF' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    profile: Patient | Staff | null;
    token: string;
    refreshToken: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PatientRegistrationRequest {
  email: string;
  password: string;
  studentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  nationality?: string;
  address?: string;
  bloodGroup?: BloodGroup;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  emergencyContactEmail?: string;
  insuranceProvider?: string;
  policyNumber?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
}

export interface StaffRegistrationRequest {
  email: string;
  password: string;
  staffId: string;
  firstName: string;
  lastName: string;
  department: Department;
  position: StaffPosition;
  phone: string;
  specialization?: string;
  licenseNumber?: string;
  qualifications?: string[];
  isActive?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  // Staff specific
  specialization?: string;
  isAvailable?: boolean;
}

// ============================================
// Patient Types
// ============================================

export interface Patient {
  id: string;
  userId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  nationality?: string | null;
  address?: string | null;
  bloodGroup?: string | null;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  emergencyContactName?: string | null;
  emergencyContactRelationship?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactEmail?: string | null;
  insuranceProvider?: string | null;
  policyNumber?: string | null;
  profileImage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface PatientStats {
  totalAppointments: number;
  completedAppointments: number;
  upcomingAppointments: number;
  totalPrescriptions: number;
  activePrescriptions: number;
  lastVisit?: string | null;
}

// Alias for Priority (same as PriorityLevel)
export type Priority = PriorityLevel;

export interface MedicalHistory {
  appointments: Appointment[];
  prescriptions: Prescription[];
  vitalSigns: VitalSigns[];
}

// ============================================
// Staff Types
// ============================================

export interface Staff {
  id: string;
  userId: string;
  staffId: string;
  firstName: string;
  lastName: string;
  department: Department;
  position: StaffPosition;
  specialization?: string | null;
  licenseNumber?: string | null;
  phone: string;
  qualifications: string[];
  isActive: boolean;
  isAvailable: boolean;
  profileImage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type Department =
  | 'GENERAL_MEDICINE'
  | 'EMERGENCY'
  | 'PEDIATRICS'
  | 'MENTAL_HEALTH'
  | 'DENTAL'
  | 'OPHTHALMOLOGY'
  | 'PHARMACY'
  | 'LABORATORY'
  | 'RADIOLOGY'
  | 'NURSING'
  | 'ADMINISTRATION'
  | 'CARDIOLOGY'
  | 'DERMATOLOGY'
  | 'ORTHOPEDICS'
  | 'GYNECOLOGY';

export type StaffPosition =
  | 'DOCTOR'
  | 'NURSE'
  | 'PHARMACIST'
  | 'LAB_TECHNICIAN'
  | 'RADIOLOGIST'
  | 'ADMINISTRATOR'
  | 'RECEPTIONIST'
  | 'SPECIALIST'
  | 'CONSULTANT'
  | 'INTERN';

export interface StaffSchedule {
  staffId: string;
  date: string;
  appointments: Appointment[];
  availableSlots: string[];
}

export interface StaffStats {
  patientsServed: number;
  averageInteractionTime: number;
  appointmentsCompleted: number;
  prescriptionsIssued: number;
}

export interface StaffAvailability {
  staffId: string;
  isAvailable: boolean;
  schedule?: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

// ============================================
// Appointment Types
// ============================================

export interface Appointment {
  id: string;
  patientId: string;
  staffId?: string | null;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  department: Department;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  priority: PriorityLevel;
  queueNumber?: number | null;
  estimatedWaitTime?: number | null;
  reason?: string | null;
  notes?: string | null;
  checkedInAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  staff?: Staff | null;
  interaction?: Interaction | null;
}

export type AppointmentType =
  | 'WALK_IN'
  | 'SCHEDULED'
  | 'FOLLOW_UP'
  | 'EMERGENCY'
  | 'ROUTINE_CHECKUP'
  | 'VACCINATION'
  | 'LAB_TEST'
  | 'IMAGING';

export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CHECKED_IN'
  | 'WAITING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type PriorityLevel = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface CreateAppointmentRequest {
  patientId?: string;
  staffId?: string;
  appointmentDate: string;
  appointmentTime: string;
  duration?: number;
  department: Department;
  appointmentType: AppointmentType;
  priority?: PriorityLevel;
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  staffId?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  duration?: number;
  department?: Department;
  appointmentType?: AppointmentType;
  priority?: PriorityLevel;
  reason?: string;
  notes?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  staffId?: string;
}

export interface AppointmentStats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  noShow: number;
  pending: number;
  inProgress: number;
  averageDuration: number;
}

// ============================================
// Vital Signs Types
// ============================================

export interface VitalSigns {
  id: string;
  patientId: string;
  bloodPressureSystolic?: number | null;
  bloodPressureDiastolic?: number | null;
  heartRate?: number | null;
  temperature?: number | null;
  weight?: number | null;
  height?: number | null;
  oxygenSaturation?: number | null;
  respiratoryRate?: number | null;
  bmi?: number | null;
  recordedAt: string;
  createdAt: string;
}

export interface CreateVitalSignsRequest {
  patientId: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  oxygenSaturation?: number;
  respiratoryRate?: number;
}

// ============================================
// Prescription Types
// ============================================

export interface Prescription {
  id: string;
  patientId: string;
  staffId: string;
  appointmentId?: string | null;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity?: number | null;
  instructions?: string | null;
  status: PrescriptionStatus;
  prescribedAt: string;
  expiresAt?: string | null;
  dispensedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  staff?: Staff;
}

export type PrescriptionStatus = 'ACTIVE' | 'DISPENSED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';

export interface CreatePrescriptionRequest {
  patientId: string;
  appointmentId?: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity?: number;
  instructions?: string;
  expiresAt?: string;
}

export interface UpdatePrescriptionRequest {
  medicationName?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  quantity?: number;
  instructions?: string;
  expiresAt?: string;
}

export interface PrescriptionStats {
  total: number;
  active: number;
  dispensed: number;
  expired: number;
  cancelled: number;
}

// ============================================
// Interaction (Time Tracking) Types
// ============================================

export interface Interaction {
  id: string;
  appointmentId: string;
  patientId: string;
  staffId: string;
  department: Department;
  priority: PriorityLevel;
  appointmentType: AppointmentType;
  symptomCount: number;

  // Time tracking phases
  checkInTime: string;
  vitalsStartTime?: string | null;
  vitalsEndTime?: string | null;
  interactionStartTime?: string | null;
  interactionEndTime?: string | null;
  checkoutTime?: string | null;

  // Calculated durations (in minutes)
  vitalsDuration?: number | null;
  interactionDuration?: number | null;
  totalDuration?: number | null;

  // ML prediction
  predictedDuration?: number | null;

  createdAt: string;
  
  // Relations
  patient?: Patient;
  staff?: Staff;
  appointment?: Appointment;
}

export interface StartInteractionRequest {
  appointmentId: string;
  patientId: string;
  staffId: string;
  department: Department;
  priority: PriorityLevel;
  appointmentType: AppointmentType;
  symptomCount?: number;
}

export interface UpdateInteractionRequest {
  vitalsStartTime?: string;
  vitalsEndTime?: string;
  interactionStartTime?: string;
  interactionEndTime?: string;
  checkoutTime?: string;
}

export type InteractionPhase = 
  | 'CHECKED_IN'
  | 'VITALS_IN_PROGRESS'
  | 'VITALS_COMPLETE'
  | 'INTERACTION_IN_PROGRESS'
  | 'COMPLETED';

export interface QueueItem {
  // Nested objects from API
  interaction: Interaction;
  patient: Patient;
  appointment: Appointment;
  
  // Flattened fields for UI convenience
  interactionId: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  department: Department;
  appointmentType: AppointmentType;
  priority: PriorityLevel;
  status: InteractionPhase;
  queuePosition: number;
  checkInTime: string;
  predictedDuration?: number | null;
  
  // Computed fields
  currentPhase: InteractionPhase;
  waitTime: number;
  estimatedDuration: number;
}

export interface InteractionStats {
  totalToday: number;
  completed: number;
  inProgress: number;
  averageWaitTime: number;
  averageInteractionTime: number;
}

// ============================================
// Notification Types
// ============================================

export interface Notification {
  id: string;
  patientId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: PriorityLevel;
  read: boolean;
  readAt?: string | null;
  metadata?: Record<string, unknown> | null;
  expiresAt?: string | null;
  createdAt: string;
}

export type NotificationType =
  | 'APPOINTMENT_REMINDER'
  | 'PRESCRIPTION_READY'
  | 'MEDICATION_REMINDER'
  | 'SYSTEM_ANNOUNCEMENT'
  | 'LAB_RESULTS_READY'
  | 'FOLLOW_UP_REQUIRED';

// ============================================
// Analytics Types
// ============================================

export interface DashboardMetrics {
  totalPatients: number;
  todayPatients: number;
  weekPatients: number;
  monthPatients: number;
  totalAppointments: number;
  todayAppointments: number;
  completedToday: number;
  pendingToday: number;
  averageWaitTime: number;
  averageInteractionDuration: number;
  appointmentCompletionRate: number;
  noShowRate: number;
}

export interface AnalyticsSummary {
  totalPatients: number;
  todayPatients: number;
  weekPatients: number;
  monthPatients: number;
  averageWaitTime: number;
  averageInteractionDuration: number;
  appointmentCompletionRate: number;
  noShowRate: number;
}

export interface PatientFlowData {
  date: string;
  hour?: number;
  count: number;
  department?: Department;
}

export interface WaitTimeData {
  date: string;
  averageWait: number;
  minWait: number;
  maxWait: number;
  department?: Department;
}

export interface DepartmentLoad {
  department: Department;
  currentLoad: number;
  capacity: number;
  utilizationRate: number;
  averageWaitTime: number;
  patientsWaiting: number;
}

export interface DepartmentStats {
  department: Department;
  patientCount: number;
  averageWaitTime: number;
  averageInteractionTime: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface AppointmentTypeStats {
  type: AppointmentType;
  count: number;
  percentage: number;
}

export interface StaffPerformance {
  staffId: string;
  staffName: string;
  department: Department;
  patientsServed: number;
  averageInteractionTime: number;
  completionRate: number;
  rating?: number;
}

export interface MLPredictionStats {
  totalPredictions: number;
  accuracyRate: number;
  averageError: number;
  modelVersion?: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: ValidationError[];
  meta?: PaginationMeta;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// Display Helper Types (for UI mapping)
// ============================================

export const DEPARTMENT_DISPLAY: Record<Department, string> = {
  GENERAL_MEDICINE: 'General Medicine',
  EMERGENCY: 'Emergency',
  PEDIATRICS: 'Pediatrics',
  MENTAL_HEALTH: 'Mental Health',
  DENTAL: 'Dental',
  OPHTHALMOLOGY: 'Ophthalmology',
  PHARMACY: 'Pharmacy',
  LABORATORY: 'Laboratory',
  RADIOLOGY: 'Radiology',
  NURSING: 'Nursing',
  ADMINISTRATION: 'Administration',
  CARDIOLOGY: 'Cardiology',
  DERMATOLOGY: 'Dermatology',
  ORTHOPEDICS: 'Orthopedics',
  GYNECOLOGY: 'Gynecology',
};

export const POSITION_DISPLAY: Record<StaffPosition, string> = {
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  PHARMACIST: 'Pharmacist',
  LAB_TECHNICIAN: 'Lab Technician',
  RADIOLOGIST: 'Radiologist',
  ADMINISTRATOR: 'Administrator',
  RECEPTIONIST: 'Receptionist',
  SPECIALIST: 'Specialist',
  CONSULTANT: 'Consultant',
  INTERN: 'Intern',
};

export const GENDER_DISPLAY: Record<Gender, string> = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
  PREFER_NOT_TO_SAY: 'Prefer not to say',
};

export const APPOINTMENT_STATUS_DISPLAY: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Scheduled',
  CHECKED_IN: 'Checked In',
  WAITING: 'Waiting',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
};

export const APPOINTMENT_TYPE_DISPLAY: Record<AppointmentType, string> = {
  WALK_IN: 'Walk-in',
  SCHEDULED: 'Scheduled',
  FOLLOW_UP: 'Follow-up',
  EMERGENCY: 'Emergency',
  ROUTINE_CHECKUP: 'Routine Checkup',
  VACCINATION: 'Vaccination',
  LAB_TEST: 'Lab Test',
  IMAGING: 'Imaging',
};

export const PRIORITY_DISPLAY: Record<PriorityLevel, string> = {
  LOW: 'Low',
  NORMAL: 'Normal',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export const PRESCRIPTION_STATUS_DISPLAY: Record<PrescriptionStatus, string> = {
  ACTIVE: 'Active',
  DISPENSED: 'Dispensed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
};

export const BLOOD_GROUP_DISPLAY: Record<BloodGroup, string> = {
  'A+': 'A+',
  'A-': 'A-',
  'B+': 'B+',
  'B-': 'B-',
  'AB+': 'AB+',
  'AB-': 'AB-',
  'O+': 'O+',
  'O-': 'O-',
};
