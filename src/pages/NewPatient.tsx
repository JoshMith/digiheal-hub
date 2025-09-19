import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  UserPlus, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Shield,
  Heart,
  FileText,
  Save,
  CheckCircle
} from "lucide-react";

const NewPatient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    studentId: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    phone: "",
    email: "",
    address: "",
    
    // Emergency Contact
    emergencyName: "",
    emergencyRelationship: "",
    emergencyPhone: "",
    emergencyEmail: "",
    
    // Medical Information
    bloodGroup: "",
    allergies: "",
    chronicConditions: "",
    currentMedications: "",
    previousSurgeries: "",
    
    // Insurance Information
    insuranceProvider: "",
    policyNumber: "",
    
    // Additional Information
    notes: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'studentId', 'dateOfBirth', 'gender', 'phone', 'email'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      toast({
        title: "Patient Registered Successfully!",
        description: `Patient ${formData.firstName} ${formData.lastName} has been added to the system.`,
      });
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-subtle pt-20">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto text-center shadow-strong">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-4">Patient Successfully Registered!</h2>
              <p className="text-muted-foreground mb-6">
                {formData.firstName} {formData.lastName} ({formData.studentId}) has been added to the patient database.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/staff-portal')} className="bg-accent hover:bg-accent-hover text-accent-foreground">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Portal
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    firstName: "", lastName: "", studentId: "", dateOfBirth: "", gender: "", nationality: "",
                    phone: "", email: "", address: "", emergencyName: "", emergencyRelationship: "", emergencyPhone: "",
                    emergencyEmail: "", bloodGroup: "", allergies: "", chronicConditions: "", currentMedications: "",
                    previousSurgeries: "", insuranceProvider: "", policyNumber: "", notes: ""
                  });
                }}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Another Patient
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/staff-portal')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portal
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">Register New Patient</h1>
            <p className="text-muted-foreground">Add a new student or staff member to the medical system</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
              <TabsTrigger value="medical">Medical Info</TabsTrigger>
              <TabsTrigger value="additional">Additional</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="studentId">Student/Staff ID *</Label>
                      <Input
                        id="studentId"
                        value={formData.studentId}
                        onChange={(e) => handleInputChange('studentId', e.target.value)}
                        placeholder="e.g., DKUT/2024/001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Gender *</Label>
                      <RadioGroup
                        value={formData.gender}
                        onValueChange={(value) => handleInputChange('gender', value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={formData.nationality}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        placeholder="Enter nationality"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+254 712 345 678"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="student@dkut.ac.ke"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter full address"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Emergency Contact Tab */}
            <TabsContent value="emergency" className="space-y-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Emergency Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyName">Contact Name</Label>
                      <Input
                        id="emergencyName"
                        value={formData.emergencyName}
                        onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                        placeholder="Enter emergency contact name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyRelationship">Relationship</Label>
                      <Select value={formData.emergencyRelationship} onValueChange={(value) => handleInputChange('emergencyRelationship', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="guardian">Guardian</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyPhone">Phone Number</Label>
                      <Input
                        id="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                        placeholder="+254 722 123 456"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyEmail">Email Address</Label>
                      <Input
                        id="emergencyEmail"
                        type="email"
                        value={formData.emergencyEmail}
                        onChange={(e) => handleInputChange('emergencyEmail', e.target.value)}
                        placeholder="emergency@email.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medical Information Tab */}
            <TabsContent value="medical" className="space-y-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Medical Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                      <Input
                        id="insuranceProvider"
                        value={formData.insuranceProvider}
                        onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                        placeholder="Enter insurance provider"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="allergies">Known Allergies</Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      placeholder="List any known allergies (food, medication, environmental)"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                    <Textarea
                      id="chronicConditions"
                      value={formData.chronicConditions}
                      onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
                      placeholder="List any chronic medical conditions"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentMedications">Current Medications</Label>
                    <Textarea
                      id="currentMedications"
                      value={formData.currentMedications}
                      onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                      placeholder="List current medications and dosages"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="previousSurgeries">Previous Surgeries</Label>
                    <Textarea
                      id="previousSurgeries"
                      value={formData.previousSurgeries}
                      onChange={(e) => handleInputChange('previousSurgeries', e.target.value)}
                      placeholder="List any previous surgeries or major medical procedures"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Additional Information Tab */}
            <TabsContent value="additional" className="space-y-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="policyNumber">Insurance Policy Number</Label>
                    <Input
                      id="policyNumber"
                      value={formData.policyNumber}
                      onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                      placeholder="Enter policy number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any additional information or special notes"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-6">
                    <Button variant="outline" onClick={() => navigate('/staff-portal')}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="bg-accent hover:bg-accent-hover text-accent-foreground">
                      <Save className="mr-2 h-4 w-4" />
                      Register Patient
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default NewPatient;