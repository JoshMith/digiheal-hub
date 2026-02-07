import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Calendar,
  Clock,
  FileText,
  Activity,
  BarChart3,
  Settings,
  Search,
  Filter,
  Plus,
  CheckCircle,
  AlertTriangle,
  Eye,
  Stethoscope,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Bell,
  RefreshCw,
  Timer,
  ClipboardList,
  Loader2,
  LogOut,
  Play
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { useInteractionContext } from "@/context/interactionContext";
import { useInteractionQueue, useStartConsultation } from "@/hooks/use-interactions";
import { useTodayAppointments, useAppointmentStats } from "@/hooks/use-appointments";
import { useDashboardMetrics } from "@/hooks/use-analytics";
import { usePatients } from "@/hooks/use-patients";
import { useLogout } from "@/hooks/use-auth";
import { toast } from "sonner";
import type { Staff, Appointment, Department, Interaction, InteractionPhase, PriorityLevel, AppointmentStatus, AppointmentType } from "@/types/api.types";

const StaffPortal = () => {
  const [activeTab, setActiveTab] = useState("queue");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { profile, user, logout: authLogout } = useAuth();
  const { startInteraction } = useInteractionContext();
  const logoutMutation = useLogout();

  // Cast profile to Staff type
  const staffProfile = profile as Staff | null;
  const staffDepartment = staffProfile?.department as Department | undefined;

  // API hooks - consolidated to reduce requests and prevent rate limiting
  // Queue data - primary data source for staff portal
  const {
    data: queueData,
    isLoading: isLoadingQueue,
    refetch: refetchQueue
  } = useInteractionQueue({
    department: staffDepartment,
    staffId: staffProfile?.id
  });

  // Start consultation mutation (for patients already checked in)
  const startConsultationMutation = useStartConsultation();

  // Today's appointments for the department
  const {
    data: todayAppointments,
    isLoading: isLoadingAppointments
  } = useTodayAppointments(staffDepartment);

  // Dashboard metrics - provides most stats we need
  const {
    data: dashboardMetrics,
    isLoading: isLoadingMetrics
  } = useDashboardMetrics();

  // Appointment stats for completed count
  const {
    data: appointmentStats
  } = useAppointmentStats();

  // Patients data - only fetch when search is active or Records tab is selected
  const {
    data: patientsData,
    isLoading: isLoadingPatients
  } = usePatients({ search: searchTerm });

  // Derived interaction stats from dashboard metrics to avoid extra API call
  const interactionStats = {
    avgInteractionDuration: dashboardMetrics?.avgWaitTime || 0,
  };


  // Filtered queue based on search
  const filteredQueue = useMemo(() => {
    if (!queueData) return [];
    if (!searchTerm) return queueData;

    const term = searchTerm.toLowerCase();
    return queueData.filter((item: Interaction) =>
      item.patient?.firstName?.toLowerCase().includes(term) ||
      item.patient?.lastName?.toLowerCase().includes(term) ||
      item.patient?.studentId?.toLowerCase().includes(term) ||
      item.patientId?.toLowerCase().includes(term)
    );
  }, [queueData, searchTerm]);

  // Staff data with fallback
  const staffData = {
    name: staffProfile ? `${staffProfile.firstName} ${staffProfile.lastName}` : "Staff Member",
    role: staffProfile?.position || "Healthcare Provider",
    department: staffProfile?.department || "General Medicine",
    avatar: "/placeholder.svg",
    shift: "Morning Shift (8:00 AM - 4:00 PM)",
    staffId: staffProfile?.staffId || user?.id?.slice(0, 8) || "STAFF-001"
  };

  // Analytics with API data or fallbacks
  const analytics = {
    todayPatients: dashboardMetrics?.totalPatientsToday || 0,
    totalAppointments: dashboardMetrics?.totalAppointments || 0,
    completedConsultations: dashboardMetrics?.completedAppointments || 0,
    averageWaitTime: dashboardMetrics?.avgWaitTime
      ? `${Math.round(dashboardMetrics.avgWaitTime)} min`
      : "-- min",
    todayChange: "+0",
    waitTimeChange: "0 min"
  };

  const getPriorityColor = (priority?: PriorityLevel | string) => {
    const priorityUpper = priority?.toUpperCase();
    switch (priorityUpper) {
      case "HIGH":
      case "URGENT": return "bg-destructive text-destructive-foreground";
      case "MEDIUM":
      case "NORMAL": return "bg-warning text-warning-foreground";
      case "LOW": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status?: string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "completed":
      case "interaction_end":
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case "in_progress":
      case "interaction_in_progress":
      case "interaction_start":
        return <Timer className="h-4 w-4 text-primary animate-pulse" />;
      case "waiting":
      case "checked_in":
      case "check_in_time":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "scheduled":
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status?: AppointmentStatus | string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "completed":
        return <Badge variant="outline" className="border-accent text-accent">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-primary">In Progress</Badge>;
      case "waiting":
      case "checked_in":
        return <Badge variant="outline" className="border-warning text-warning">Waiting</Badge>;
      case "scheduled":
        return <Badge variant="secondary">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "--:--";
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return "--:--";
    }
  };

  const calculateWaitTime = (checkInTime?: string) => {
    if (!checkInTime) return "0 min";
    try {
      const diff = Date.now() - new Date(checkInTime).getTime();
      const minutes = Math.floor(diff / 60000);
      return `${minutes} min`;
    } catch (error) {
      return "0 min";
    }
  };

  // Get queue position or status for interaction
  const getInteractionStatus = (interaction: Interaction) => {
    if (interaction.checkoutTime) return "COMPLETED";
    if (interaction.interactionStartTime) return "INTERACTION_IN_PROGRESS";
    if (interaction.checkInTime) return "CHECKED_IN";
    return "SCHEDULED";
  };

  // Handle starting a consultation - populates FloatingTimer
  // src/pages/StaffPortal.tsx

  const handleStartConsultation = (appointment: Appointment) => {
    // Step 1: Check if interaction already exists for this appointment
    const existingInteraction = queueData?.find(
      (int: Interaction) => int.appointmentId === appointment.id
    );

    if (existingInteraction) {
      // ✅ Interaction exists - just start the consultation phase
      startConsultationMutation.mutate(existingInteraction.id, {
        onSuccess: () => {
          const patientName = existingInteraction.patient
            ? `${existingInteraction.patient.firstName} ${existingInteraction.patient.lastName}`
            : 'Unknown Patient';

          // Update FloatingTimer context
          startInteraction({
            interactionId: existingInteraction.id,
            appointmentId: appointment.id,
            patientName,
            patientId: appointment.patientId,
            department: appointment.department,
            priority: appointment.priority,
            appointmentType: appointment.type,
            currentPhase: 'INTERACTION_IN_PROGRESS',
          });

          toast.success(`Started consultation with ${patientName}`);
          refetchQueue();
        },
        onError: () => {
          toast.error('Failed to start consultation');
        }
      });
    } else {
      // ❌ No interaction - patient needs to check in first
      toast.error('Patient must check in first before starting consultation');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      authLogout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      // Even on error, logout locally
      authLogout();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-5">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-medium">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-semibold">
                  {(() => {
                    const name = staffData.name;
                    if (!name || !name.trim()) return 'U';
                    const parts = name.trim().split(/\s+/);
                    return parts.slice(0, 2).map(p => p[0].toUpperCase()).join('') || 'U';
                  })()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-primary mb-1">{staffData.name}</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  {staffData.role} - {staffData.department}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3" />
                  {staffData.shift}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => navigate("/analytics")} className="shadow-soft">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button variant="outline" onClick={() => navigate("/staff-settings")} className="shadow-soft">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button className="bg-accent hover:bg-accent-hover text-accent-foreground shadow-soft" onClick={() => navigate('/new-patient')}>
                <Plus className="mr-2 h-4 w-4" />
                New Patient
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="shadow-soft text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                {logoutMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-medium border-l-4 border-l-primary">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  {isLoadingMetrics ? (
                    <Skeleton className="h-9 w-12 mb-1" />
                  ) : (
                    <p className="text-3xl font-bold text-primary">{analytics.todayPatients}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Today's Patients</p>
                  <p className="text-xs text-accent flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {analytics.todayChange} from yesterday
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                  <Users className="h-7 w-7 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-l-4 border-l-warning">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  {isLoadingMetrics ? (
                    <Skeleton className="h-9 w-12 mb-1" />
                  ) : (
                    <p className="text-3xl font-bold text-primary">{analytics.totalAppointments}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Total Appointments</p>
                  <p className="text-xs text-muted-foreground mt-1">Today's count</p>
                </div>
                <div className="w-14 h-14 bg-warning/20 rounded-xl flex items-center justify-center shadow-soft">
                  <Calendar className="h-7 w-7 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-l-4 border-l-accent">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  {isLoadingMetrics ? (
                    <Skeleton className="h-9 w-12 mb-1" />
                  ) : (
                    <p className="text-3xl font-bold text-primary">{analytics.completedConsultations}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <Progress
                    value={analytics.todayPatients > 0
                      ? (analytics.completedConsultations / analytics.todayPatients) * 100
                      : 0
                    }
                    className="h-1.5 mt-2 w-20"
                  />
                </div>
                <div className="w-14 h-14 bg-gradient-health rounded-xl flex items-center justify-center shadow-soft">
                  <CheckCircle className="h-7 w-7 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-l-4 border-l-primary">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  {isLoadingMetrics ? (
                    <Skeleton className="h-9 w-16 mb-1" />
                  ) : (
                    <p className="text-3xl font-bold text-primary">{analytics.averageWaitTime}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                  <p className="text-xs text-accent flex items-center mt-1">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {analytics.waitTimeChange}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                  <Clock className="h-7 w-7 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 h-12">
                <TabsTrigger value="queue" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Queue
                </TabsTrigger>
                <TabsTrigger value="appointments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Appointments
                </TabsTrigger>
                <TabsTrigger value="patients" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <FileText className="h-4 w-4 mr-2" />
                  Records
                </TabsTrigger>
              </TabsList>

              {/* Patient Queue Tab */}
              <TabsContent value="queue" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          Patient Queue
                        </CardTitle>
                        <CardDescription>
                          {filteredQueue.length} patients in queue
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Search queue..."
                            className="pl-10 w-48"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <Button size="icon" variant="outline">
                          <Filter className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => refetchQueue()}
                          disabled={isLoadingQueue}
                        >
                          {isLoadingQueue ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {isLoadingQueue ? (
                      // Loading skeletons
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border">
                          <div className="flex items-center gap-4">
                            <Skeleton className="w-14 h-14 rounded-full" />
                            <div>
                              <Skeleton className="h-5 w-32 mb-2" />
                              <Skeleton className="h-4 w-48" />
                            </div>
                          </div>
                          <Skeleton className="h-10 w-20" />
                        </div>
                      ))
                    ) : filteredQueue.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No patients in queue</p>
                      </div>
                    ) : (
                      filteredQueue.map((interaction: Interaction, index: number) => {
                        const status = getInteractionStatus(interaction);
                        return (
                          <div
                            key={interaction.id || index}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-soft ${interaction.priority === 'HIGH' || interaction.priority === 'URGENT'
                              ? 'border-destructive/30 bg-destructive/5' :
                              status === 'INTERACTION_IN_PROGRESS'
                                ? 'border-primary/30 bg-primary/5' :
                                'hover:bg-muted/50'
                              }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col items-center min-w-[60px]">
                                <span className="text-2xl font-bold text-muted-foreground">
                                  #{index + 1}
                                </span>
                                <Badge className={`text-xs ${getPriorityColor(interaction.priority)}`}>
                                  {interaction.priority}
                                </Badge>
                              </div>
                              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                                <span className="text-lg font-semibold text-primary">
                                  {interaction.patient?.firstName?.[0]}{interaction.patient?.lastName?.[0] || '??'}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold">
                                  {interaction.patient ? `${interaction.patient.firstName} ${interaction.patient.lastName}` : 'Unknown Patient'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {interaction.patient?.studentId || interaction.patientId} • {interaction.department}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {interaction.appointmentType || 'General Consultation'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-medium">{formatTime(interaction.checkInTime)}</p>
                                <div className="flex items-center gap-1 justify-end">
                                  {getStatusIcon(status)}
                                  <span className="text-sm text-muted-foreground capitalize">
                                    {status.replace(/_/g, ' ').toLowerCase()}
                                  </span>
                                </div>
                                {interaction.checkInTime && (
                                  <p className="text-xs text-warning mt-1">
                                    Wait: {calculateWaitTime(interaction.checkInTime)}
                                  </p>
                                )}
                                {interaction.predictedDuration && (
                                  <p className="text-xs text-muted-foreground">
                                    Est: {interaction.predictedDuration} min
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/patient/${interaction.patient?.id || interaction.patientId}`)}
                                  title="View Patient"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {status !== 'COMPLETED' && status !== 'INTERACTION_IN_PROGRESS' && (
                                  <Button
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                    onClick={() => {
                                      const appointment: Appointment = {
                                        id: interaction.appointmentId || '',
                                        patientId: interaction.patientId || '',
                                        department: interaction.department,
                                        priority: interaction.priority as PriorityLevel,
                                        type: interaction.appointmentType as AppointmentType,
                                        appointmentTime: interaction.checkInTime || new Date().toISOString(),
                                        appointmentDate: new Date().toISOString(),
                                        status: 'CHECKED_IN' as AppointmentStatus,
                                        duration: interaction.predictedDuration || 20,
                                        createdAt: new Date().toISOString(),
                                        updatedAt: new Date().toISOString(),
                                        patient: interaction.patient,
                                        notes: '',
                                        reason: '',
                                        staffId: staffProfile?.id || '',
                                        queueNumber: index + 1,
                                        checkedInAt: interaction.checkInTime || new Date().toISOString(),
                                        startedAt: null,
                                        completedAt: null,
                                        cancelledAt: null
                                      };
                                      handleStartConsultation(appointment);
                                    }}
                                    disabled={startConsultationMutation.isPending}
                                    title="Start Consultation"
                                  >
                                    {startConsultationMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Play className="h-4 w-4" />
                                    )}
                                  </Button>
                                )}
                                {status === 'INTERACTION_IN_PROGRESS' && (
                                  <Badge className="bg-primary text-primary-foreground text-xs">
                                    Active
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appointments Tab */}
              <TabsContent value="appointments" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Today's Appointments
                    </CardTitle>
                    <CardDescription>
                      {isLoadingAppointments ? 'Loading...' : `${todayAppointments?.length || 0} appointments scheduled`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      {isLoadingAppointments ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-4 p-3 mb-2">
                            <Skeleton className="w-16 h-10" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-32 mb-2" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-6 w-20" />
                          </div>
                        ))
                      ) : !todayAppointments?.length ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>No appointments for today</p>
                        </div>
                      ) : (
                        <div className="relative">
                          {/* Timeline line */}
                          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-muted" />

                          {todayAppointments.map((apt: Appointment, index: number) => (
                            <div key={apt.id || index} className="relative flex items-start gap-4 pb-6">
                              {/* Timeline dot */}
                              <div className={`relative z-10 w-4 h-4 rounded-full mt-1 ${apt.status === 'COMPLETED' ? 'bg-accent' :
                                apt.status === 'IN_PROGRESS' ? 'bg-primary animate-pulse' :
                                  apt.status === 'CHECKED_IN' ? 'bg-warning' :
                                    'bg-muted-foreground'
                                }`} style={{ marginLeft: '22px' }} />

                              <div className="flex-1 ml-4 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{formatTime(apt.appointmentTime)}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Patient: {apt.patient?.studentId || apt.patientId?.slice(0, 8) || 'Unknown'}
                                    </p>
                                  </div>
                                  {getStatusBadge(apt.status)}
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <Badge variant="outline">{apt.type}</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {apt.duration ? `${apt.duration} min` : `est. 20 min`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Patients Tab */}
              <TabsContent value="patients" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          Patient Records
                        </CardTitle>
                        <CardDescription>Search and view patient records</CardDescription>
                      </div>
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search patients..."
                          className="pl-10 w-64"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      {isLoadingPatients ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-4 p-3 mb-2 border rounded-lg">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-32 mb-2" />
                              <Skeleton className="h-3 w-48" />
                            </div>
                            <Skeleton className="h-8 w-16" />
                          </div>
                        ))
                      ) : !patientsData?.length ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>{searchTerm ? 'No patients found' : 'Search for patients'}</p>
                        </div>
                      ) : (
                        patientsData.map((patient) => (
                          <div
                            key={patient.id}
                            className="flex items-center justify-between p-3 mb-2 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/patient/${patient.id}`)}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>
                                  {patient.firstName?.[0]}{patient.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {patient.studentId} • {patient.gender}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="shadow-medium">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 bg-accent rounded-full mt-1.5" />
                      <div>
                        <p className="font-medium">System Online</p>
                        <p className="text-xs text-muted-foreground">Connected to backend</p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="shadow-medium">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4 text-warning" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[150px]">
                  <div className="space-y-3">
                    {queueData && queueData.filter((interaction: Interaction) =>
                      interaction.priority === 'HIGH' || interaction.priority === 'URGENT'
                    ).length > 0 ? (
                      queueData.filter((interaction: Interaction) =>
                        interaction.priority === 'HIGH' || interaction.priority === 'URGENT'
                      ).map((interaction: Interaction) => (
                        <div key={interaction.id} className="p-2 bg-destructive/10 rounded-lg">
                          <p className="text-sm font-medium text-destructive">High Priority</p>
                          <p className="text-xs text-muted-foreground">
                            {interaction.patient ? `${interaction.patient.firstName} ${interaction.patient.lastName}` : 'Patient'}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No urgent alerts
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPortal;