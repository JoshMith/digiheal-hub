import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode} from "react";
import { authApi } from "@/api/auth.api";
import { tokenManager } from "@/api/client";
import { Patient, Staff, UserRole, LoginRequest, PatientRegistrationRequest, StaffRegistrationRequest} from "@/types/api.types";

// Profile response type from getProfile endpoint
interface ProfileResponse {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  profile?: Patient | Staff | null;
  patient?: Patient | null;
  staff?: Staff | null;
}

// Auth state interface
interface AuthState {
  user: {
    id: string;
    email: string;
    role: UserRole;
  } | null;
  profile: Patient | Staff | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth context interface
interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  registerPatient: (data: PatientRegistrationRequest) => Promise<void>;
  registerStaff: (data: StaffRegistrationRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<Patient | Staff>) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  clearError: () => void;
  isPatient: boolean;
  isStaff: boolean;
  isAdmin: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState);

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenManager.getAccessToken();

      if (!token) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const response = await authApi.getProfile();
        const profileData = response as unknown as ProfileResponse;

        if (profileData && profileData.id) {
          setState({
            user: {
              id: profileData.id,
              email: profileData.email,
              role: profileData.role as UserRole,
            },
            profile: profileData.profile || profileData.patient || profileData.staff || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          tokenManager.clearTokens();
          setState({ ...initialState, isLoading: false });
        }
      } catch (error) {
        tokenManager.clearTokens();
        setState({ ...initialState, isLoading: false });
      }
    };

    initAuth();
  }, []);

  // Login
  const login = useCallback(async (data: LoginRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.login(data);

      // Auth API already handles token storage in login method
      setState({
        user: {
          id: response.user.id,
          email: response.user.email,
          role: response.user.role as UserRole,
        },
        profile: response.profile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      throw error;
    }
  }, []);

  // Register patient
  const registerPatient = useCallback(
    async (data: PatientRegistrationRequest) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await authApi.registerPatient(data);

        // Auth API already handles token storage in registerPatient method
        setState({
          user: {
            id: response.user.id,
            email: response.user.email,
            role: response.user.role as UserRole,
          },
          profile: response.profile,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Registration failed";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        throw error;
      }
    },
    []
  );

  // Register staff
  const registerStaff = useCallback(async (data: StaffRegistrationRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.registerStaff(data);

      // Auth API already handles token storage in registerStaff method
      setState({
        user: {
          id: response.user.id,
          email: response.user.email,
          role: response.user.role as UserRole,
        },
        profile: response.profile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await authApi.logout();
    } finally {
      // Auth API already clears tokens in logout method
      setState({
        ...initialState,
        isLoading: false,
      });
    }
  }, []);

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    if (!state.isAuthenticated) return;

    try {
      const response = await authApi.getProfile();
      const profileData = response as unknown as ProfileResponse;

      if (profileData && profileData.id) {
        setState((prev) => ({
          ...prev,
          profile: profileData.profile || profileData.patient || profileData.staff || null,
        }));
      }
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    }
  }, [state.isAuthenticated]);
  // Update profile
  const updateProfile = useCallback(async (data: Partial<Patient | Staff>) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Determine which update method to use based on current user role
      let updatedProfile: Patient | Staff;
      
      if (state.user?.role === UserRole.PATIENT) {
        updatedProfile = await authApi.updatePatientProfile(data);
      } else if (state.user?.role === UserRole.STAFF || state.user?.role === UserRole.ADMIN) {
        updatedProfile = await authApi.updateStaffProfile(data);
      } else {
        throw new Error("Unable to determine profile type");
      }

      setState((prev) => ({
        ...prev,
        profile: updatedProfile,
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      throw error;
    }
  }, [state.user?.role]);

  // Change password
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        await authApi.changePassword({
          currentPassword,
          newPassword,
        });

        setState((prev) => ({ ...prev, isLoading: false }));
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to change password";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        throw error;
      }
    },
    []
  );

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Computed values
  const isPatient = state.user?.role === UserRole.PATIENT;
  const isStaff = state.user?.role === UserRole.STAFF;
  const isAdmin = state.user?.role === UserRole.ADMIN;

  const contextValue: AuthContextType = {
    ...state,
    login,
    registerPatient,
    registerStaff,
    logout,
    refreshProfile,
    updateProfile,
    changePassword,
    clearError,
    isPatient,
    isStaff,
    isAdmin,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export default AuthContext;