// ============================================
// DKUT Medical Center - Data Transformation Utilities
// Handle conversions between frontend display and backend data formats
// ============================================

import { format, parseISO, differenceInYears, formatDistanceToNow, isValid } from 'date-fns';
import type { Patient, Staff, VitalSigns } from '../types/api.types';

// ============================================
// NAME UTILITIES
// Backend stores firstName + lastName, frontend sometimes needs combined name
// ============================================

/**
 * Combine firstName and lastName into a full name
 */
export const getFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

/**
 * Get full name from Patient or Staff object
 */
export const getEntityFullName = (entity: Pick<Patient | Staff, 'firstName' | 'lastName'>): string => {
  return getFullName(entity.firstName, entity.lastName);
};

/**
 * Split a full name into firstName and lastName
 * Note: This is a simple split - may not handle all name formats correctly
 */
export const splitFullName = (fullName: string): { firstName: string; lastName: string } => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  const lastName = parts.pop() || '';
  const firstName = parts.join(' ');
  return { firstName, lastName };
};

/**
 * Get initials from a name
 */
export const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName.charAt(0).toUpperCase();
  return `${first}${last}`;
};

/**
 * Get initials from Patient or Staff object
 */
export const getEntityInitials = (entity: Pick<Patient | Staff, 'firstName' | 'lastName'>): string => {
  return getInitials(entity.firstName, entity.lastName);
};

// ============================================
// DATE UTILITIES
// Backend stores dateOfBirth, frontend displays age
// ============================================

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: string | Date): number => {
  const dob = typeof dateOfBirth === 'string' ? parseISO(dateOfBirth) : dateOfBirth;
  return differenceInYears(new Date(), dob);
};

/**
 * Format date for display (e.g., "January 15, 2025")
 */
export const formatDate = (date: string | Date, formatStr: string = 'PPP'): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return 'Invalid date';
  return format(d, formatStr);
};

/**
 * Format date for API requests (YYYY-MM-DD)
 */
export const formatDateForApi = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Format date and time (e.g., "Jan 15, 2025 at 9:00 AM")
 */
export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return 'Invalid date';
  return format(d, "MMM d, yyyy 'at' h:mm a");
};

/**
 * Format time only (e.g., "9:00 AM")
 */
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return format(date, 'h:mm a');
};

/**
 * Format appointment time (e.g., "09:00" -> "9:00 AM")
 */
export const formatAppointmentTime = (time: string): string => {
  return formatTime(time);
};

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 */
export const getRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return 'Unknown';
  return formatDistanceToNow(d, { addSuffix: true });
};

/**
 * Format date for short display (e.g., "Jan 15")
 */
export const formatDateShort = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return 'Invalid';
  return format(d, 'MMM d');
};

/**
 * Check if a date is today
 */
export const isToday = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

/**
 * Check if a date is in the past
 */
export const isPastDate = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return d < new Date();
};

// ============================================
// VITAL SIGNS UTILITIES
// Backend stores separate systolic/diastolic, frontend displays "120/80"
// ============================================

/**
 * Combine blood pressure values into display string
 */
export const formatBloodPressure = (
  systolic: number | null,
  diastolic: number | null
): string => {
  if (systolic === null || diastolic === null) return 'N/A';
  return `${systolic}/${diastolic}`;
};

/**
 * Parse blood pressure string into systolic and diastolic
 */
export const parseBloodPressure = (bp: string): { systolic: number; diastolic: number } | null => {
  const match = bp.match(/^(\d+)\/(\d+)$/);
  if (!match) return null;
  return {
    systolic: parseInt(match[1], 10),
    diastolic: parseInt(match[2], 10),
  };
};

/**
 * Format temperature with unit
 */
export const formatTemperature = (temp: number | null, unit: 'C' | 'F' = 'C'): string => {
  if (temp === null) return 'N/A';
  return `${temp.toFixed(1)}°${unit}`;
};

/**
 * Format heart rate with unit
 */
export const formatHeartRate = (rate: number | null): string => {
  if (rate === null) return 'N/A';
  return `${rate} bpm`;
};

/**
 * Format oxygen saturation with unit
 */
export const formatOxygenSaturation = (spo2: number | null): string => {
  if (spo2 === null) return 'N/A';
  return `${spo2}%`;
};

/**
 * Format respiratory rate with unit
 */
