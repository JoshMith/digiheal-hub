import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/api';
import type { 
  Staff, 
  PaginationParams,
  Department,
  StaffPosition,
  StaffAvailability
} from '@/types/api.types';

// Query keys
export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (params?: unknown) => [...staffKeys.lists(), params] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
  schedule: (id: string, params?: Record<string, unknown>) => 
    [...staffKeys.all, 'schedule', id, params] as const,
  stats: (id: string, params?: Record<string, unknown>) => 
    [...staffKeys.all, 'stats', id, params] as const,
  availability: (id: string) => [...staffKeys.all, 'availability', id] as const,
  byDepartment: (department: Department) => [...staffKeys.all, 'department', department] as const,
};

// Get all staff
export function useStaffList(params?: PaginationParams & { 
  department?: Department; 
  position?: StaffPosition;
  isActive?: boolean;
}) {
  return useQuery({
    queryKey: staffKeys.list(params),
    queryFn: async () => {
      const response = await staffApi.getAll(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });
}

// Get staff by ID
export function useStaff(staffId: string) {
  return useQuery({
    queryKey: staffKeys.detail(staffId),
    queryFn: async () => {
      const response = await staffApi.getById(staffId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!staffId,
  });
}

// Get staff by department
export function useStaffByDepartment(department: Department) {
  return useQuery({
    queryKey: staffKeys.byDepartment(department),
    queryFn: async () => {
      const response = await staffApi.getByDepartment(department);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!department,
  });
}

// Get staff schedule
export function useStaffSchedule(
  staffId: string, 
  params?: { date?: string; startDate?: string; endDate?: string }
) {
  return useQuery({
    queryKey: staffKeys.schedule(staffId, params),
    queryFn: async () => {
      const response = await staffApi.getSchedule(staffId, params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!staffId,
  });
}

// Get staff stats
export function useStaffStats(
  staffId: string, 
  dateRange?: { startDate: string; endDate: string }
) {
  return useQuery({
    queryKey: staffKeys.stats(staffId, dateRange),
    queryFn: async () => {
      const response = await staffApi.getStats(staffId, dateRange);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!staffId,
  });
}

// Get staff availability
export function useStaffAvailability(staffId: string) {
  return useQuery({
    queryKey: staffKeys.availability(staffId),
    queryFn: async () => {
      const response = await staffApi.getAvailability(staffId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!staffId,
  });
}

// Update staff
export function useUpdateStaff() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ staffId, data }: { staffId: string; data: Partial<Staff> }) => {
      const response = await staffApi.update(staffId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(staffId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
    },
  });
}

// Update staff availability
export function useUpdateStaffAvailability() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ staffId, data }: { 
      staffId: string; 
      data: Partial<StaffAvailability> 
    }) => {
      const response = await staffApi.updateAvailability(staffId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.availability(staffId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(staffId) });
    },
  });
}

// Search staff
export function useSearchStaff(query: string) {
  return useQuery({
    queryKey: staffKeys.list({ search: query }),
    queryFn: async () => {
      const response = await staffApi.search(query);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: query.length >= 2,
  });
}
