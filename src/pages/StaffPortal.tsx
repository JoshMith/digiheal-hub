import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Download
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
    shift: "Morning Shift (8:00 AM - 4:00 PM)"
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
      status: "waiting"
    },
    {
      id: 2,
      name: "Jane Smith",
      studentId: "DKUT/2024/002",
      appointmentTime: "10:30 AM",
      priority: "medium",
      reason: "Follow-up consultation",
      waitTime: "5 min",
      status: "checked-in"
    },
    {
      id: 3,
      name: "Mike Wilson",
      studentId: "DKUT/2024/003",
      appointmentTime: "11:00 AM",
      priority: "low",
      reason: "Routine check-up",
      waitTime: "0 min",
      status: "scheduled"
    }
  ];

  // Today's appointments
  const todayAppointments = [
    {
      id: 1,
      time: "09:00 AM",
      patient: "Alice Brown",
      type: "Consultation",
      status: "completed"
    },
    {
      id: 2,
      time: "10:00 AM",
      patient: "John Doe",
      type: "Emergency",
      status: "in-progress"
    },
    {
      id: 3,
      time: "10:30 AM",
      patient: "Jane Smith",
      type: "Follow-up",
      status: "waiting"
    },
    {
      id: 4,
      time: "11:00 AM",
      patient: "Mike Wilson",
      type: "Check-up",
      status: "scheduled"
    }
  ];

  // Analytics data
  const analytics = {
    todayPatients: 12,
    pendingAppointments: 3,
    completedConsultations: 8,
    averageWaitTime: "12 min"
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress": return <Clock className="h-4 w-4 text-blue-500" />;
      case "waiting": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "scheduled": return <Calendar className="h-4 w-4 text-muted-foreground" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Avatar className="h-16 w-16">
              <AvatarImage src={staffData.avatar} alt={staffData.name} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg">
                {staffData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-primary">{staffData.name}</h1>
              <p className="text-muted-foreground">{staffData.role} - {staffData.department}</p>
              <p className="text-sm text-muted-foreground">{staffData.shift}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/staff-settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button className="bg-accent hover:bg-accent-hover text-accent-foreground" onClick={() => navigate('/new-patient')}>
              <Plus className="mr-2 h-4 w-4" />
              New Patient
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{analytics.todayPatients}</p>
                  <p className="text-sm text-muted-foreground">Today's Patients</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-health rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{analytics.pendingAppointments}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{analytics.completedConsultations}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{analytics.averageWaitTime}</p>
                  <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="queue">Patient Queue</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patient Records</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          {/* Patient Queue Tab */}
          <TabsContent value="queue" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Current Patient Queue
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {patientQueue.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <Badge className={`text-xs ${getPriorityColor(patient.priority)}`}>
                          {patient.priority.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground mt-1">{patient.waitTime}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.studentId}</p>
                        <p className="text-sm text-muted-foreground">{patient.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-medium">{patient.appointmentTime}</p>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(patient.status)}
                          <span className="text-sm text-muted-foreground capitalize">{patient.status}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-accent hover:bg-accent-hover text-accent-foreground" onClick={() => navigate(`/patient/${patient.id}`)}>
                          <UserCheck className="h-4 w-4 mr-2" />
                          See Patient
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
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today's Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-center">
                        <p className="font-semibold">{appointment.time}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(appointment.status)}
                      <span className="text-sm capitalize">{appointment.status}</span>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patient Records Tab */}
          <TabsContent value="patients" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Patient Records
                  </CardTitle>
                  <div className="flex gap-2">
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
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Search for a patient to view their records</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Department Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-3">Patient Flow Today</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Morning (8-12)</span>
                        <span className="font-semibold">8 patients</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Afternoon (12-16)</span>
                        <span className="font-semibold">4 patients</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-3">Common Conditions</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Cold & Flu</span>
                        <span className="font-semibold">35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-ups</span>
                        <span className="font-semibold">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Injuries</span>
                        <span className="font-semibold">15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-primary" />
                  Medical Inventory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">Paracetamol</h3>
                      <Badge variant="outline" className="text-green-600 border-green-600">In Stock</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">500mg tablets</p>
                    <p className="text-sm font-medium">Qty: 250 units</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">Amoxicillin</h3>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">Low Stock</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">250mg capsules</p>
                    <p className="text-sm font-medium">Qty: 15 units</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">Bandages</h3>
                      <Badge variant="outline" className="text-green-600 border-green-600">In Stock</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Sterile gauze</p>
                    <p className="text-sm font-medium">Qty: 100 units</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StaffPortal;