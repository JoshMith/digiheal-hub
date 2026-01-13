import api from './client';
import type { 
  Notification, 
  ApiResponse, 
  PaginationParams,
  NotificationType
} from '@/types/api.types';

export const notificationApi = {
  // Get all notifications for current user
  getAll: (params?: PaginationParams & { read?: boolean }) => 
    api.get<Notification[]>('/notifications', params),

  // Get unread notifications
  getUnread: () => 
    api.get<Notification[]>('/notifications/unread'),

  // Get unread count
  getUnreadCount: () => 
    api.get<{ count: number }>('/notifications/unread/count'),

  // Mark notification as read
  markAsRead: (notificationId: string) => 
    api.patch<Notification>(`/notifications/${notificationId}/read`),

  // Mark all as read
  markAllAsRead: () => 
    api.patch<{ success: boolean }>('/notifications/read-all'),

  // Delete notification
  delete: (notificationId: string) => 
    api.delete(`/notifications/${notificationId}`),

  // Delete all read notifications
  deleteRead: () => 
    api.delete('/notifications/read'),

  // Get notification preferences
  getPreferences: () => 
    api.get<Record<NotificationType, boolean>>('/notifications/preferences'),

  // Update notification preferences
  updatePreferences: (preferences: Partial<Record<NotificationType, boolean>>) => 
    api.put('/notifications/preferences', preferences),
};

export default notificationApi;
