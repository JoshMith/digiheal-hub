import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  User, 
  FileText, 
  Activity, 
  Save,
  Stethoscope,
  Heart,
  Thermometer,
  Scale,
  CheckCircle
} from "lucide-react";

const Consultation = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("examination");

  // Mock patient data - same as PatientDetail
  const patientData = {
    id: patientId,
    name: "John Doe",
    studentId: "DKUT/2024/001",
    avatar: "/placeholder.svg",
    age: 22,
    gender: "Male",
    currentVisit: {
      appointmentTime: "10:00 AM",
      priority: "high",
      reason: "Chest pain and difficulty breathing",
      symptoms: ["Chest pain", "Shortness of breath", "Dizziness"],
      duration: "2 hours",
      severity: "Moderate to severe"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate(`/patient/${patientId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patient
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={patientData.avatar} alt={patientData.name} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                {patientData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-primary">Consultation - {patientData.name}</h1>
              <p className="text-muted-foreground">{patientData.studentId} • {patientData.currentVisit.appointmentTime}</p>
              <Badge className="bg-destructive text-destructive-foreground text-xs mt-1">
                {patientData.currentVisit.priority.toUpperCase()} PRIORITY
              </Badge>
            </div>
          </div>
        </div>

        {/* Chief Complaint */}
        <Card className="mb-6 border-l-4 border-l-primary shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Stethoscope className="h-5 w-5" />
              Chief Complaint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{patientData.currentVisit.reason}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Symptoms: {patientData.currentVisit.symptoms.join(", ")} • 
              Duration: {patientData.currentVisit.duration} • 
              Severity: {patientData.currentVisit.severity}
            </p>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="examination">Examination</TabsTrigger>
            <TabsTrigger value="vitals">Record Vitals</TabsTrigger>
            <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
            <TabsTrigger value="treatment">Treatment</TabsTrigger>
          </TabsList>

          {/* Examination Tab */}
          <TabsContent value="examination" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Physical Examination
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="general">General Appearance</Label>
                  <Textarea id="general" placeholder="Describe patient's general appearance and demeanor..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardiovascular">Cardiovascular System</Label>
                    <Textarea id="cardiovascular" placeholder="Heart sounds, rhythm, murmurs..." />
                  </div>
                  <div>
                    <Label htmlFor="respiratory">Respiratory System</Label>
                    <Textarea id="respiratory" placeholder="Breath sounds, chest movement..." />
                  </div>
                </div>
                <div>
                  <Label htmlFor="other-findings">Other Findings</Label>
                  <Textarea id="other-findings" placeholder="Additional examination findings..." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vitals Tab */}
          <TabsContent value="vitals" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Record Vital Signs
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
                  <div>
                    <Label htmlFor="oxygen">Oxygen Saturation (%)</Label>
                    <Input id="oxygen" placeholder="98" />
                  </div>
                  <div>
                    <Label htmlFor="respiratory-rate">Respiratory Rate</Label>
                    <Input id="respiratory-rate" placeholder="16" />
                  </div>
                </div>
                <Button className="mt-4">
                  <Save className="h-4 w-4 mr-2" />
                  Save Vitals
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diagnosis Tab */}
          <TabsContent value="diagnosis" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Diagnosis & Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="primary-diagnosis">Primary Diagnosis</Label>
                  <Input id="primary-diagnosis" placeholder="Enter primary diagnosis..." />
                </div>
                <div>
                  <Label htmlFor="differential">Differential Diagnosis</Label>
                  <Textarea id="differential" placeholder="List possible alternative diagnoses..." />
                </div>
                <div>
                  <Label htmlFor="assessment">Clinical Assessment</Label>
                  <Textarea id="assessment" placeholder="Detailed clinical assessment and reasoning..." rows={4} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Treatment Tab */}
          <TabsContent value="treatment" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Treatment Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="treatment-plan">Treatment Plan</Label>
                  <Textarea id="treatment-plan" placeholder="Outline the treatment plan..." rows={4} />
                </div>
                <div>
                  <Label htmlFor="medications">Medications Prescribed</Label>
                  <Textarea id="medications" placeholder="List medications, dosages, and instructions..." />
                </div>
                <div>
                  <Label htmlFor="follow-up">Follow-up Instructions</Label>
                  <Textarea id="follow-up" placeholder="Follow-up care and instructions..." />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Consultation
                  </Button>
                  <Button variant="outline">
                    Complete & Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Consultation;