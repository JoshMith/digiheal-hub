// ============================================
// DKUT Medical Center - Enum Mapping Utilities
// Convert between display strings and backend SCREAMING_SNAKE_CASE enums
// ============================================

import {
  UserRole,
  Gender,
  Department,
  StaffPosition,
  AppointmentType,
  AppointmentStatus,
  PriorityLevel,
  PrescriptionStatus,
  NotificationType,
} from '../types/api.types';

// ============================================
// USER ROLE
// ============================================

export const userRoleDisplayMap: Record<UserRole, string> = {
  [UserRole.PATIENT]: 'Patient',
  [UserRole.STAFF]: 'Staff',
  [UserRole.ADMIN]: 'Administrator',
};

export const getUserRoleDisplay = (role: UserRole): string =>
  userRoleDisplayMap[role] || role;

export const userRoleOptions = Object.entries(userRoleDisplayMap).map(([value, label]) => ({
  value: value as UserRole,
  label,
}));

// ============================================
// GENDER
// ============================================

export const genderDisplayMap: Record<Gender, string> = {
  [Gender.MALE]: 'Male',
  [Gender.FEMALE]: 'Female',
  [Gender.OTHER]: 'Other',
};

export const getGenderDisplay = (gender: Gender): string =>
  genderDisplayMap[gender] || gender;

export const genderOptions = Object.entries(genderDisplayMap).map(([value, label]) => ({
  value: value as Gender,
  label,
}));

// ============================================
// DEPARTMENT
// ============================================

export const departmentDisplayMap: Record<Department, string> = {
  [Department.GENERAL_MEDICINE]: 'General Medicine',
  [Department.EMERGENCY]: 'Emergency',
  [Department.PEDIATRICS]: 'Pediatrics',
  [Department.MENTAL_HEALTH]: 'Mental Health',
  [Department.DENTAL]: 'Dental',
  [Department.PHARMACY]: 'Pharmacy',
  [Department.LABORATORY]: 'Laboratory',
};

export const getDepartmentDisplay = (department: Department): string =>
  departmentDisplayMap[department] || department;

export const departmentFromDisplay = (display: string): Department | undefined =>
  (Object.entries(departmentDisplayMap).find(([, label]) => label === display)?.[0]) as Department | undefined;

export const departmentOptions = Object.entries(departmentDisplayMap).map(([value, label]) => ({
  value: value as Department,
  label,
}));

export const getDepartmentColor = (department: Department): string => {
  const colors: Record<Department, string> = {
    [Department.GENERAL_MEDICINE]: 'bg-blue-100 text-blue-800',
    [Department.EMERGENCY]: 'bg-red-100 text-red-800',
    [Department.PEDIATRICS]: 'bg-pink-100 text-pink-800',
    [Department.MENTAL_HEALTH]: 'bg-purple-100 text-purple-800',
    [Department.DENTAL]: 'bg-cyan-100 text-cyan-800',
    [Department.PHARMACY]: 'bg-green-100 text-green-800',
    [Department.LABORATORY]: 'bg-orange-100 text-orange-800',
  };
  return colors[department] || 'bg-gray-100 text-gray-800';
};

// ============================================
// STAFF POSITION
// ============================================

export const staffPositionDisplayMap: Record<StaffPosition, string> = {
  [StaffPosition.DOCTOR]: 'Doctor',
  [StaffPosition.NURSE]: 'Nurse',
  [StaffPosition.PHARMACIST]: 'Pharmacist',
  [StaffPosition.LAB_TECHNICIAN]: 'Lab Technician',
  [StaffPosition.ADMINISTRATOR]: 'Administrator',
  [StaffPosition.RECEPTIONIST]: 'Receptionist',
};

export const getStaffPositionDisplay = (position: StaffPosition): string =>
  staffPositionDisplayMap[position] || position;

export const staffPositionOptions = Object.entries(staffPositionDisplayMap).map(([value, label]) => ({
  value: value as StaffPosition,
  label,
}));

// ============================================
// APPOINTMENT TYPE
// ============================================

