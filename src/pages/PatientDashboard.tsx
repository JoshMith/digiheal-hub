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
import { type Patient, type Appointment, type Prescription, type VitalSigns, AppointmentStatus, PrescriptionStatus } from "@/types/api.types";

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
    isLoading: isLoadingAppointments,
    error: appointmentsError
  } = usePatientAppointments(patientId);

  const {
    data: vitalSignsData,
    isLoading: isLoadingVitals,
    error: vitalsError
  } = usePatientVitalSigns(patientId);

  const {
    data: prescriptionsData,
    isLoading: isLoadingPrescriptions,
    error: prescriptionsError
  } = usePatientPrescriptions(patientId);

  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError
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

  // Safely get appointments array
  const getAppointmentsArray = (): Appointment[] => {
    if (!appointmentsData) return [];
    if (Array.isArray(appointmentsData)) return appointmentsData;
    if (typeof appointmentsData === 'object' && appointmentsData !== null) {
      // Use type assertion with proper checking
      if ('data' in appointmentsData && Array.isArray((appointmentsData as { data: unknown }).data)) {
        return (appointmentsData as { data: Appointment[] }).data;
      }
    }
    return [];
  };

  const appointmentsArray = getAppointmentsArray();

  // Get upcoming appointments
  const upcomingAppointments = appointmentsArray
    .filter((apt) =>
      apt.status === AppointmentStatus.SCHEDULED ||
      apt.status === AppointmentStatus.CHECKED_IN
    );

  // Safely get prescriptions array
  const getPrescriptionsArray = (): Prescription[] => {
    if (!prescriptionsData) return [];
    if (Array.isArray(prescriptionsData)) return prescriptionsData;
    if (typeof prescriptionsData === 'object' && prescriptionsData !== null) {
      // Use type assertion with proper checking
      if ('data' in prescriptionsData && Array.isArray((prescriptionsData as { data: unknown }).data)) {
        return (prescriptionsData as { data: Prescription[] }).data;
      }
    }
    return [];
  };

  const prescriptionsArray = getPrescriptionsArray();

  // Get active medications
  const activeMedications = prescriptionsArray
    .filter((rx) => rx.status === PrescriptionStatus.ACTIVE || rx.status === PrescriptionStatus.DISPENSED);

  // Get latest vital signs
  const getVitalSignsArray = (): VitalSigns[] => {
    if (!vitalSignsData) return [];
    if (Array.isArray(vitalSignsData)) return vitalSignsData;
    if (typeof vitalSignsData === 'object' && vitalSignsData !== null) {
      // Use type assertion with proper checking
      if ('data' in vitalSignsData && Array.isArray((vitalSignsData as { data: unknown }).data)) {
        return (vitalSignsData as { data: VitalSigns[] }).data;
      }
    }
    return [];
  };

  const vitalSignsArray = getVitalSignsArray();
  const latestVitals = vitalSignsArray[0];

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
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    try {
      // Handle both time strings and full datetime
      if (timeString.includes('T')) {
        return new Date(timeString).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
      return timeString;
    } catch (error) {
      return "";
    }
  };

  // Handle API errors gracefully
  const hasApiError = appointmentsError || vitalsError || prescriptionsError || statsError;
  if (hasApiError) {
    console.error("API Errors:", { appointmentsError, vitalsError, prescriptionsError, statsError });
  }

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
                      <p className="text-sm text-muted-foreground">Upcoming</p>
                    </div>
                    <Calendar className="h-10 w-10 text-primary/20" />
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
                        <p className="text-3xl font-bold text-accent">{activeMedications.length}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Active Meds</p>
                    </div>
                    <Pill className="h-10 w-10 text-accent/20" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-medium border-l-4 border-l-warning">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      {isLoadingStats ? (
                        <Skeleton className="h-9 w-8 mb-1" />
                      ) : (
                        <p className="text-3xl font-bold text-warning">{statsData?.totalAppointments || 0}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Total Visits</p>
                    </div>
                    <Activity className="h-10 w-10 text-warning/20" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-medium border-l-4 border-l-destructive">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      {isLoadingVitals ? (
                        <Skeleton className="h-9 w-8 mb-1" />
                      ) : (
                        <p className="text-3xl font-bold text-destructive">
                          {latestVitals?.heartRate || '--'}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">Heart Rate</p>
                    </div>
                    <Heart className="h-10 w-10 text-destructive/20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upcoming Appointments Card */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Upcoming Appointments
                  </CardTitle>
                  <CardDescription>
                    {isLoadingAppointments
                      ? 'Loading...'
                      : `${upcomingAppointments.length} scheduled appointments`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {isLoadingAppointments ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-4 mb-3 border rounded-lg">
                          <Skeleton className="h-5 w-32 mb-2" />
                          <Skeleton className="h-4 w-48 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      ))
                    ) : !upcomingAppointments.length ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">No upcoming appointments</p>
                        <p className="text-sm mb-4">Book an appointment to get started</p>
                        <Link to="/book-appointment">
                          <Button size="sm" className="bg-accent hover:bg-accent-hover">
                            <Plus className="mr-2 h-4 w-4" />
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      upcomingAppointments.map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between p-4 mb-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="text-center p-2 bg-primary/10 rounded-lg">
                              <span className="text-xs text-muted-foreground block">
                                {new Date(apt.appointmentDate).toLocaleString('en-US', { month: 'short' })}
                              </span>
                              <span className="text-xl font-bold text-primary">
                                {new Date(apt.appointmentDate).getDate()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{formatTime(apt.appointmentTime)}</p>
                              <p className="text-sm text-muted-foreground">{apt.department}</p>
                              <p className="text-xs text-muted-foreground">
                                {apt.type || 'Consultation'}
                              </p>
                            </div>
                          </div>
                          <Badge variant={
                            apt.status === AppointmentStatus.SCHEDULED ? 'default' :
                              apt.status === AppointmentStatus.CHECKED_IN ? 'secondary' :
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

              {/* Health Snapshot Card */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Health Snapshot
                  </CardTitle>
                  <CardDescription>Your latest vital signs</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingVitals ? (
                    <div className="space-y-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      ))}
                    </div>
                  ) : !latestVitals ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No vital signs recorded</p>
                      <p className="text-sm">Vitals will be recorded during your next visit</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                            <Heart className="h-5 w-5 text-destructive" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Heart Rate</p>
                            <p className="text-lg font-semibold">{latestVitals.heartRate || '--'} bpm</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor('normal')}>Normal</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Activity className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Blood Pressure</p>
                            <p className="text-lg font-semibold">
                              {latestVitals.bloodPressureSystolic || '--'}/{latestVitals.bloodPressureDiastolic || '--'} mmHg
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor('normal')}>Normal</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                            <Thermometer className="h-5 w-5 text-warning" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Temperature</p>
                            <p className="text-lg font-semibold">{latestVitals.temperature || '--'}°C</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor('normal')}>Normal</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                            <Scale className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Weight</p>
                            <p className="text-lg font-semibold">{latestVitals.weight || '--'} kg</p>
                          </div>
                        </div>
                      </div>
                      {latestVitals.recordedAt && (
                        <p className="text-xs text-muted-foreground text-center mt-4">
                          Last updated: {formatDate(latestVitals.recordedAt)}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  All Appointments
                </CardTitle>
                <CardDescription>
                  {isLoadingAppointments
                    ? 'Loading...'
                    : `${appointmentsArray.length} total appointments`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {isLoadingAppointments ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="p-4 mb-3 border rounded-lg">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-48 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    ))
                  ) : !appointmentsArray.length ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No appointments yet</p>
                      <p className="text-sm mb-4">Book your first appointment to get started</p>
                      <Link to="/book-appointment">
                        <Button className="bg-accent hover:bg-accent-hover">
                          <Plus className="mr-2 h-4 w-4" />
                          Book Appointment
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    appointmentsArray.map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-4 mb-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="text-center p-2 bg-primary/10 rounded-lg">
                            <span className="text-xs text-muted-foreground block">
                              {new Date(apt.appointmentDate).toLocaleString('en-US', { month: 'short' })}
                            </span>
                            <span className="text-xl font-bold text-primary">
                              {new Date(apt.appointmentDate).getDate()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{formatTime(apt.appointmentTime)}</p>
                            <p className="text-sm text-muted-foreground">{apt.department}</p>
                            <p className="text-xs text-muted-foreground">
                              {apt.type || 'Consultation'}
                            </p>
                          </div>
                        </div>
                        <Badge variant={
                          apt.status === AppointmentStatus.COMPLETED ? 'default' :
                            apt.status === AppointmentStatus.CANCELLED ? 'destructive' :
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
                  ) : !prescriptionsArray.length ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Pill className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No prescriptions</p>
                      <p className="text-sm">Your prescriptions will appear here after a consultation</p>
                    </div>
                  ) : (
                    prescriptionsArray.map((rx) => (
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
                            rx.status === PrescriptionStatus.ACTIVE ? 'default' :
                              rx.status === PrescriptionStatus.DISPENSED ? 'secondary' :
                                rx.status === PrescriptionStatus.COMPLETED ? 'outline' :
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
                        className={`flex items-start gap-3 p-4 mb-2 rounded-lg border transition-colors ${!notif.read ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
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