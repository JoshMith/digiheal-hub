import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/api';
import type { 
  Staff, 
  PaginationParams,
  Department,
  StaffPosition 
} from '@/types/api.types';
import type { StaffAvailability } from '@/api/staff.api';

// Query keys
export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (params?: unknown) => [...staffKeys.lists(), params] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
  me: () => [...staffKeys.details(), 'me'] as const,
  schedule: (id: string, params?: Record<string, unknown>) => 
    [...staffKeys.all, 'schedule', id, params] as const,
  stats: (id: string, params?: Record<string, unknown>) => 
    [...staffKeys.all, 'stats', id, params] as const,
  availability: (id: string) => [...staffKeys.all, 'availability', id] as const,
  byDepartment: (department: Department, params?: unknown) => 
    [...staffKeys.all, 'department', department, params] as const,
  appointments: (id: string, params?: unknown) => 
    [...staffKeys.all, 'appointments', id, params] as const,
  patients: (id: string, params?: unknown) => 
    [...staffKeys.all, 'patients', id, params] as const,
};

// Get all staff
export function useStaffList(params?: PaginationParams & { 
  department?: Department; 
  position?: StaffPosition;
  isActive?: boolean;
  search?: string;
}) {
  return useQuery({
    queryKey: staffKeys.list(params),
    queryFn: () => staffApi.getAll(params),
  });
}

// Get staff by ID
export function useStaff(staffId: string) {
  return useQuery({
    queryKey: staffKeys.detail(staffId),
    queryFn: () => staffApi.getById(staffId),
    enabled: !!staffId,
  });
}

// Get current staff profile
export function useMyStaffProfile() {
  return useQuery({
    queryKey: staffKeys.me(),
    queryFn: () => staffApi.getMyProfile(),
  });
}

// Get staff by department
export function useStaffByDepartment(
  department: Department,
  params?: Partial<PaginationParams>
) {
  return useQuery({
    queryKey: staffKeys.byDepartment(department, params),
    queryFn: () => staffApi.getByDepartment(department, params),
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
    queryFn: () => staffApi.getSchedule(staffId, params),
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
    queryFn: () => staffApi.getStats(staffId, dateRange),
    enabled: !!staffId,
  });
}

// Get staff availability
export function useStaffAvailability(staffId: string) {
  return useQuery({
    queryKey: staffKeys.availability(staffId),
    queryFn: () => staffApi.getAvailability(staffId),
    enabled: !!staffId,
  });
}

// Get staff appointments
export function useStaffAppointments(staffId: string, params?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: staffKeys.appointments(staffId, params),
    queryFn: () => staffApi.getAppointments(staffId, params),
    enabled: !!staffId,
  });
}

// Get staff patients
export function useStaffPatients(staffId: string, params?: Partial<PaginationParams>) {
  return useQuery({
    queryKey: staffKeys.patients(staffId, params),
    queryFn: () => staffApi.getPatients(staffId, params),
    enabled: !!staffId,
  });
}

// Get available staff
export function useAvailableStaff(params?: {
  department?: Department;
  date?: string;
  time?: string;
}) {
  return useQuery({
    queryKey: staffKeys.list({ ...params, isActive: true }),
    queryFn: () => staffApi.getAvailable(params),
  });
}

// Create staff (admin only)
export function useCreateStaff() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Staff>) => staffApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
    },
  });
}

// Update staff
export function useUpdateStaff() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ staffId, data }: { staffId: string; data: Partial<Staff> }) => 
      staffApi.update(staffId, data),
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
    mutationFn: ({ staffId, data }: { 
      staffId: string; 
      data: Partial<StaffAvailability> 
    }) => staffApi.updateAvailability(staffId, data),
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.availability(staffId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(staffId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
    },
  });
}

// Update staff schedule
export function useUpdateStaffSchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ staffId, data }: { 
      staffId: string; 
      data: Partial<any> // StaffSchedule type from staff.api
    }) => staffApi.updateSchedule(staffId, data),
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.schedule(staffId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(staffId) });
    },
  });
}

// Toggle staff status
export function useToggleStaffStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ staffId, isActive }: { staffId: string; isActive: boolean }) => 
      staffApi.toggleStatus(staffId, isActive),
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(staffId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
    },
  });
}

// Delete/deactivate staff (admin only)
export function useDeleteStaff() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (staffId: string) => staffApi.delete(staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
    },
  });
}

// Search staff
export function useSearchStaff(query: string) {
  return useQuery({
    queryKey: staffKeys.list({ search: query }),
    queryFn: () => staffApi.search(query),
    enabled: query.length >= 2,
  });
}