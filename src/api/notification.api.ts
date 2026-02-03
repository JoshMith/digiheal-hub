// ============================================
// DKUT Medical Center - Notification API Service
// ============================================

import api from './client';
import type { 
  Notification, 
  NotificationType,
  PaginationParams
} from '@/types/api.types';

// ============================================
// TYPES
// ============================================

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  read?: boolean;
  unreadOnly?: boolean;
}

export interface NotificationPreferences {
  APPOINTMENT_REMINDER?: boolean;
  APPOINTMENT_CANCELLED?: boolean;
  PRESCRIPTION_READY?: boolean;
  MEDICATION_REMINDER?: boolean;
  SYSTEM_ANNOUNCEMENT?: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkAllReadResponse {
  success: boolean;
  count: number;
}

// ============================================
// NOTIFICATION API
// ============================================

export const notificationApi = {
  /**
   * Get all notifications for current user
   * GET /notifications
   */
  getAll: (params?: NotificationQueryParams) => 
    api.get<Notification[]>('/notifications', { params }),

  /**
   * Get unread notifications
   * GET /notifications/unread
   */
  getUnread: () => 
    api.get<Notification[]>('/notifications/unread'),

  /**
   * Get unread count
   * GET /notifications/unread/count
   */
  getUnreadCount: () => 
    api.get<UnreadCountResponse>('/notifications/unread/count'),

  /**
   * Mark notification as read
   * PUT /notifications/:id/read
   */
  markAsRead: (notificationId: string) => 
    api.put<Notification>(`/notifications/${notificationId}/read`),

  /**
   * Mark all as read
   * PUT /notifications/read-all
   */
  markAllAsRead: () => 
    api.put<MarkAllReadResponse>('/notifications/read-all'),

  /**
   * Delete notification
   * DELETE /notifications/:id
   */
  delete: (notificationId: string) => 
    api.delete(`/notifications/${notificationId}`),

  /**
   * Delete all read notifications
   * DELETE /notifications/read
   */
  deleteRead: () => 
    api.delete('/notifications/read'),

  /**
   * Get notification preferences
   * GET /notifications/preferences
   */
  getPreferences: () => 
    api.get<NotificationPreferences>('/notifications/preferences'),

  /**
   * Update notification preferences
   * PUT /notifications/preferences
   */
  updatePreferences: (preferences: Partial<NotificationPreferences>) => 
    api.put<NotificationPreferences>('/notifications/preferences', preferences),

  /**
   * Get notification by ID
   * GET /notifications/:id
   */
  getById: (notificationId: string) => 
    api.get<Notification>(`/notifications/${notificationId}`),

  /**
   * Mark notification as unread
   * PUT /notifications/:id/unread
   */
  markAsUnread: (notificationId: string) => 
    api.put<Notification>(`/notifications/${notificationId}/unread`),
};

export default notificationApi;