export const formatRespiratoryRate = (rate: number | null): string => {
  if (rate === null) return 'N/A';
  return `${rate} /min`;
};

/**
 * Format weight with unit
 */
export const formatWeight = (weight: number | null, unit: 'kg' | 'lbs' = 'kg'): string => {
  if (weight === null) return 'N/A';
  return `${weight} ${unit}`;
};

/**
 * Format height with unit
 */
export const formatHeight = (height: number | null, unit: 'cm' | 'ft' = 'cm'): string => {
  if (height === null) return 'N/A';
  return `${height} ${unit}`;
};

/**
 * Calculate BMI from weight (kg) and height (cm)
 */
export const calculateBMI = (weight: number | null, height: number | null): number | null => {
  if (weight === null || height === null || height === 0) return null;
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

/**
 * Get BMI category
 */
export const getBMICategory = (bmi: number | null): string => {
  if (bmi === null) return 'N/A';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

/**
 * Format all vital signs for display
 */
export const formatVitalSigns = (vitals: VitalSigns): Record<string, string> => {
  return {
    bloodPressure: formatBloodPressure(vitals.bloodPressureSystolic, vitals.bloodPressureDiastolic),
    heartRate: formatHeartRate(vitals.heartRate),
    temperature: formatTemperature(vitals.temperature),
    weight: formatWeight(vitals.weight),
    height: formatHeight(vitals.height),
    oxygenSaturation: formatOxygenSaturation(vitals.oxygenSaturation),
    respiratoryRate: formatRespiratoryRate(vitals.respiratoryRate),
    bmi: calculateBMI(vitals.weight, vitals.height)?.toString() || 'N/A',
    recordedAt: formatDateTime(vitals.recordedAt),
  };
};

// ============================================
// DURATION UTILITIES
// ============================================

/**
 * Format duration in minutes to readable string
 */
export const formatDuration = (minutes: number | null): string => {
  if (minutes === null) return 'N/A';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
};

/**
 * Format wait time with appropriate context
 */
export const formatWaitTime = (minutes: number | null): string => {
  if (minutes === null) return 'Unknown';
  if (minutes < 5) return 'Less than 5 min';
  if (minutes < 60) return `~${Math.round(minutes / 5) * 5} min`;
  return formatDuration(minutes);
};

// ============================================
// PHONE NUMBER UTILITIES
// ============================================

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  // Handle Kenyan phone numbers
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('254')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Normalize phone number for API
 */
export const normalizePhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  }
  if (!cleaned.startsWith('254') && cleaned.length === 9) {
    cleaned = '254' + cleaned;
  }
  return '+' + cleaned;
};

// ============================================
// STUDENT ID UTILITIES
// ============================================

/**
 * Format student ID for display
 */
export const formatStudentId = (studentId: string): string => {
  // Already in format like "SCT221-0001/2021"
  return studentId.toUpperCase();
};

/**
 * Validate student ID format
 */
export const isValidStudentId = (studentId: string): boolean => {
  // Pattern: XXX###-####/#### (e.g., SCT221-0001/2021)
  const pattern = /^[A-Z]{2,4}\d{2,3}-\d{4}\/\d{4}$/;
  return pattern.test(studentId.toUpperCase());
};

// ============================================
// CURRENCY / NUMBER UTILITIES
// ============================================

/**
 * Format number with thousands separator
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// ============================================
// PATIENT DATA TRANSFORMATIONS
// ============================================

/**
 * Transform patient data for display in UI
 */
export const transformPatientForDisplay = (patient: Patient) => {
  return {
    ...patient,
    fullName: getFullName(patient.firstName, patient.lastName),
    initials: getInitials(patient.firstName, patient.lastName),
    age: calculateAge(patient.dateOfBirth),
    formattedDob: formatDate(patient.dateOfBirth, 'PPP'),
    formattedPhone: formatPhoneNumber(patient.phone),
    allergiesDisplay: patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None',
    chronicConditionsDisplay: patient.chronicConditions.length > 0 
      ? patient.chronicConditions.join(', ') 
      : 'None',
  };
};

/**
 * Transform staff data for display in UI
 */
export const transformStaffForDisplay = (staff: Staff) => {
  return {
    ...staff,
    fullName: getFullName(staff.firstName, staff.lastName),
    initials: getInitials(staff.firstName, staff.lastName),
    formattedPhone: formatPhoneNumber(staff.phone),
  };
};