import { useQuery } from '@tanstack/react-query';
import { analyticsApi, type AnalyticsDateRange } from '@/api';
import type { Department } from '@/types/api.types';

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

// Get dashboard metrics
export function useDashboardMetrics(params?: AnalyticsDateRange) {
  return useQuery({
    queryKey: analyticsKeys.dashboard(params),
    queryFn: async () => {
      const response = await analyticsApi.getDashboard(params);
      return response.data;
    },
  });
}

// Get patient flow data
export function usePatientFlowData(params: AnalyticsDateRange & { 
  granularity?: 'hourly' | 'daily' | 'weekly';
  department?: Department;
}) {
  return useQuery({
    queryKey: analyticsKeys.patientFlow(params),
    queryFn: async () => {
      const response = await analyticsApi.getPatientFlow(params);
      return response.data;
    },
    enabled: !!params.startDate && !!params.endDate,
  });
}

// Get wait time analytics
export function useWaitTimeData(params: AnalyticsDateRange & { 
  department?: Department;
  granularity?: 'hourly' | 'daily';
}) {
  return useQuery({
    queryKey: analyticsKeys.waitTimes(params),
    queryFn: async () => {
      const response = await analyticsApi.getWaitTimes(params);
      return response.data;
    },
    enabled: !!params.startDate && !!params.endDate,
  });
}

// Get department load/utilization
export function useDepartmentLoad(params?: AnalyticsDateRange) {
  return useQuery({
    queryKey: analyticsKeys.departmentLoad(params),
    queryFn: async () => {
      const response = await analyticsApi.getDepartmentLoad(params);
      return response.data;
    },
  });
}

// Get staff performance metrics
export function useStaffPerformance(params?: AnalyticsDateRange & { 
  department?: Department;
  staffId?: string;
}) {
  return useQuery({
    queryKey: analyticsKeys.staffPerformance(params),
    queryFn: async () => {
      const response = await analyticsApi.getStaffPerformance(params);
      return response.data;
    },
  });
}

// Get ML prediction accuracy
export function usePredictionAccuracy(params?: AnalyticsDateRange) {
  return useQuery({
    queryKey: analyticsKeys.predictionAccuracy(params),
    queryFn: async () => {
      const response = await analyticsApi.getPredictionAccuracy(params);
      return response.data;
    },
  });
}

// Get peak hours analysis
export function usePeakHours(params?: AnalyticsDateRange) {
  return useQuery({
    queryKey: analyticsKeys.peakHours(params),
    queryFn: async () => {
      const response = await analyticsApi.getPeakHours(params);
      return response.data;
    },
  });
}

// Get today's quick stats
export function useTodayStats() {
  return useQuery({
    queryKey: analyticsKeys.todayStats(),
    queryFn: () => analyticsApi.getDashboard(), // Use dashboard, not getTodayStats
  });
}