export const appointmentTypeDisplayMap: Record<AppointmentType, string> = {
  [AppointmentType.WALK_IN]: 'Walk-in',
  [AppointmentType.SCHEDULED]: 'Scheduled',
  [AppointmentType.FOLLOW_UP]: 'Follow-up',
  [AppointmentType.EMERGENCY]: 'Emergency',
  [AppointmentType.ROUTINE_CHECKUP]: 'Routine Checkup',
};

export const getAppointmentTypeDisplay = (type: AppointmentType): string =>
  appointmentTypeDisplayMap[type] || type;

export const appointmentTypeOptions = Object.entries(appointmentTypeDisplayMap).map(([value, label]) => ({
  value: value as AppointmentType,
  label,
}));

export const getAppointmentTypeColor = (type: AppointmentType): string => {
  const colors: Record<AppointmentType, string> = {
    [AppointmentType.WALK_IN]: 'bg-gray-100 text-gray-800',
    [AppointmentType.SCHEDULED]: 'bg-blue-100 text-blue-800',
    [AppointmentType.FOLLOW_UP]: 'bg-indigo-100 text-indigo-800',
    [AppointmentType.EMERGENCY]: 'bg-red-100 text-red-800',
    [AppointmentType.ROUTINE_CHECKUP]: 'bg-green-100 text-green-800',
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
};

// ============================================
// APPOINTMENT STATUS
// ============================================

export const appointmentStatusDisplayMap: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]: 'Scheduled',
  [AppointmentStatus.CHECKED_IN]: 'Checked In',
  [AppointmentStatus.IN_PROGRESS]: 'In Progress',
  [AppointmentStatus.COMPLETED]: 'Completed',
  [AppointmentStatus.CANCELLED]: 'Cancelled',
  [AppointmentStatus.NO_SHOW]: 'No Show',
};

export const getAppointmentStatusDisplay = (status: AppointmentStatus): string =>
  appointmentStatusDisplayMap[status] || status;

export const appointmentStatusOptions = Object.entries(appointmentStatusDisplayMap).map(([value, label]) => ({
  value: value as AppointmentStatus,
  label,
}));

