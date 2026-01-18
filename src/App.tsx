import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/authContext';
import { InteractionProvider } from '@/context/interactionContext';
import { ProtectedRoute, PublicRoute } from '@/components/ProtectedRoute';
import { FloatingTimer } from '@/components/FloatingTimer';
import { Toaster } from '@/components/ui/toaster';
import { Loader2 } from 'lucide-react';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const StaffAuth = lazy(() => import('@/pages/StaffAuth'));
const PatientDashboard = lazy(() => import('@/pages/PatientDashboard'));
const StaffPortal = lazy(() => import('@/pages/StaffPortal'));
const BookAppointment = lazy(() => import('@/pages/BookAppointment'));
const Services = lazy(() => import('@/pages/Services'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Features = lazy(() => import('@/pages/Features'));
const EditProfile = lazy(() => import('@/pages/EditProfile'));
const PatientDetail = lazy(() => import('@/pages/PatientDetail'));
const NewPatient = lazy(() => import('@/pages/NewPatient'));
const StaffSettings = lazy(() => import('@/pages/StaffSettings'));
const AnalyticsDashboard = lazy(() => import('@/pages/AnalyticsDashboard'));
const AdminPortal = lazy(() => import('@/pages/AdminPortal'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InteractionProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/features" element={<Features />} />

                {/* Auth routes - redirect if already authenticated */}
                <Route
                  path="/auth"
                  element={
                    <PublicRoute redirectAuthenticated>
                      <Auth />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/staff-auth"
                  element={
                    <PublicRoute redirectAuthenticated>
                      <StaffAuth />
                    </PublicRoute>
                  }
                />

                {/* Patient protected routes */}
                <Route
                  path="/patient-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['PATIENT']}>
                      <PatientDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-profile"
                  element={
                    <ProtectedRoute allowedRoles={['PATIENT']}>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/book-appointment"
                  element={
                    <ProtectedRoute allowedRoles={['PATIENT']}>
                      <BookAppointment />
                    </ProtectedRoute>
                  }
                />

                {/* Staff protected routes */}
                <Route
                  path="/staff-portal"
                  element={
                    <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                      <StaffPortal />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff-settings"
                  element={
                    <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                      <StaffSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/:patientId"
                  element={
                    <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                      <PatientDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/new-patient"
                  element={
                    <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                      <NewPatient />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                      <AnalyticsDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-portal"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminPortal />
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <FloatingTimer />
            <Toaster />
          </BrowserRouter>
        </InteractionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
