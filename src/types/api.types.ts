// ============================================
// DKUT Medical Center - Frontend Types
// Aligned with Backend Prisma Schema
// ============================================


// ============================================
// ENUMS (Match Prisma Schema Exactly)
// ============================================

export enum UserRole {
  PATIENT = 'PATIENT',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum Department {
  GENERAL_MEDICINE = 'GENERAL_MEDICINE',
  EMERGENCY = 'EMERGENCY',
  PEDIATRICS = 'PEDIATRICS',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  DENTAL = 'DENTAL',
  PHARMACY = 'PHARMACY',
  LABORATORY = 'LABORATORY',
}

export enum StaffPosition {
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  PHARMACIST = 'PHARMACIST',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN',
  ADMINISTRATOR = 'ADMINISTRATOR',
  RECEPTIONIST = 'RECEPTIONIST',
}

export enum AppointmentType {
  WALK_IN = 'WALK_IN',
  SCHEDULED = 'SCHEDULED',
  FOLLOW_UP = 'FOLLOW_UP',
  EMERGENCY = 'EMERGENCY',
  ROUTINE_CHECKUP = 'ROUTINE_CHECKUP',
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CHECKED_IN = 'CHECKED_IN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum PriorityLevel {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum PrescriptionStatus {
  ACTIVE = 'ACTIVE',
  DISPENSED = 'DISPENSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum NotificationType {
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  PRESCRIPTION_READY = 'PRESCRIPTION_READY',
  MEDICATION_REMINDER = 'MEDICATION_REMINDER',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

// ============================================
// BASE TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// USER & AUTHENTICATION
// ============================================

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  profile: Patient | Staff | null;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ============================================
// PATIENT
// ============================================

export interface Patient {
  id: string;
  userId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  address: string | null;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  bloodGroup: string | null;
  allergies: string[];
  chronicConditions: string[];
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  createdAt: string;
  // Relations (optional, included when populated)
  user?: User;
  appointments?: Appointment[];
  prescriptions?: Prescription[];
  vitalSigns?: VitalSigns[];
  notifications?: Notification[];
  insuranceProvider?: string | null;
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
  bloodGroup?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  allergies?: string[];
  chronicConditions?: string[];
}

export interface UpdatePatientRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bloodGroup?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  allergies?: string[];
  chronicConditions?: string[];
}

// ============================================
// STAFF
// ============================================

export interface Staff {
  id: string;
  userId: string;
  staffId: string;
  firstName: string;
  lastName: string;
  department: Department;
  position: StaffPosition;
  specialization: string | null;
  licenseNumber: string | null;
  phone: string;
  isAvailable: boolean;
  createdAt: string;
  // Relations
  user?: User;
  appointments?: Appointment[];
  prescriptions?: Prescription[];
  interactions?: Interaction[];
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
}

export interface UpdateStaffRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: Department;
  position?: StaffPosition;
  specialization?: string;
  licenseNumber?: string;
  isAvailable?: boolean;
}

// ============================================
// APPOINTMENT
// ============================================

export interface Appointment {
  id: string;
  patientId: string;
  staffId: string | null;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  department: Department;
  type: AppointmentType;
  status: AppointmentStatus;
  priority: PriorityLevel;
  queueNumber: number | null;
  reason: string | null;
  notes: string | null;
  checkedInAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Relations
  patient?: Patient;
  staff?: Staff;
  prescriptions?: Prescription[];
  interaction?: Interaction;
}

export interface CreateAppointmentRequest {
  patientId: string;
  staffId?: string;
  appointmentDate: string;
  appointmentTime: string;
  duration?: number;
  department: Department;
  type: AppointmentType;
  priority?: PriorityLevel;
  reason: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  appointmentDate?: string;
  appointmentTime?: string;
  status?: AppointmentStatus;
  staffId?: string;
  notes?: string;
}

export interface CancelAppointmentRequest {
  cancellationReason: string;
}

export interface AvailableSlotsResponse {
  date: string;
  department: Department;
  availableSlots: string[];
  totalSlots: number;
  availableCount: number;
}

// ============================================
// PRESCRIPTION
// ============================================

export interface Prescription {
  id: string;
  patientId: string;
  staffId: string;
  appointmentId: string | null;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number | null;
  instructions: string | null;
  status: PrescriptionStatus;
  prescribedAt: string;
  expiresAt: string | null;
  dispensedAt: string | null;
  createdAt: string;
  // Relations
  patient?: Patient;
  staff?: Staff;
  appointment?: Appointment;
}

