import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import { UserRole } from '@/types/api.types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * Protected Route component that checks authentication and authorization
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/auth',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === 'PATIENT') {
      return <Navigate to="/patient-dashboard" replace />;
    } else if (user.role === 'STAFF' || user.role === 'ADMIN') {
      return <Navigate to="/staff-portal" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

/**
 * Route that redirects authenticated users away (e.g., login page)
 */
interface PublicRouteProps {
  children: React.ReactNode;
  redirectAuthenticated?: boolean;
}

export function PublicRoute({
  children,
  redirectAuthenticated = false,
}: PublicRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to their dashboard
  if (redirectAuthenticated && isAuthenticated && user) {
    if (user.role === 'PATIENT') {
      return <Navigate to="/patient-dashboard" replace />;
    } else if (user.role === 'STAFF' || user.role === 'ADMIN') {
      return <Navigate to="/staff-portal" replace />;
    }
  }

  return <>{children}</>;
}

export default ProtectedRoute;