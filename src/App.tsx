import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HealthAssessment from "./pages/HealthAssessment";
import BookAppointment from "./pages/BookAppointment";
import PatientDashboard from "./pages/PatientDashboard";
import StaffPortal from "./pages/StaffPortal";
import Auth from "./pages/Auth";
import EditProfile from "./pages/EditProfile";
import StaffSettings from "./pages/StaffSettings";
import PatientDetail from "./pages/PatientDetail";
import NewPatient from "./pages/NewPatient";
import Consultation from "./pages/Consultation";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Features from "./pages/Features";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/health-assessment" element={<HealthAssessment />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/features" element={<Features />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/staff-portal" element={<StaffPortal />} />
            <Route path="/patient/:patientId" element={<PatientDetail />} />
            <Route path="/consultation/:patientId" element={<Consultation />} />
            <Route path="/new-patient" element={<NewPatient />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/staff-settings" element={<StaffSettings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
