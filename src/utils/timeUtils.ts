// ============================================
// DKUT Medical Center - Time Utilities
// Convert between 12-hour and 24-hour time formats
// ============================================

/**
 * Convert 12-hour time format to 24-hour format
 * @param time12h - Time in 12-hour format (e.g., "09:00 AM", "02:30 PM")
 * @returns Time in 24-hour format (e.g., "09:00", "14:30")
 * 
 * @example
 * convertTo24Hour("09:00 AM") // Returns "09:00"
 * convertTo24Hour("02:30 PM") // Returns "14:30"
 * convertTo24Hour("12:00 PM") // Returns "12:00"
 * convertTo24Hour("12:00 AM") // Returns "00:00"
 */
export const convertTo24Hour = (time12h: string): string => {
  const [time, period] = time12h.trim().split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Convert 24-hour time format to 12-hour format
 * @param time24h - Time in 24-hour format (e.g., "09:00", "14:30")
 * @returns Time in 12-hour format (e.g., "09:00 AM", "02:30 PM")
 * 
 * @example
 * convertTo12Hour("09:00") // Returns "09:00 AM"
 * convertTo12Hour("14:30") // Returns "02:30 PM"
 * convertTo12Hour("12:00") // Returns "12:00 PM"
 * convertTo12Hour("00:00") // Returns "12:00 AM"
 */
export const convertTo12Hour = (time24h: string): string => {
  const [hours, minutes] = time24h.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Generate time slots in 24-hour format for backend
 * @param startHour - Starting hour (default: 8 for 8 AM)
 * @param endHour - Ending hour (default: 17 for 5 PM)
 * @param intervalMinutes - Interval between slots in minutes (default: 30)
 * @returns Array of time strings in 24-hour format
 * 
 * @example
 * generateTimeSlots24h() // Returns ["08:00", "08:30", "09:00", ..., "16:30"]
 * generateTimeSlots24h(9, 12, 15) // Returns ["09:00", "09:15", "09:30", ..., "11:45"]
 */
export const generateTimeSlots24h = (
  startHour: number = 8,
  endHour: number = 17,
  intervalMinutes: number = 30
): string[] => {
  const slots: string[] = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }
  
  return slots;
};

/**
 * Generate time slots in 12-hour format for display
 * @param startHour - Starting hour (default: 8 for 8 AM)
 * @param endHour - Ending hour (default: 17 for 5 PM)
 * @param intervalMinutes - Interval between slots in minutes (default: 30)
 * @returns Array of time strings in 12-hour format
 * 
 * @example
 * generateTimeSlots12h() // Returns ["08:00 AM", "08:30 AM", "09:00 AM", ..., "04:30 PM"]
 */
export const generateTimeSlots12h = (
  startHour: number = 8,
  endHour: number = 17,
  intervalMinutes: number = 30
): string[] => {
  return generateTimeSlots24h(startHour, endHour, intervalMinutes).map(convertTo12Hour);
};

/**
 * Convert array of 24-hour times to 12-hour format
 * @param times24h - Array of times in 24-hour format
 * @returns Array of times in 12-hour format
 */
export const convertSlotsTo12Hour = (times24h: string[]): string[] => {
  return times24h.map(convertTo12Hour);
};

/**
 * Convert array of 12-hour times to 24-hour format
 * @param times12h - Array of times in 12-hour format
 * @returns Array of times in 24-hour format
 */
export const convertSlotsTo24Hour = (times12h: string[]): string[] => {
  return times12h.map(convertTo24Hour);
};

/**
 * Format time for backend (HH:MM:SS format)
 * @param time24h - Time in 24-hour format (HH:MM)
 * @returns Time with seconds (HH:MM:SS)
 */
export const formatTimeForBackend = (time24h: string): string => {
  return `${time24h}:00`;
};

/**
 * Parse time from backend (strip seconds if present)
 * @param timeFromBackend - Time string (may include seconds)
 * @returns Time without seconds (HH:MM)
 */
export const parseTimeFromBackend = (timeFromBackend: string): string => {
  return timeFromBackend.substring(0, 5); // Get HH:MM only
};