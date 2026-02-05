// ============================================
// DKUT Medical Center - Analytics API Service
// ============================================

import { get } from './client';
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

export interface PatientFlowParams {
  startDate: string;
  endDate: string;
  granularity?: 'hourly' | 'daily' | 'weekly';
  department?: Department;
}

export interface WaitTimeParams {
  startDate: string;
  endDate: string;
  department?: Department;
  granularity?: 'hourly' | 'daily';
}

export interface StaffPerformanceParams {
  startDate?: string;
  endDate?: string;
  department?: Department;
  staffId?: string;
}

export interface WaitTimeData {
  hour?: string;
  date?: string;
  time?: string;
  avgWaitTime?: number;
  actualWaitTime?: number;
  predictedWaitTime?: number;
}

export interface TodayStats {
  totalPatients: number;
  todayPatients: number;
  appointmentsCompleted: number;
  appointmentsPending: number;
  avgWaitTime: number;
  averageWaitTime: number;
  prescriptionsIssued: number;
  completionRate: number;
  noShowRate: number;
  predictionAccuracy: number;
}

export interface PeakHourData {
  hour: number;
  avgPatients: number;
  count?: number;
}

export interface ExportDataParams {
  startDate: string;
  endDate: string;
  format: 'csv' | 'json';
  type: 'patient-flow' | 'wait-times' | 'staff-performance';
}

export interface ExportDataResponse {
  downloadUrl: string;
}

export interface AppointmentStatsParams {
  startDate?: string;
  endDate?: string;
  department?: Department;
}

export interface AppointmentStatsResponse {
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
  noShow: number;
  completionRate: number;
}

export interface InteractionStatsResponse {
  totalInteractions: number;
  avgDuration: number;
  avgWaitTime: number;
  predictionAccuracy: number;
}

// ============================================
// ANALYTICS API
// ============================================

export const analyticsApi = {
  /**
   * Get dashboard metrics
   * GET /analytics/dashboard
   */
  getDashboard: (params?: AnalyticsDateRange) => 
    get<DashboardMetrics>('/analytics/dashboard', { params }),

  /**
   * Get patient flow data
   * GET /analytics/patient-flow
   */
  getPatientFlow: (params: PatientFlowParams) => 
    get<PatientFlowData[]>('/analytics/patient-flow', { params }),

  /**
   * Get wait time analytics
   * GET /analytics/wait-times
   */
  getWaitTimes: (params: WaitTimeParams) => 
    get<WaitTimeData[]>('/analytics/wait-times', { params }),

  /**
   * Get department utilization/load
   * GET /analytics/department-load
   */
  getDepartmentLoad: (params?: AnalyticsDateRange) => 
    get<DepartmentLoadData[]>('/analytics/department-load', { params }),

  /**
   * Get staff performance metrics
   * GET /analytics/staff-performance
   */
  getStaffPerformance: (params?: StaffPerformanceParams) => 
    get<StaffPerformanceData[]>('/analytics/staff-performance', { params }),

  /**
   * Get ML prediction accuracy
   * GET /analytics/prediction-accuracy
   */
  getPredictionAccuracy: (params?: AnalyticsDateRange) => 
    get<PredictionAccuracyData[]>('/analytics/prediction-accuracy', { params }),

  /**
   * Get today's quick stats
   * GET /analytics/today
   */
  getTodayStats: () => 
    get<TodayStats>('/analytics/today'),

  /**
   * Get peak hours analysis
   * GET /analytics/peak-hours
   */
  getPeakHours: (params?: AnalyticsDateRange) => 
    get<PeakHourData[]>('/analytics/peak-hours', { params }),

  /**
   * Export analytics data
   * GET /analytics/export
   */
  exportData: (params: ExportDataParams) => 
    get<ExportDataResponse>('/analytics/export', { params }),

  /**
   * Get appointment statistics
   * GET /analytics/appointments
   */
  getAppointmentStats: (params?: AppointmentStatsParams) => 
    get<AppointmentStatsResponse>('/analytics/appointments', { params }),

  /**
   * Get interaction statistics  
   * GET /analytics/interactions
   */
  getInteractionStats: (params?: AnalyticsDateRange) => 
    get<InteractionStatsResponse>('/analytics/interactions', { params }),
};

export default analyticsApi;