export const getAppointmentStatusColor = (status: AppointmentStatus): string => {
  const colors: Record<AppointmentStatus, string> = {
    [AppointmentStatus.SCHEDULED]: 'bg-blue-100 text-blue-800',
    [AppointmentStatus.CHECKED_IN]: 'bg-yellow-100 text-yellow-800',
    [AppointmentStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-800',
    [AppointmentStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [AppointmentStatus.CANCELLED]: 'bg-red-100 text-red-800',
    [AppointmentStatus.NO_SHOW]: 'bg-orange-100 text-orange-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// ============================================
// PRIORITY LEVEL
// ============================================

export const priorityLevelDisplayMap: Record<PriorityLevel, string> = {
  [PriorityLevel.LOW]: 'Low',
  [PriorityLevel.NORMAL]: 'Normal',
  [PriorityLevel.HIGH]: 'High',
  [PriorityLevel.URGENT]: 'Urgent',
};

export const getPriorityLevelDisplay = (priority: PriorityLevel): string =>
  priorityLevelDisplayMap[priority] || priority;

export const priorityLevelOptions = Object.entries(priorityLevelDisplayMap).map(([value, label]) => ({
  value: value as PriorityLevel,
  label,
}));

export const getPriorityLevelColor = (priority: PriorityLevel): string => {
  const colors: Record<PriorityLevel, string> = {
    [PriorityLevel.LOW]: 'bg-gray-100 text-gray-800',
    [PriorityLevel.NORMAL]: 'bg-blue-100 text-blue-800',
    [PriorityLevel.HIGH]: 'bg-orange-100 text-orange-800',
    [PriorityLevel.URGENT]: 'bg-red-100 text-red-800',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
};

export const getPriorityLevelBadgeVariant = (priority: PriorityLevel): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const variants: Record<PriorityLevel, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    [PriorityLevel.LOW]: 'outline',
    [PriorityLevel.NORMAL]: 'secondary',
    [PriorityLevel.HIGH]: 'default',
    [PriorityLevel.URGENT]: 'destructive',
  };
  return variants[priority] || 'outline';
};

// ============================================
// PRESCRIPTION STATUS
// ============================================

export const prescriptionStatusDisplayMap: Record<PrescriptionStatus, string> = {
  [PrescriptionStatus.ACTIVE]: 'Active',
  [PrescriptionStatus.DISPENSED]: 'Dispensed',
  [PrescriptionStatus.COMPLETED]: 'Completed',
  [PrescriptionStatus.CANCELLED]: 'Cancelled',
  [PrescriptionStatus.EXPIRED]: 'Expired',
};

export const getPrescriptionStatusDisplay = (status: PrescriptionStatus): string =>
  prescriptionStatusDisplayMap[status] || status;

export const prescriptionStatusOptions = Object.entries(prescriptionStatusDisplayMap).map(([value, label]) => ({
  value: value as PrescriptionStatus,
  label,
}));

export const getPrescriptionStatusColor = (status: PrescriptionStatus): string => {
  const colors: Record<PrescriptionStatus, string> = {
    [PrescriptionStatus.ACTIVE]: 'bg-blue-100 text-blue-800',
    [PrescriptionStatus.DISPENSED]: 'bg-green-100 text-green-800',
    [PrescriptionStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
    [PrescriptionStatus.CANCELLED]: 'bg-red-100 text-red-800',
    [PrescriptionStatus.EXPIRED]: 'bg-orange-100 text-orange-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// ============================================
// NOTIFICATION TYPE
// ============================================

export const notificationTypeDisplayMap: Record<NotificationType, string> = {
  [NotificationType.APPOINTMENT_REMINDER]: 'Appointment Reminder',
  [NotificationType.PRESCRIPTION_READY]: 'Prescription Ready',
  [NotificationType.MEDICATION_REMINDER]: 'Medication Reminder',
  [NotificationType.SYSTEM_ANNOUNCEMENT]: 'System Announcement',
};

export const getNotificationTypeDisplay = (type: NotificationType): string =>
  notificationTypeDisplayMap[type] || type;

export const notificationTypeOptions = Object.entries(notificationTypeDisplayMap).map(([value, label]) => ({
  value: value as NotificationType,
  label,
}));

export const getNotificationTypeIcon = (type: NotificationType): string => {
  const icons: Record<NotificationType, string> = {
    [NotificationType.APPOINTMENT_REMINDER]: 'calendar',
    [NotificationType.PRESCRIPTION_READY]: 'pill',
    [NotificationType.MEDICATION_REMINDER]: 'clock',
    [NotificationType.SYSTEM_ANNOUNCEMENT]: 'megaphone',
  };
  return icons[type] || 'bell';
};

// ============================================
// BLOOD GROUP (Not in Prisma enum, but used in Patient)
// ============================================

export const bloodGroupOptions = [
  { value: 'A_POSITIVE', label: 'A+' },
  { value: 'A_NEGATIVE', label: 'A-' },
  { value: 'B_POSITIVE', label: 'B+' },
  { value: 'B_NEGATIVE', label: 'B-' },
  { value: 'AB_POSITIVE', label: 'AB+' },
  { value: 'AB_NEGATIVE', label: 'AB-' },
  { value: 'O_POSITIVE', label: 'O+' },
  { value: 'O_NEGATIVE', label: 'O-' },
];

export const getBloodGroupDisplay = (bloodGroup: string | null): string => {
  if (!bloodGroup) return 'Unknown';
  const option = bloodGroupOptions.find(opt => opt.value === bloodGroup);
  return option?.label || bloodGroup;
};

// ============================================
// GENERIC HELPERS
// ============================================

/**
 * Generic function to get display value from any enum map
 */
export function getEnumDisplay<T extends string>(
  value: T,
  displayMap: Record<T, string>
): string {
  return displayMap[value] || value;
}

/**
 * Generic function to get enum value from display string
 */
export function getEnumFromDisplay<T extends string>(
  display: string,
  displayMap: Record<T, string>
): T | undefined {
  const entry = Object.entries(displayMap).find(([, label]) => label === display);
  return entry ? (entry[0] as T) : undefined;
}

/**
 * Generic function to create select options from enum map
 */
export function createEnumOptions<T extends string>(
  displayMap: Record<T, string>
): Array<{ value: T; label: string }> {
  return Object.entries(displayMap).map(([value, label]) => ({
    value: value as T,
    label: label as string,
  }));
}