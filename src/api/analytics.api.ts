import api from './client';
import type { 
  AnalyticsSummary,
  DepartmentStats,
  TimeSeriesData,
  AppointmentTypeStats,
  StaffPerformance,
  MLPredictionStats,
  Department
} from '@/types/api.types';

export interface AnalyticsDateRange {
  startDate: string;
  endDate: string;
}

export const analyticsApi = {
  // Get summary statistics
  getSummary: (dateRange?: AnalyticsDateRange) => 
    api.get<AnalyticsSummary>('/analytics/summary', dateRange),

  // Get patient flow data (time series)
  getPatientFlow: (params: AnalyticsDateRange & { granularity?: 'hourly' | 'daily' | 'weekly' }) => 
    api.get<TimeSeriesData[]>('/analytics/patient-flow', params),

  // Get department statistics
  getDepartmentStats: (dateRange?: AnalyticsDateRange) => 
    api.get<DepartmentStats[]>('/analytics/departments', dateRange),

  // Get appointment type distribution
  getAppointmentTypeStats: (dateRange?: AnalyticsDateRange) => 
    api.get<AppointmentTypeStats[]>('/analytics/appointment-types', dateRange),

  // Get average wait times (time series)
  getWaitTimes: (params: AnalyticsDateRange & { department?: Department }) => 
    api.get<TimeSeriesData[]>('/analytics/wait-times', params),

  // Get staff performance metrics
  getStaffPerformance: (params?: AnalyticsDateRange & { department?: Department }) => 
    api.get<StaffPerformance[]>('/analytics/staff-performance', params),

  // Get ML prediction accuracy stats
  getPredictionStats: (dateRange?: AnalyticsDateRange) => 
    api.get<MLPredictionStats>('/analytics/prediction-accuracy', dateRange),

  // Get no-show rate data
  getNoShowRate: (params: AnalyticsDateRange & { groupBy?: 'day' | 'week' | 'month' }) => 
    api.get<TimeSeriesData[]>('/analytics/no-show-rate', params),

  // Get peak hours analysis
  getPeakHours: (dateRange?: AnalyticsDateRange) => 
    api.get<{ hour: number; avgPatients: number }[]>('/analytics/peak-hours', dateRange),

  // Get today's quick stats
  getTodayStats: () => 
    api.get<{
      patientsToday: number;
      appointmentsCompleted: number;
      appointmentsPending: number;
      averageWaitTime: number;
      prescriptionsIssued: number;
    }>('/analytics/today'),

  // Export analytics data
  exportData: (params: AnalyticsDateRange & { format: 'csv' | 'json' }) => 
    api.get<{ downloadUrl: string }>('/analytics/export', params),
};

export default analyticsApi;
