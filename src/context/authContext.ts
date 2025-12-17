import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode} from "react";
import { authApi } from "@/api/auth.api";
import { getToken, clearTokens } from "@/api/client";
import { Patient, Staff, UserRole, LoginRequest, PatientRegistrationRequest, StaffRegistrationRequest} from "@/types/api.types";

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
      const token = getToken();

      if (!token) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const response = await authApi.getProfile();

        if (response.success && response.data) {
          const { data } = response;
          setState({
            user: {
              id: data.id,
              email: data.email,
              role: data.role as UserRole,
            },
            profile: data.profile || data.patient || data.staff || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          clearTokens();
          setState({ ...initialState, isLoading: false });
        }
      } catch (error) {
        clearTokens();
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

      if (response.success && response.data) {
        setState({
          user: {
            id: response.data.user.id,
            email: response.data.user.email,
            role: response.data.user.role as UserRole,
          },
          profile: response.data.profile,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.message || "Login failed");
      }
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

        if (response.success && response.data) {
          // Fetch full profile after registration
          const profileResponse = await authApi.getProfile();

          if (profileResponse.success && profileResponse.data) {
            setState({
              user: {
                id: response.data.user.id,
                email: response.data.user.email,
                role: response.data.user.role as UserRole,
              },
              profile:
                profileResponse.data.profile ||
                profileResponse.data.patient ||
                null,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } else {
          throw new Error(response.message || "Registration failed");
        }
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

      if (response.success && response.data) {
        // Fetch full profile after registration
        const profileResponse = await authApi.getProfile();

        if (profileResponse.success && profileResponse.data) {
          setState({
            user: {
              id: response.data.user.id,
              email: response.data.user.email,
              role: response.data.user.role as UserRole,
            },
            profile:
              profileResponse.data.profile ||
              profileResponse.data.staff ||
              null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        }
      } else {
        throw new Error(response.message || "Registration failed");
      }
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

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          profile:
            response.data?.profile ||
            response.data?.patient ||
            response.data?.staff ||
            null,
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
      const response = await authApi.updateProfile(data);

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          profile: response.data || null,
          isLoading: false,
        }));
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
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
  }, []);

  // Change password
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await authApi.changePassword({
          currentPassword,
          newPassword,
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to change password");
        }

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
  const isPatient = state.user?.role === "PATIENT";
  const isStaff = state.user?.role === "STAFF";
  const isAdmin = state.user?.role === "ADMIN";

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
