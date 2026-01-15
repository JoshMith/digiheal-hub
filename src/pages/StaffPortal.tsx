import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
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
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  UserCheck,
  Stethoscope,
  Pill,
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  Bell,
  RefreshCw,
  ArrowRight,
  Timer,
  ClipboardList,
  HeartPulse
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const StaffPortal = () => {
  const [activeTab, setActiveTab] = useState("queue");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Mock staff data
  const staffData = {
    name: "Dr. Sarah Johnson",
    role: "General Practitioner",
    department: "General Medicine",
    avatar: "/placeholder.svg",
    shift: "Morning Shift (8:00 AM - 4:00 PM)",
    staffId: "STAFF-001"
  };

  // Patient queue data
  const patientQueue = [
    {
      id: 1,
      name: "John Doe",
      studentId: "DKUT/2024/001",
      appointmentTime: "10:00 AM",
      priority: "high",
      reason: "Chest pain and difficulty breathing",
      waitTime: "15 min",
      status: "waiting",
      age: 22,
      gender: "Male"
    },
    {
      id: 2,
      name: "Jane Smith",
      studentId: "DKUT/2024/002",
      appointmentTime: "10:30 AM",
      priority: "medium",
      reason: "Follow-up consultation",
      waitTime: "5 min",
      status: "checked-in",
      age: 20,
      gender: "Female"
    },
    {
      id: 3,
      name: "Mike Wilson",
      studentId: "DKUT/2024/003",
      appointmentTime: "11:00 AM",
      priority: "low",
      reason: "Routine check-up",
      waitTime: "0 min",
      status: "scheduled",
      age: 23,
      gender: "Male"
    },
    {
      id: 4,
      name: "Alice Wanjiku",
      studentId: "DKUT/2024/004",
      appointmentTime: "11:30 AM",
      priority: "medium",
      reason: "Headache and fatigue",
      waitTime: "0 min",
      status: "scheduled",
      age: 21,
      gender: "Female"
    }
  ];

  // Today's appointments
  const todayAppointments = [
    {
      id: 1,
      time: "09:00 AM",
      patient: "Alice Brown",
      type: "Consultation",
      status: "completed",
      duration: "25 min"
    },
    {
      id: 2,
      time: "10:00 AM",
      patient: "John Doe",
      type: "Emergency",
      status: "in-progress",
      duration: "ongoing"
    },
    {
      id: 3,
      time: "10:30 AM",
      patient: "Jane Smith",
      type: "Follow-up",
      status: "waiting",
      duration: "est. 15 min"
    },
    {
      id: 4,
      time: "11:00 AM",
      patient: "Mike Wilson",
      type: "Check-up",
      status: "scheduled",
      duration: "est. 20 min"
    },
    {
      id: 5,
      time: "11:30 AM",
      patient: "Alice Wanjiku",
      type: "Consultation",
      status: "scheduled",
      duration: "est. 20 min"
    }
  ];

  // Analytics data
  const analytics = {
    todayPatients: 12,
    pendingAppointments: 4,
    completedConsultations: 8,
    averageWaitTime: "12 min",
    todayChange: "+3",
    waitTimeChange: "-2 min"
  };

  // Inventory alerts
  const inventoryAlerts = [
    { id: 1, item: "Paracetamol 500mg", stock: 50, threshold: 100, status: "low" },
    { id: 2, item: "Amoxicillin 250mg", stock: 25, threshold: 50, status: "critical" },
    { id: 3, item: "Bandages (Medium)", stock: 80, threshold: 100, status: "low" }
  ];

  // Recent activity
  const recentActivity = [
    { id: 1, action: "Completed consultation", patient: "Alice Brown", time: "5 min ago" },
    { id: 2, action: "Prescribed medication", patient: "John Doe", time: "10 min ago" },
    { id: 3, action: "Updated patient records", patient: "Jane Smith", time: "25 min ago" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-accent" />;
      case "in-progress": return <Timer className="h-4 w-4 text-primary animate-pulse" />;
      case "waiting": return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "checked-in": return <UserCheck className="h-4 w-4 text-primary" />;
      case "scheduled": return <Calendar className="h-4 w-4 text-muted-foreground" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge variant="outline" className="border-accent text-accent">Completed</Badge>;
      case "in-progress": return <Badge className="bg-primary">In Progress</Badge>;
      case "waiting": return <Badge variant="outline" className="border-warning text-warning">Waiting</Badge>;
      case "checked-in": return <Badge variant="outline" className="border-primary text-primary">Checked In</Badge>;
      case "scheduled": return <Badge variant="secondary">Scheduled</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
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
                <AvatarImage src={staffData.avatar} alt={staffData.name} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-semibold">
                  {staffData.name.split(' ').map(n => n[0]).join('')}
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
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-medium border-l-4 border-l-primary">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-primary">{analytics.todayPatients}</p>
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
                  <p className="text-3xl font-bold text-primary">{analytics.pendingAppointments}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-xs text-muted-foreground mt-1">Next at 10:30 AM</p>
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
                  <p className="text-3xl font-bold text-primary">{analytics.completedConsultations}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <Progress value={67} className="h-1.5 mt-2 w-20" />
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
                  <p className="text-3xl font-bold text-primary">{analytics.averageWaitTime}</p>
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
              <TabsList className="grid w-full grid-cols-4 h-12">
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
                <TabsTrigger value="inventory" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Pill className="h-4 w-4 mr-2" />
                  Inventory
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
                          {patientQueue.filter(p => p.status === 'waiting').length} patients waiting
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
                        <Button size="icon" variant="outline">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {patientQueue.map((patient, index) => (
                      <div 
                        key={patient.id} 
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-soft ${
                          patient.priority === 'high' ? 'border-destructive/30 bg-destructive/5' : 
                          patient.status === 'in-progress' ? 'border-primary/30 bg-primary/5' : 
                          'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center min-w-[60px]">
                            <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                            <Badge className={`text-xs ${getPriorityColor(patient.priority)}`}>
                              {patient.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                            <span className="text-lg font-semibold text-primary">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">{patient.studentId} • {patient.age}y {patient.gender}</p>
                            <p className="text-sm text-muted-foreground mt-1">{patient.reason}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">{patient.appointmentTime}</p>
                            <div className="flex items-center gap-1 justify-end">
                              {getStatusIcon(patient.status)}
                              <span className="text-sm text-muted-foreground capitalize">{patient.status.replace('-', ' ')}</span>
                            </div>
                            {patient.waitTime !== "0 min" && (
                              <p className="text-xs text-warning mt-1">Wait: {patient.waitTime}</p>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm" variant="outline" onClick={() => navigate(`/patient/${patient.id}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" className="bg-accent hover:bg-accent-hover text-accent-foreground" onClick={() => navigate(`/patient/${patient.id}`)}>
                              <HeartPulse className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appointments Tab */}
              <TabsContent value="appointments" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          Today's Schedule
                        </CardTitle>
                        <CardDescription>
                          {todayAppointments.length} appointments • {todayAppointments.filter(a => a.status === 'completed').length} completed
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                      <div className="space-y-4">
                        {todayAppointments.map((appointment) => (
                          <div key={appointment.id} className="flex gap-4 ml-4">
                            <div className={`w-4 h-4 rounded-full border-2 z-10 ${
                              appointment.status === 'completed' ? 'bg-accent border-accent' :
                              appointment.status === 'in-progress' ? 'bg-primary border-primary animate-pulse' :
                              'bg-background border-muted-foreground'
                            }`} />
                            <div className={`flex-1 p-4 rounded-xl border ${
                              appointment.status === 'in-progress' ? 'border-primary/30 bg-primary/5' : 'bg-card'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="text-center min-w-[70px]">
                                    <p className="font-semibold text-primary">{appointment.time}</p>
                                    <p className="text-xs text-muted-foreground">{appointment.duration}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">{appointment.patient}</p>
                                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {getStatusBadge(appointment.status)}
                                  <Button size="sm" variant="outline">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Patient Records Tab */}
              <TabsContent value="patients" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          Patient Records
                        </CardTitle>
                        <CardDescription>Search and manage patient medical records</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          placeholder="Search by name, student ID, or condition..." 
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium">Search for patients</p>
                      <p className="text-sm">Enter a name or student ID to find patient records</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Inventory Tab */}
              <TabsContent value="inventory" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Pill className="h-5 w-5 text-primary" />
                          Medical Inventory
                        </CardTitle>
                        <CardDescription>Track and manage medical supplies</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {inventoryAlerts.map((item) => (
                        <div key={item.id} className={`p-4 rounded-xl border ${
                          item.status === 'critical' ? 'border-destructive/30 bg-destructive/5' : 'border-warning/30 bg-warning/5'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{item.item}</h3>
                            <Badge variant={item.status === 'critical' ? 'destructive' : 'outline'} className={item.status !== 'critical' ? 'border-warning text-warning' : ''}>
                              {item.status === 'critical' ? 'Critical' : 'Low Stock'}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Current Stock</span>
                              <span className="font-medium">{item.stock} units</span>
                            </div>
                            <Progress value={(item.stock / item.threshold) * 100} className="h-2" />
                            <p className="text-xs text-muted-foreground">Threshold: {item.threshold} units</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full">
                      View Full Inventory
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Alerts */}
            <Card className="shadow-medium">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-3">
                    {inventoryAlerts.map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-lg border ${
                        alert.status === 'critical' ? 'border-destructive/30 bg-destructive/5' : 'border-warning/30 bg-warning/5'
                      }`}>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className={`h-4 w-4 mt-0.5 ${alert.status === 'critical' ? 'text-destructive' : 'text-warning'}`} />
                          <div>
                            <p className="text-sm font-medium">{alert.item}</p>
                            <p className="text-xs text-muted-foreground">{alert.stock} units remaining</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-medium">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-2">
                        <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                        <div>
                          <p className="text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.patient} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-medium">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/new-patient')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Register New Patient
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/analytics')}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPortal;
