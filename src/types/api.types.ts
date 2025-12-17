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

// ============================================
// Health Assessment Types
// ============================================

export interface HealthAssessment {
  id: string;
  patientId: string;
  symptoms: string[];
  predictedDisease: string;
  severityScore: number;
  urgency: UrgencyLevel;
  recommendations: string[];
  confidence?: number | null;
  additionalInfo?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export type UrgencyLevel = 'LOW' | 'MODERATE' | 'URGENT';

export type SymptomSeverity = 'MILD' | 'MODERATE' | 'SEVERE';

export interface HealthAssessmentRequest {
  symptoms: string[];
  age?: number;
  gender?: Gender;
  duration?: string;
  severity?: SymptomSeverity;
  additionalNotes?: string;
}

// ============================================
// Appointment Types
// ============================================

export interface Appointment {
  id: string;
  patientId: string;
  staffId?: string | null;
  healthAssessmentId?: string | null;
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
}

export type AppointmentType =
  | 'CONSULTATION'
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
  healthAssessmentId?: string;
  appointmentDate: string;
  appointmentTime: string;
  duration?: number;
  department: Department;
  appointmentType: AppointmentType;
  priority?: PriorityLevel;
  reason?: string;
  notes?: string;
}

// ============================================
// Consultation Types
// ============================================

export interface Consultation {
  id: string;
  appointmentId: string;
  staffId: string;
  patientId: string;
  chiefComplaint: string;
  historyOfPresentIllness?: string | null;
  physicalExamination?: Record<string, unknown> | null;
  vitalSignsId?: string | null;
  primaryDiagnosis: string;
  differentialDiagnosis: string[];
  clinicalAssessment?: string | null;
  treatmentPlan?: string | null;
  followUpInstructions?: string | null;
  consultationNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Vital Signs Types
// ============================================

export interface VitalSigns {
  id: string;
  patientId: string;
  consultationId?: string | null;
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

// ============================================
// Prescription Types
// ============================================

export interface Prescription {
  id: string;
  consultationId: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
  status: PrescriptionStatus;
  prescribedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type PrescriptionStatus = 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED' | 'EXPIRED';

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
  | 'LAB_RESULTS_READY'
  | 'MEDICATION_REMINDER'
  | 'URGENT_HEALTH_ALERT'
  | 'SYSTEM_ANNOUNCEMENT'
  | 'FOLLOW_UP_REQUIRED';

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

export const PRIORITY_DISPLAY: Record<PriorityLevel, string> = {
  LOW: 'Low',
  NORMAL: 'Normal',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export const URGENCY_DISPLAY: Record<UrgencyLevel, string> = {
  LOW: 'Low',
  MODERATE: 'Moderate',
  URGENT: 'Urgent',
};