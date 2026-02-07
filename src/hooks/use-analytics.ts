import { useQuery } from '@tanstack/react-query';
import { analyticsApi, type AnalyticsDateRange } from '@/api';
import type { Department, DashboardMetrics } from '@/types/api.types';
import { extractObject, DASHBOARD_METRICS_DEFAULTS } from '@/utils/api-helpers';

// Cache durations to prevent rate limiting - increased for better performance
const STALE_TIME = 10 * 60 * 1000; // 10 minutes - data is fresh for 10 min
const CACHE_TIME = 30 * 60 * 1000; // 30 minutes - keep in cache

// Query keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: (params?: AnalyticsDateRange) => [...analyticsKeys.all, 'dashboard', params] as const,
  patientFlow: (params: unknown) => [...analyticsKeys.all, 'patient-flow', params] as const,
  waitTimes: (params: unknown) => [...analyticsKeys.all, 'wait-times', params] as const,
  departmentLoad: (params?: AnalyticsDateRange) => [...analyticsKeys.all, 'department-load', params] as const,
  staffPerformance: (params?: unknown) => [...analyticsKeys.all, 'staff-performance', params] as const,
  predictionAccuracy: (params?: AnalyticsDateRange) => [...analyticsKeys.all, 'prediction-accuracy', params] as const,
  peakHours: (params?: AnalyticsDateRange) => [...analyticsKeys.all, 'peak-hours', params] as const,
  todayStats: () => [...analyticsKeys.all, 'today-stats'] as const,
};

// Get dashboard metrics - safely extracted
export function useDashboardMetrics(params?: AnalyticsDateRange) {
  return useQuery({
    queryKey: analyticsKeys.dashboard(params),
    queryFn: async () => {
      const response = await analyticsApi.getDashboard(params);
      // Safely extract metrics, handling various response wrapper formats
      return extractObject(response, DASHBOARD_METRICS_DEFAULTS) as DashboardMetrics;
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

// Get patient flow data
export function usePatientFlowData(params: AnalyticsDateRange & { 
  granularity?: 'hourly' | 'daily' | 'weekly';
  department?: Department;
  enabled?: boolean;
}) {
  const { enabled = true, ...apiParams } = params;
  return useQuery({
    queryKey: analyticsKeys.patientFlow(apiParams),
    queryFn: async () => {
      const response = await analyticsApi.getPatientFlow(apiParams);
      return response;
    },
    enabled: enabled && !!params.startDate && !!params.endDate,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

// Get wait time analytics
export function useWaitTimeData(params: AnalyticsDateRange & { 
  department?: Department;
  granularity?: 'hourly' | 'daily';
  enabled?: boolean;
}) {
  const { enabled = true, ...apiParams } = params;
  return useQuery({
    queryKey: analyticsKeys.waitTimes(apiParams),
    queryFn: async () => {
      const response = await analyticsApi.getWaitTimes(apiParams);
      return response;
    },
    enabled: enabled && !!params.startDate && !!params.endDate,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

// Get department load/utilization
export function useDepartmentLoad(params?: AnalyticsDateRange & { enabled?: boolean }) {
  const enabled = params?.enabled ?? true;
  const apiParams = params ? { startDate: params.startDate, endDate: params.endDate } : undefined;
  return useQuery({
    queryKey: analyticsKeys.departmentLoad(apiParams),
    queryFn: async () => {
      const response = await analyticsApi.getDepartmentLoad(apiParams);
      return response;
    },
    enabled,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

// Get staff performance metrics
export function useStaffPerformance(params?: AnalyticsDateRange & { 
  department?: Department;
  staffId?: string;
  enabled?: boolean;
}) {
  const { enabled = true, ...apiParams } = params || {};
  return useQuery({
    queryKey: analyticsKeys.staffPerformance(apiParams),
    queryFn: async () => {
      const response = await analyticsApi.getStaffPerformance(apiParams);
      return response;
    },
    enabled,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

// Get ML prediction accuracy
export function usePredictionAccuracy(params?: AnalyticsDateRange & { enabled?: boolean }) {
  const enabled = params?.enabled ?? true;
  const apiParams = params ? { startDate: params.startDate, endDate: params.endDate } : undefined;
  return useQuery({
    queryKey: analyticsKeys.predictionAccuracy(apiParams),
    queryFn: async () => {
      const response = await analyticsApi.getPredictionAccuracy(apiParams);
      return response;
    },
    enabled,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

// Get peak hours analysis
export function usePeakHours(params?: AnalyticsDateRange) {
  return useQuery({
    queryKey: analyticsKeys.peakHours(params),
    queryFn: async () => {
      const response = await analyticsApi.getPeakHours(params);
      return response;
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

// Get today's quick stats - DISABLED to reduce duplicate requests
// Use useDashboardMetrics() instead which already provides today's data
export function useTodayStats() {
  return useQuery({
    queryKey: analyticsKeys.todayStats(),
    queryFn: async () => {
      const response = await analyticsApi.getDashboard();
      return response;
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    // Disabled by default - use dashboardMetrics instead
    enabled: false,
  });
}