export interface CreatePrescriptionRequest {
  patientId: string;
  staffId: string;
  appointmentId?: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity?: number;
  instructions?: string;
}

export interface UpdatePrescriptionRequest {
  status?: PrescriptionStatus;
  dispensedAt?: string;
}

// ============================================
// INTERACTION (Time Tracking for ML)
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
  checkInTime: string;
  vitalsStartTime: string | null;
  vitalsEndTime: string | null;
  interactionStartTime: string | null;
  interactionEndTime: string | null;
  checkoutTime: string | null;
  vitalsDuration: number | null;
  interactionDuration: number | null;
  totalDuration: number | null;
  predictedDuration: number | null;
  createdAt: string;
  // Relations
  appointment?: Appointment;
  patient?: Patient;
  staff?: Staff;
}

export interface StartInteractionRequest {
  appointmentId: string;
}

export interface UpdateInteractionPhaseRequest {
  phase: 'vitals_start' | 'vitals_end' | 'interaction_start' | 'interaction_end' | 'checkout';
}

// ============================================
// VITAL SIGNS
// ============================================

export interface VitalSigns {
  id: string;
  patientId: string;
  bloodPressureSystolic: number | null;
  bloodPressureDiastolic: number | null;
  heartRate: number | null;
  temperature: number | null;
  weight: number | null;
  height: number | null;
  oxygenSaturation: number | null;
  respiratoryRate: number | null;
  recordedAt: string;
  // Relations
  patient?: Patient;
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
// NOTIFICATION
// ============================================

export interface Notification {
  id: string;
  patientId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: PriorityLevel;
  read: boolean;
  readAt: string | null;
  createdAt: string;
  // Relations
  patient?: Patient;
}

export interface CreateNotificationRequest {
  patientId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: PriorityLevel;
}

// ============================================
// ML SERVICE
// ============================================
export interface PredictAppointmentDurationRequest {
  department: 'GENERAL_MEDICINE' | 'EMERGENCY' | 'PEDIATRICS' | 'MENTAL_HEALTH' | 'DENTAL' | 'PHARMACY' | 'LABORATORY';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  appointmentType: 'WALK_IN' | 'SCHEDULED' | 'FOLLOW_UP' | 'EMERGENCY' | 'ROUTINE_CHECKUP';
  symptomCount?: number;
  timeOfDay?: number; // 0-23 (hour of day)
  dayOfWeek?: number; // 0-6 (0=Sunday, 6=Saturday)
}

export interface MLPredictionResponse {
  predictedDuration: number; // in minutes
  confidence: number; // 0.0 - 1.0
  modelVersion: string;
  modelType: 'ml-trained' | 'heuristic' | 'heuristic-fallback' | 'fallback' | string;
  error?: string; // Only present if fallback used
}

export interface PredictionSuggestions {
  recommendedDuration: number;
  bufferTime: number; // extra buffer time in minutes
  totalTimeSlot: number; // recommendedDuration + bufferTime
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  note?: string;
}

export interface PredictAppointmentDurationResponse {
  success: boolean;
  data: MLPredictionResponse;
  message?: string;
  suggestions?: PredictionSuggestions;
}

// ============================================
// ANALYTICS
// ============================================

export interface DashboardMetrics {
  totalPatientsToday: number;
  avgWaitTime: number;
  avgInteractionTime: number;
  totalAppointments: number;
  completedAppointments: number;
  noShowCount: number;
  noShowRate: number;
  completionRate: number;
  mlAccuracy: number;
}

export interface PatientFlowData {
  date: string;
  patients: number;
  appointments: number;
}

export interface DepartmentLoadData {
  department: Department;
  appointments: number;
  interactions: number;
  utilization: number;
}

export interface StaffPerformanceData {
  staffId: string;
  name: string;
  department: Department;
  position: StaffPosition;
  totalPatients: number;
  avgDuration: number;
  efficiency: number;
}

export interface PredictionAccuracyData {
  overallAccuracy: number;
  totalSamples: number;
  departmentStats: Array<{
    department: Department;
    avgAccuracy: number;
    sampleSize: number;
  }>;
  period: string;
}

// ============================================
// QUEUE
// ============================================

export interface QueueItem {
  id: string;
  patient: {
    firstName: string;
    lastName: string;
    studentId: string;
  };
  appointment: {
    reason: string;
    priority: PriorityLevel;
  };
  checkInTime: string;
  predictedDuration: number;
}

export interface QueueResponse {
  queue: QueueItem[];
  totalInQueue: number;
  avgWaitTime: number;
  nextEstimatedCall: string | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}