// ============================================
// Safe API Response Extraction Utilities
// Handles inconsistent response formats from backend
// ============================================

/**
 * Safely extract an array from various API response formats.
 * Handles: direct array, { data: [...] }, { items: [...] }, { results: [...] }, etc.
 */
export function extractArray<T>(response: unknown): T[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;

  if (typeof response === 'object' && response !== null) {
    const r = response as Record<string, unknown>;

    // { data: [...] } pattern (paginated response after get() strips success)
    if (Array.isArray(r.data)) return r.data;

    // { items: [...] } pattern
    if (Array.isArray(r.items)) return r.items;

    // { results: [...] } pattern
    if (Array.isArray(r.results)) return r.results;

    // Nested: { data: { items: [...] } } or { data: { results: [...] } }
    if (r.data && typeof r.data === 'object') {
      const d = r.data as Record<string, unknown>;
      if (Array.isArray(d.items)) return d.items;
      if (Array.isArray(d.results)) return d.results;
    }
  }

  console.warn('[extractArray] Unknown response structure:', typeof response);
  return [];
}

/**
 * Safely extract a stats/metrics object from API responses.
 * Handles: direct object, { data: {...} } wrapper, double-wrapped { data: { data: {...} } }
 * Returns the object merged with defaults so missing fields fallback gracefully.
 */
export function extractObject<T extends Record<string, unknown>>(
  response: unknown,
  defaults: T
): T {
  if (!response || typeof response !== 'object') return defaults;

  const r = response as Record<string, unknown>;

  // If response has a 'data' property that is an object (not array), it might be wrapped
  if (
    'data' in r &&
    r.data !== null &&
    typeof r.data === 'object' &&
    !Array.isArray(r.data)
  ) {
    // Check if 'data' looks like the actual payload (has expected keys)
    const dataObj = r.data as Record<string, unknown>;
    const defaultKeys = Object.keys(defaults);
    const dataHasExpectedKeys = defaultKeys.some((key) => key in dataObj);

    if (dataHasExpectedKeys) {
      return { ...defaults, ...dataObj } as T;
    }
  }

  // Check if the response itself has the expected keys (unwrapped already)
  const defaultKeys = Object.keys(defaults);
  const responseHasExpectedKeys = defaultKeys.some((key) => key in r);

  if (responseHasExpectedKeys) {
    return { ...defaults, ...(r as object) } as T;
  }

  console.warn('[extractObject] Could not find expected fields in response:', Object.keys(r));
  return defaults;
}

/**
 * Default values for DashboardMetrics to prevent undefined access
 */
export const DASHBOARD_METRICS_DEFAULTS = {
  totalPatientsToday: 0,
  avgWaitTime: 0,
  avgInteractionTime: 0,
  totalAppointments: 0,
  completedAppointments: 0,
  noShowCount: 0,
  noShowRate: 0,
  completionRate: 0,
  mlAccuracy: 0,
};

/**
 * Default values for appointment stats
 */
export const APPOINTMENT_STATS_DEFAULTS = {
  total: 0,
  completed: 0,
  cancelled: 0,
  noShow: 0,
  completionRate: 0,
  noShowRate: 0,
};

/**
 * Default values for patient stats
 */
export const PATIENT_STATS_DEFAULTS = {
  totalAppointments: 0,
  completedAppointments: 0,
  cancelledAppointments: 0,
  upcomingAppointments: 0,
  lastVisit: null as string | null,
  activePrescriptions: 0,
  totalPrescriptions: 0,
};
