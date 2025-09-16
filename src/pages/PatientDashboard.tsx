import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Pill, 
  Bell, 
  FileText, 
  Activity, 
  Heart, 
  Clock, 
  User,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Download,
  Plus,
  Edit
} from "lucide-react";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock patient data
  const patientData = {
    name: "John Doe",
    id: "DKUT/2024/001",
    email: "john.doe@dkut.ac.ke",
    phone: "+254 700 000 000",
    avatar: "/placeholder.svg",
    lastVisit: "March 15, 2024",
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
      date: "March 15, 2024"
    },
    {
      id: 2,
      name: "Ibuprofen",
      dosage: "400mg",
      frequency: "As needed",
      duration: "When required",
      remaining: 15,
      prescribed: "Dr. Sarah Johnson",
      date: "March 15, 2024"
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
    }
  ];

  const healthMetrics = {
    bloodPressure: "120/80",
    heartRate: "72 bpm",
    weight: "70 kg",
    height: "175 cm",
    bmi: "22.9",
    lastUpdated: "March 15, 2024"
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <Avatar className="h-16 w-16">
              <AvatarImage src={patientData.avatar} alt={patientData.name} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg">
                {patientData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-primary">{patientData.name}</h1>
              <p className="text-muted-foreground">Patient ID: {patientData.id}</p>
              <p className="text-sm text-muted-foreground">Last visit: {patientData.lastVisit}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/book-appointment">
              <Button className="bg-accent hover:bg-accent-hover text-accent-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </Link>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="records">Health Records</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Quick Stats */}
              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">2</p>
                      <p className="text-sm text-muted-foreground">Upcoming</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-health rounded-lg flex items-center justify-center">
                      <Pill className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">2</p>
                      <p className="text-sm text-muted-foreground">Active Meds</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                      <Bell className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">3</p>
                      <p className="text-sm text-muted-foreground">Notifications</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Activity className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">Good</p>
                      <p className="text-sm text-muted-foreground">Health Status</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-accent" />
                    <div className="flex-1">
                      <p className="font-medium">Appointment Completed</p>
                      <p className="text-sm text-muted-foreground">Dr. Sarah Johnson - General Check-up</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Lab Results Received</p>
                      <p className="text-sm text-muted-foreground">Blood Test - All normal</p>
                    </div>
                    <span className="text-xs text-muted-foreground">3 days ago</span>
                  </div>
                </CardContent>
              </Card>

              {/* Health Metrics */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Health Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Blood Pressure</p>
                      <p className="text-lg font-semibold">{healthMetrics.bloodPressure}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Heart Rate</p>
                      <p className="text-lg font-semibold">{healthMetrics.heartRate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="text-lg font-semibold">{healthMetrics.weight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">BMI</p>
                      <p className="text-lg font-semibold">{healthMetrics.bmi}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">Last updated: {healthMetrics.lastUpdated}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{appointment.doctor}</p>
                        <p className="text-sm text-muted-foreground">{appointment.department}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.date} at {appointment.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                        {appointment.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{appointment.type}</p>
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
              </CardHeader>
              <CardContent className="space-y-4">
                {medications.map((med) => (
                  <div key={med.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{med.name}</h3>
                        <p className="text-muted-foreground">{med.dosage} - {med.frequency}</p>
                      </div>
                      <Badge variant="outline">{med.remaining} left</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{med.remaining} days remaining</span>
                      </div>
                      <Progress value={(med.remaining / 30) * 100} className="h-2" />
                    </div>
                    <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                      <p>Prescribed by {med.prescribed} on {med.date}</p>
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-semibold">Blood Test Results</p>
                          <p className="text-sm text-muted-foreground">March 15, 2024</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-semibold">Chest X-Ray</p>
                          <p className="text-sm text-muted-foreground">March 10, 2024</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-lg ${!notification.read ? 'bg-accent/5 border-accent/20' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-accent' : 'bg-muted'}`} />
                        <div>
                          <p className="font-semibold">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
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