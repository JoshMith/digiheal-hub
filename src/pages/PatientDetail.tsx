import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  User, 
  FileText, 
  Activity, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Pill,
  Stethoscope,
  Heart,
  Thermometer,
  Scale,
  Eye
} from "lucide-react";

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock patient data - in real app, fetch based on patientId
  const patientData = {
    id: patientId,
    name: "John Doe",
    studentId: "DKUT/2024/001",
    avatar: "/placeholder.svg",
    age: 22,
    gender: "Male",
    phone: "+254 712 345 678",
    email: "john.doe@dkut.ac.ke",
    address: "DKUT Campus, Hostel Block A, Room 205",
    emergencyContact: {
      name: "Mary Doe",
      relationship: "Mother",
      phone: "+254 722 123 456"
    },
    currentVisit: {
      appointmentTime: "10:00 AM",
      priority: "high",
      reason: "Chest pain and difficulty breathing",
      waitTime: "15 min",
      status: "waiting",
      symptoms: ["Chest pain", "Shortness of breath", "Dizziness"],
      duration: "2 hours",
      severity: "Moderate to severe"
    },
    vitals: {
      bloodPressure: "140/90",
      heartRate: "95 bpm",
      temperature: "37.2°C",
      weight: "70 kg",
      height: "175 cm",
      lastUpdated: "Today, 9:45 AM"
    },
    medicalHistory: [
      {
        date: "2024-01-15",
        condition: "Common Cold",
        treatment: "Rest, fluids, paracetamol",
        doctor: "Dr. Sarah Johnson",
        status: "Resolved"
      },
      {
        date: "2023-12-10",
        condition: "Annual Health Check",
        treatment: "Routine examination",
        doctor: "Dr. Michael Brown",
        status: "Normal"
      }
    ],
    prescriptions: [
      {
        medication: "Paracetamol 500mg",
        dosage: "2 tablets every 6 hours",
        duration: "3 days",
        prescribedBy: "Dr. Sarah Johnson",
        date: "2024-01-15"
      }
    ]
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
      case "waiting": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "in-progress": return <Activity className="h-4 w-4 text-blue-500" />;
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/staff-portal')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portal
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={patientData.avatar} alt={patientData.name} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg">
                {patientData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-primary">{patientData.name}</h1>
              <p className="text-muted-foreground">{patientData.studentId} • Age {patientData.age} • {patientData.gender}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs ${getPriorityColor(patientData.currentVisit.priority)}`}>
                  {patientData.currentVisit.priority.toUpperCase()} PRIORITY
                </Badge>
                <div className="flex items-center gap-1">
                  {getStatusIcon(patientData.currentVisit.status)}
                  <span className="text-sm text-muted-foreground capitalize">{patientData.currentVisit.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Visit Alert */}
        <Card className="mb-8 border-l-4 border-l-destructive shadow-medium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Current Visit - {patientData.currentVisit.appointmentTime}
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" className="bg-accent hover:bg-accent-hover text-accent-foreground" onClick={() => navigate(`/consultation/${patientId}`)}>
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Start Consultation
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Queue
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Chief Complaint</p>
                <p className="text-muted-foreground">{patientData.currentVisit.reason}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Symptoms</p>
                <p className="text-muted-foreground">{patientData.currentVisit.symptoms.join(", ")}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Duration & Severity</p>
                <p className="text-muted-foreground">{patientData.currentVisit.duration} • {patientData.currentVisit.severity}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {patientData.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {patientData.email}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {patientData.address}
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Emergency Contact</p>
                    <p className="text-sm">{patientData.emergencyContact.name} ({patientData.emergencyContact.relationship})</p>
                    <p className="text-muted-foreground text-sm">{patientData.emergencyContact.phone}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Current Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <Heart className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Blood Pressure</p>
                        <p className="text-lg font-semibold">{patientData.vitals.bloodPressure}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Heart Rate</p>
                        <p className="text-lg font-semibold">{patientData.vitals.heartRate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <Thermometer className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Temperature</p>
                        <p className="text-lg font-semibold">{patientData.vitals.temperature}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Scale className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Weight</p>
                        <p className="text-lg font-semibold">{patientData.vitals.weight}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">Last updated: {patientData.vitals.lastUpdated}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vitals Tab */}
          <TabsContent value="vitals" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Record New Vitals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bp">Blood Pressure</Label>
                    <Input id="bp" placeholder="120/80" />
                  </div>
                  <div>
                    <Label htmlFor="hr">Heart Rate (bpm)</Label>
                    <Input id="hr" placeholder="72" />
                  </div>
                  <div>
                    <Label htmlFor="temp">Temperature (°C)</Label>
                    <Input id="temp" placeholder="36.5" />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" placeholder="70" />
                  </div>
                </div>
                <Button className="mt-4">Save Vitals</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Medical History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {patientData.medicalHistory.map((record, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{record.condition}</h3>
                      <Badge variant="outline" className={record.status === 'Resolved' ? 'text-green-600 border-green-600' : ''}>
                        {record.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{record.treatment}</p>
                    <p className="text-xs text-muted-foreground">{record.date} • {record.doctor}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-primary" />
                  Current Prescriptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {patientData.prescriptions.map((prescription, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{prescription.medication}</h3>
                    <p className="text-sm text-muted-foreground">{prescription.dosage} for {prescription.duration}</p>
                    <p className="text-xs text-muted-foreground">{prescription.date} • Prescribed by {prescription.prescribedBy}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Consultation Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="Enter consultation notes here..." rows={8} />
                <Button className="mt-4">Save Notes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDetail;