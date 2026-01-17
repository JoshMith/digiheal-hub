import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  Pill, 
  Bell, 
  FileText, 
  Activity, 
  Heart, 
  Clock, 
  User,
  Download,
  Plus,
  Edit,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Thermometer,
  Droplets,
  Scale,
  Ruler,
  Phone,
  MapPin,
  Mail
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { usePatientAppointments } from "@/hooks/use-appointments";
import { usePatientVitalSigns, usePatientStats } from "@/hooks/use-patients";
import { usePatientPrescriptions } from "@/hooks/use-prescriptions";
import type { Patient, Appointment, Prescription, VitalSigns } from "@/types/api.types";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  
  // Cast profile to Patient type
  const patientProfile = profile as Patient | null;
  const patientId = patientProfile?.id || user?.id || '';
  
  // API hooks
  const { 
    data: appointmentsData, 
    isLoading: isLoadingAppointments 
  } = usePatientAppointments(patientId);
  
  const { 
    data: vitalSignsData, 
    isLoading: isLoadingVitals 
  } = usePatientVitalSigns(patientId);
  
  const { 
    data: prescriptionsData, 
    isLoading: isLoadingPrescriptions 
  } = usePatientPrescriptions(patientId);
  
  const { 
    data: statsData, 
    isLoading: isLoadingStats 
  } = usePatientStats(patientId);

  // Patient data with profile fallback
  const patientData = {
    name: patientProfile ? `${patientProfile.firstName} ${patientProfile.lastName}` : "Patient",
    id: patientProfile?.studentId || user?.id?.slice(0, 12) || "N/A",
    email: user?.email || "Not provided",
    phone: patientProfile?.phone || "Not provided",
    avatar: "/placeholder.svg",
    lastVisit: statsData?.lastVisit || "No visits yet",
    address: "DKUT Campus",
    bloodGroup: patientProfile?.bloodGroup || "Unknown",
    age: patientProfile?.dateOfBirth 
      ? Math.floor((Date.now() - new Date(patientProfile.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : null,
    emergencyContact: patientProfile?.emergencyContactPhone || "Not provided"
  };

  // Get upcoming appointments
  const upcomingAppointments = (appointmentsData?.appointments || [])
    .filter((apt: Appointment) => 
      apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED'
    );

  // Get active medications
  const activeMedications = (prescriptionsData?.prescriptions || [])
    .filter((rx: Prescription) => rx.status === 'ACTIVE' || rx.status === 'DISPENSED');

  // Get latest vital signs
  const latestVitals = vitalSignsData?.[0] as VitalSigns | undefined;

  // Mock notifications (would come from notification API)
  const notifications = [
    {
      id: 1,
      title: "Welcome to DKUT Medical",
      message: "Your account is set up and ready to use",
      time: "Just now",
      type: "info",
      read: false
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment": return <Calendar className="h-4 w-4 text-primary" />;
      case "results": return <FileText className="h-4 w-4 text-accent" />;
      case "medication": return <Pill className="h-4 w-4 text-warning" />;
      default: return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "normal": return "text-accent";
      case "warning": return "text-warning";
      case "danger": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    // Handle both time strings and full datetime
    if (timeString.includes('T')) {
      return new Date(timeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    return timeString;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-medium">
                <AvatarImage src={patientData.avatar} alt={patientData.name} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-semibold">
                  {patientData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-primary mb-1">
                  Welcome, {patientData.name.split(' ')[0]}!
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Patient ID: {patientData.id}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3" />
                  Last visit: {patientData.lastVisit}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/book-appointment">
                <Button className="bg-accent hover:bg-accent-hover text-accent-foreground shadow-soft">
                  <Plus className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
              </Link>
              <Button variant="outline" onClick={() => navigate("/edit-profile")} className="shadow-soft">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-card p-4 rounded-lg border shadow-soft flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="truncate">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium truncate">{patientData.email}</p>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border shadow-soft flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{patientData.phone}</p>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border shadow-soft flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <Droplets className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Blood Group</p>
                <p className="text-sm font-medium">{patientData.bloodGroup}</p>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border shadow-soft flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-warning" />
              </div>
              <div className="truncate">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium truncate">{patientData.address}</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Overview
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Appointments
            </TabsTrigger>
            <TabsTrigger value="medications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Medications
            </TabsTrigger>
            <TabsTrigger value="records" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Health Records
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="ml-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-medium border-l-4 border-l-primary">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      {isLoadingAppointments ? (
                        <Skeleton className="h-9 w-8 mb-1" />
                      ) : (
                        <p className="text-3xl font-bold text-primary">{upcomingAppointments.length}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                      <Calendar className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium border-l-4 border-l-accent">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      {isLoadingPrescriptions ? (
                        <Skeleton className="h-9 w-8 mb-1" />
                      ) : (
                        <p className="text-3xl font-bold text-primary">{activeMedications.length}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Active Medications</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-health rounded-xl flex items-center justify-center shadow-soft">
                      <Pill className="h-6 w-6 text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium border-l-4 border-l-warning">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-primary">{notifications.filter(n => !n.read).length}</p>
                      <p className="text-sm text-muted-foreground">Unread Notifications</p>
                    </div>
                    <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center shadow-soft">
                      <Bell className="h-6 w-6 text-warning" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium border-l-4 border-l-success">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-accent">Good</p>
                      <p className="text-sm text-muted-foreground">Health Status</p>
                    </div>
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center shadow-soft">
                      <CheckCircle2 className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Health Vitals */}
              <Card className="shadow-medium lg:col-span-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        Vital Signs
                      </CardTitle>
                      <CardDescription>
                        {latestVitals 
                          ? `Last recorded: ${formatDate(latestVitals.recordedAt)}`
                          : 'No vitals recorded yet'
                        }
                      </CardDescription>
                    </div>
                    {latestVitals && (
                      <Badge variant="outline" className="text-accent border-accent">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Recorded
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingVitals ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-xl" />
                      ))}
                    </div>
                  ) : latestVitals ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-muted/50 rounded-xl border">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="h-4 w-4 text-primary" />
                          <span className="text-xs text-muted-foreground">Blood Pressure</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          {latestVitals.bloodPressureSystolic}/{latestVitals.bloodPressureDiastolic}
                        </p>
                        <p className="text-xs text-accent">mmHg</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-xl border">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="h-4 w-4 text-destructive" />
                          <span className="text-xs text-muted-foreground">Heart Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          {latestVitals.heartRate} <span className="text-sm font-normal">bpm</span>
                        </p>
                        <p className="text-xs text-accent">Normal</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-xl border">
                        <div className="flex items-center gap-2 mb-2">
                          <Thermometer className="h-4 w-4 text-warning" />
                          <span className="text-xs text-muted-foreground">Temperature</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          {latestVitals.temperature}<span className="text-sm font-normal">°C</span>
                        </p>
                        <p className="text-xs text-accent">Normal</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-xl border">
                        <div className="flex items-center gap-2 mb-2">
                          <Droplets className="h-4 w-4 text-primary" />
                          <span className="text-xs text-muted-foreground">Blood Oxygen</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          {latestVitals.oxygenSaturation}<span className="text-sm font-normal">%</span>
                        </p>
                        <p className="text-xs text-accent">Excellent</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-xl border">
                        <div className="flex items-center gap-2 mb-2">
                          <Scale className="h-4 w-4 text-accent" />
                          <span className="text-xs text-muted-foreground">Weight</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          {latestVitals.weight}<span className="text-sm font-normal">kg</span>
                        </p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-xl border">
                        <div className="flex items-center gap-2 mb-2">
                          <Ruler className="h-4 w-4 text-accent" />
                          <span className="text-xs text-muted-foreground">Height</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          {latestVitals.height}<span className="text-sm font-normal">cm</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No vital signs recorded yet</p>
                      <p className="text-sm">Visit the clinic to have your vitals recorded</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Appointments Preview */}
              <Card className="shadow-medium">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Upcoming
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("appointments")}>
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px]">
                    {isLoadingAppointments ? (
                      Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="p-3 mb-2 border rounded-lg">
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      ))
                    ) : upcomingAppointments.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No upcoming appointments</p>
                        <Link to="/book-appointment">
                          <Button size="sm" variant="outline" className="mt-2">
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      upcomingAppointments.slice(0, 3).map((apt: Appointment) => (
                        <div key={apt.id} className="p-3 mb-2 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">{formatDate(apt.appointmentDate)}</p>
                            <Badge variant="outline" className="text-xs">
                              {apt.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(apt.appointmentTime)} • {apt.department}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {apt.type || apt.appointmentType || 'General Consultation'}
                          </p>
                        </div>
                      ))
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Your Appointments
                    </CardTitle>
                    <CardDescription>
                      {isLoadingAppointments 
                        ? 'Loading...' 
                        : `${appointmentsData?.appointments?.length || 0} total appointments`
                      }
                    </CardDescription>
                  </div>
                  <Link to="/book-appointment">
                    <Button className="bg-accent hover:bg-accent-hover text-accent-foreground">
                      <Plus className="mr-2 h-4 w-4" />
                      New Appointment
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {isLoadingAppointments ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 mb-3 border rounded-lg">
                        <Skeleton className="w-16 h-16 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                    ))
                  ) : !appointmentsData?.appointments?.length ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No appointments yet</p>
                      <p className="text-sm mb-4">Book your first appointment to get started</p>
                      <Link to="/book-appointment">
                        <Button>Book Appointment</Button>
                      </Link>
                    </div>
                  ) : (
                    appointmentsData.appointments.map((apt: Appointment) => (
                      <div key={apt.id} className="flex items-center justify-between p-4 mb-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                            <span className="text-xs text-muted-foreground">
                              {new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short' })}
                            </span>
                            <span className="text-xl font-bold text-primary">
                              {new Date(apt.appointmentDate).getDate()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{formatTime(apt.appointmentTime)}</p>
                            <p className="text-sm text-muted-foreground">{apt.department}</p>
                            <p className="text-xs text-muted-foreground">
                              {apt.type || apt.appointmentType || 'Consultation'}
                            </p>
                          </div>
                        </div>
                        <Badge variant={
                          apt.status === 'COMPLETED' ? 'default' :
                          apt.status === 'CANCELLED' ? 'destructive' :
                          'outline'
                        }>
                          {apt.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-primary" />
                  Your Medications
                </CardTitle>
                <CardDescription>
                  {isLoadingPrescriptions 
                    ? 'Loading...' 
                    : `${activeMedications.length} active prescriptions`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {isLoadingPrescriptions ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-4 mb-3 border rounded-lg">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-48 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    ))
                  ) : !prescriptionsData?.prescriptions?.length ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Pill className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No prescriptions</p>
                      <p className="text-sm">Your prescriptions will appear here after a consultation</p>
                    </div>
                  ) : (
                    prescriptionsData.prescriptions.map((rx: Prescription) => (
                      <div key={rx.id} className="p-4 mb-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{rx.medicationName}</p>
                            <p className="text-sm text-muted-foreground">
                              {rx.dosage} • {rx.frequency}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Duration: {rx.duration}
                            </p>
                            {rx.instructions && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Instructions: {rx.instructions}
                              </p>
                            )}
                          </div>
                          <Badge variant={
                            rx.status === 'ACTIVE' ? 'default' :
                            rx.status === 'DISPENSED' ? 'secondary' :
                            rx.status === 'COMPLETED' ? 'outline' :
                            'destructive'
                          }>
                            {rx.status}
                          </Badge>
                        </div>
                        <div className="mt-3 text-xs text-muted-foreground">
                          Prescribed: {formatDate(rx.prescribedAt)}
                          {rx.expiresAt && ` • Expires: ${formatDate(rx.expiresAt)}`}
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Records Tab */}
          <TabsContent value="records" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Health Records
                </CardTitle>
                <CardDescription>Your medical history and records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Health records coming soon</p>
                  <p className="text-sm">Your medical records will be accessible here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>Stay updated with your health activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Bell className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No notifications</p>
                      <p className="text-sm">You're all caught up!</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`flex items-start gap-3 p-4 mb-2 rounded-lg border transition-colors ${
                          !notif.read ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{notif.title}</p>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDashboard;
