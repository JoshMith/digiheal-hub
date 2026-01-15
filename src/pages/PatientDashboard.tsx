import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, 
  Pill, 
  Bell, 
  FileText, 
  Activity, 
  Heart, 
  Clock, 
  User,
  ArrowRight,
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

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  // Mock patient data
  const patientData = {
    name: "John Doe",
    id: "DKUT/2024/001",
    email: "john.doe@dkut.ac.ke",
    phone: "+254 700 000 000",
    avatar: "/placeholder.svg",
    lastVisit: "March 15, 2024",
    address: "P.O. Box 12345, Nyeri",
    bloodGroup: "O+",
    age: 22,
    emergencyContact: "+254 711 000 000"
  };

  const upcomingAppointments = [
    {
      id: 1,
      date: "March 20, 2024",
      time: "10:00 AM",
      doctor: "Dr. Sarah Johnson",
      department: "General Medicine",
      type: "Check-up",
      status: "confirmed"
    },
    {
      id: 2,
      date: "March 25, 2024",
      time: "2:30 PM",
      doctor: "Dr. Michael Brown",
      department: "Cardiology",
      type: "Follow-up",
      status: "pending"
    }
  ];

  const medications = [
    {
      id: 1,
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "3 times daily",
      duration: "7 days",
      remaining: 5,
      prescribed: "Dr. Sarah Johnson",
      date: "March 15, 2024",
      instructions: "Take with food"
    },
    {
      id: 2,
      name: "Ibuprofen",
      dosage: "400mg",
      frequency: "As needed",
      duration: "When required",
      remaining: 15,
      prescribed: "Dr. Sarah Johnson",
      date: "March 15, 2024",
      instructions: "Take with water, max 3 per day"
    },
    {
      id: 3,
      name: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once daily",
      duration: "30 days",
      remaining: 22,
      prescribed: "Dr. Sarah Johnson",
      date: "March 10, 2024",
      instructions: "Take in the morning with breakfast"
    }
  ];

  const notifications = [
    {
      id: 1,
      title: "Appointment Reminder",
      message: "Your appointment with Dr. Sarah Johnson is tomorrow at 10:00 AM",
      time: "2 hours ago",
      type: "appointment",
      read: false
    },
    {
      id: 2,
      title: "Lab Results Available",
      message: "Your blood test results are now available to view",
      time: "1 day ago",
      type: "results",
      read: false
    },
    {
      id: 3,
      title: "Medication Reminder",
      message: "Time to take your Amoxicillin (500mg)",
      time: "3 hours ago",
      type: "medication",
      read: true
    },
    {
      id: 4,
      title: "Health Tip",
      message: "Remember to stay hydrated. Drink at least 8 glasses of water daily.",
      time: "1 day ago",
      type: "info",
      read: true
    }
  ];

  const healthMetrics = {
    bloodPressure: { value: "120/80", status: "normal", icon: Activity },
    heartRate: { value: "72", unit: "bpm", status: "normal", icon: Heart },
    temperature: { value: "36.6", unit: "°C", status: "normal", icon: Thermometer },
    weight: { value: "70", unit: "kg", status: "normal", icon: Scale },
    height: { value: "175", unit: "cm", status: "normal", icon: Ruler },
    bloodOxygen: { value: "98", unit: "%", status: "normal", icon: Droplets },
    bmi: { value: "22.9", status: "normal" },
    lastUpdated: "March 15, 2024"
  };

  const recentVisits = [
    {
      id: 1,
      date: "March 15, 2024",
      doctor: "Dr. Sarah Johnson",
      reason: "General Check-up",
      diagnosis: "Mild cold symptoms",
      status: "completed"
    },
    {
      id: 2,
      date: "February 28, 2024",
      doctor: "Dr. Michael Brown",
      reason: "Follow-up",
      diagnosis: "Blood pressure monitoring",
      status: "completed"
    }
  ];

  const healthRecords = [
    { id: 1, name: "Blood Test Results", date: "March 15, 2024", type: "Lab Results" },
    { id: 2, name: "Chest X-Ray", date: "March 10, 2024", type: "Imaging" },
    { id: 3, name: "ECG Report", date: "February 28, 2024", type: "Cardiology" },
    { id: 4, name: "Vaccination Record", date: "January 15, 2024", type: "Immunization" }
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
    switch (status) {
      case "normal": return "text-accent";
      case "warning": return "text-warning";
      case "danger": return "text-destructive";
      default: return "text-muted-foreground";
    }
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
                <h1 className="text-3xl font-bold text-primary mb-1">Welcome, {patientData.name.split(' ')[0]}!</h1>
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
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium truncate">{patientData.address}</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Appointments</TabsTrigger>
            <TabsTrigger value="medications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Medications</TabsTrigger>
            <TabsTrigger value="records" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Health Records</TabsTrigger>
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
                      <p className="text-3xl font-bold text-primary">{upcomingAppointments.length}</p>
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
                      <p className="text-3xl font-bold text-primary">{medications.length}</p>
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
                      <CardDescription>Last recorded: {healthMetrics.lastUpdated}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-accent border-accent">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      All Normal
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/50 rounded-xl border">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Blood Pressure</span>
                      </div>
                      <p className="text-2xl font-bold text-primary">{healthMetrics.bloodPressure.value}</p>
                      <p className={`text-xs ${getStatusColor(healthMetrics.bloodPressure.status)}`}>mmHg - Normal</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl border">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-4 w-4 text-destructive" />
                        <span className="text-xs text-muted-foreground">Heart Rate</span>
                      </div>
                      <p className="text-2xl font-bold text-primary">{healthMetrics.heartRate.value} <span className="text-sm font-normal">{healthMetrics.heartRate.unit}</span></p>
                      <p className={`text-xs ${getStatusColor(healthMetrics.heartRate.status)}`}>Normal</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl border">
                      <div className="flex items-center gap-2 mb-2">
                        <Thermometer className="h-4 w-4 text-warning" />
                        <span className="text-xs text-muted-foreground">Temperature</span>
                      </div>
                      <p className="text-2xl font-bold text-primary">{healthMetrics.temperature.value}<span className="text-sm font-normal">{healthMetrics.temperature.unit}</span></p>
                      <p className={`text-xs ${getStatusColor(healthMetrics.temperature.status)}`}>Normal</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl border">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="h-4 w-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Blood Oxygen</span>
                      </div>
                      <p className="text-2xl font-bold text-primary">{healthMetrics.bloodOxygen.value}<span className="text-sm font-normal">{healthMetrics.bloodOxygen.unit}</span></p>
                      <p className={`text-xs ${getStatusColor(healthMetrics.bloodOxygen.status)}`}>Excellent</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl border">
                      <div className="flex items-center gap-2 mb-2">
                        <Scale className="h-4 w-4 text-accent" />
                        <span className="text-xs text-muted-foreground">Weight</span>
                      </div>
                      <p className="text-2xl font-bold text-primary">{healthMetrics.weight.value} <span className="text-sm font-normal">{healthMetrics.weight.unit}</span></p>
                      <p className={`text-xs ${getStatusColor(healthMetrics.weight.status)}`}>Healthy</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl border">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-accent" />
                        <span className="text-xs text-muted-foreground">BMI</span>
                      </div>
                      <p className="text-2xl font-bold text-primary">{healthMetrics.bmi.value}</p>
                      <p className={`text-xs ${getStatusColor(healthMetrics.bmi.status)}`}>Normal Weight</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions & Notifications */}
              <div className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Recent Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[180px]">
                      <div className="space-y-3">
                        {notifications.slice(0, 4).map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-3 rounded-lg border transition-colors ${!notification.read ? 'bg-accent/5 border-accent/20' : 'bg-muted/30'}`}
                          >
                            <div className="flex items-start gap-3">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-muted-foreground">{notification.time}</p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <Button variant="ghost" className="w-full mt-3" onClick={() => setActiveTab("notifications")}>
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Visits & Upcoming */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                          <Calendar className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold">{appointment.doctor}</p>
                          <p className="text-sm text-muted-foreground">{appointment.department}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                          {appointment.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{appointment.type}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Recent Visits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentVisits.map((visit) => (
                    <div key={visit.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold">{visit.reason}</p>
                          <p className="text-sm text-muted-foreground">{visit.doctor}</p>
                          <p className="text-xs text-muted-foreground mt-1">{visit.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{visit.diagnosis}</p>
                        <Badge variant="outline" className="mt-1 text-accent border-accent">Completed</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Appointments</h2>
              <Link to="/book-appointment">
                <Button className="bg-accent hover:bg-accent-hover text-accent-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  Book New Appointment
                </Button>
              </Link>
            </div>
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled appointments with healthcare providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-5 border rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                        <Calendar className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{appointment.doctor}</p>
                        <p className="text-muted-foreground">{appointment.department}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {appointment.date}
                          </span>
                          <span className="text-sm flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {appointment.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'} className="text-sm">
                        {appointment.status === 'confirmed' ? (
                          <><CheckCircle2 className="h-3 w-3 mr-1" /> Confirmed</>
                        ) : (
                          <><AlertCircle className="h-3 w-3 mr-1" /> Pending</>
                        )}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Current Medications</CardTitle>
                <CardDescription>Your active prescriptions and medication schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {medications.map((med) => (
                  <div key={med.id} className="p-5 border rounded-xl hover:shadow-soft transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-health rounded-xl flex items-center justify-center shadow-soft">
                          <Pill className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{med.name}</h3>
                          <p className="text-muted-foreground">{med.dosage} - {med.frequency}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={med.remaining <= 5 ? 'border-warning text-warning' : 'border-accent text-accent'}>
                        {med.remaining} days left
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Course Progress</span>
                          <span className="font-medium">{30 - med.remaining} / 30 days</span>
                        </div>
                        <Progress value={((30 - med.remaining) / 30) * 100} className="h-2" />
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        <p className="text-sm text-muted-foreground">{med.instructions}</p>
                      </div>
                      <div className="pt-2 border-t text-sm text-muted-foreground flex justify-between">
                        <span>Prescribed by {med.prescribed}</span>
                        <span>{med.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Records Tab */}
          <TabsContent value="records" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Health Records</CardTitle>
                <CardDescription>Your medical documents and test results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {healthRecords.map((record) => (
                    <div key={record.id} className="p-5 border rounded-xl hover:shadow-soft transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{record.name}</p>
                            <p className="text-sm text-muted-foreground">{record.type}</p>
                            <p className="text-xs text-muted-foreground mt-1">{record.date}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="shadow-soft">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Stay updated with your health reminders and alerts</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Mark all as read
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-xl transition-colors ${!notification.read ? 'bg-accent/5 border-accent/20' : 'hover:bg-muted/50'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!notification.read ? 'bg-accent/20' : 'bg-muted'}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-accent rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDashboard;
