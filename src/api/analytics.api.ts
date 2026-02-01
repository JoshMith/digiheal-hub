import api from './client';
import type { 
  DashboardMetrics,
  PatientFlowData,
  DepartmentLoadData,
  StaffPerformanceData,
  PredictionAccuracyData,
  Department
} from '@/types/api.types';

export interface AnalyticsDateRange {
  startDate: string;
  endDate: string;
}

export const analyticsApi = {
  /**
   * Get dashboard metrics
   * GET /analytics/dashboard
   */
  getDashboard: (params?: AnalyticsDateRange) => 
    api.get<DashboardMetrics>('/analytics/dashboard', params),

  /**
   * Get patient flow data
   * GET /analytics/patient-flow
   */
  getPatientFlow: (params: AnalyticsDateRange & { 
    granularity?: 'hourly' | 'daily' | 'weekly';
    department?: Department;
  }) => 
    api.get<PatientFlowData[]>('/analytics/patient-flow', params),

  /**
   * Get wait time analytics
   * GET /analytics/wait-times
   */
  getWaitTimes: (params: AnalyticsDateRange & { 
    department?: Department;
    granularity?: 'hourly' | 'daily';
  }) => 
    api.get<{ hour?: string; date?: string; avgWaitTime: number }[]>('/analytics/wait-times', params),

  /**
   * Get department utilization/load
   * GET /analytics/department-load
   */
  getDepartmentLoad: (params?: AnalyticsDateRange) => 
    api.get<DepartmentLoadData[]>('/analytics/department-load', params),

  /**
   * Get staff performance metrics
   * GET /analytics/staff-performance
   */
  getStaffPerformance: (params?: AnalyticsDateRange & { 
    department?: Department;
    staffId?: string;
  }) => 
    api.get<StaffPerformanceData[]>('/analytics/staff-performance', params),

  /**
   * Get ML prediction accuracy
   * GET /analytics/prediction-accuracy
   */
  getPredictionAccuracy: (params?: AnalyticsDateRange) => 
    api.get<PredictionAccuracyData>('/analytics/prediction-accuracy', params),

  /**
   * Get today's quick stats (convenience method)
   */
  getTodayStats: () => 
    api.get<{
      patientsToday: number;
      appointmentsCompleted: number;
      appointmentsPending: number;
      averageWaitTime: number;
      prescriptionsIssued: number;
    }>('/analytics/dashboard'),

  /**
   * Get peak hours analysis
   */
  getPeakHours: (params?: AnalyticsDateRange) => 
    api.get<{ hour: number; avgPatients: number }[]>('/analytics/peak-hours', params),

  /**
   * Export analytics data
   */
  exportData: (params: AnalyticsDateRange & { 
    format: 'csv' | 'json';
    type: 'patient-flow' | 'wait-times' | 'staff-performance';
  }) => 
    api.get<{ downloadUrl: string }>('/analytics/export', params),
};

export default analyticsApi;
