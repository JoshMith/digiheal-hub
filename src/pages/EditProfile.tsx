import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/authContext";
import { usePatient, useUpdatePatient } from "@/hooks/use-patients";
import { bloodGroupOptions } from "@/utils/enumMappings";

const EditProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch patient data
  const { profile } = useAuth(); // profile contains patient data
  const patientId = profile?.id; // This is the actual patient ID
  const { data: patient } = usePatient(patientId || '');
  const updatePatientMutation = useUpdatePatient();
  const isLoadingPatient = !patient && !!patientId;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bloodGroup: "",
    dateOfBirth: "",
    address: "",
    emergencyContact: "",
    medicalConditions: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    chronicConditions: "",
    allergies: "",
    insurance: ""
  });

  // Populate form when patient data loads
  useEffect(() => {
  if (patient && profile) {
    setFormData({
      // From profile (Patient | Staff)
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      email: user.email || "",
      phone: profile.phone || "",
      
      // From patient (Patient)
      bloodGroup: patient.bloodGroup || "",
      dateOfBirth: patient.dateOfBirth || "",
      address: patient.address || "",
      emergencyContactName: patient.emergencyContactName || "",
      emergencyContactPhone: patient.emergencyContactPhone || "",
      chronicConditions: patient.chronicConditions?.join(', ') || "",
      allergies: patient.allergies?.join(', ') || "",
      insurance: patient.insuranceProvider || "",
      
      // Set default values for fields not in API response
      emergencyContact: patient.emergencyContactPhone || "", // Map to emergencyContactPhone
      medicalConditions: patient.chronicConditions?.join(', ') || "", // Same as chronicConditions
    });
  }
}, [patient, profile]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated.",
        variant: "destructive",
      });
      return;
    }

    // Parse emergency contact
    const emergencyParts = formData.emergencyContact.split(' - ');
    const emergencyName = emergencyParts[0] || '';
    const emergencyPhone = emergencyParts[1] || '';

    // Parse insurance
    const insuranceParts = formData.insurance.split(' - Policy #');
    const insuranceProvider = insuranceParts[0] || '';
    const insurancePolicyNumber = insuranceParts[1] || '';

    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
      allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: formData.medicalConditions.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      await updatePatientMutation.mutateAsync({ patientId: user.id, data: updateData });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      navigate("/patient-dashboard");
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingPatient) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="grid gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/patient-dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Edit Profile</h1>
        </div>

        <div className="grid gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your basic personal details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>Contact information for emergencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="Name - Phone Number"
                />
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
              <CardDescription>Important medical details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Textarea
                  id="medicalConditions"
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  placeholder="List any ongoing medical conditions (comma separated)"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="List any known allergies (comma separated)"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Insurance Information */}
          <Card>
            <CardHeader>
              <CardTitle>Insurance Information</CardTitle>
              <CardDescription>Your insurance details</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="insurance">Insurance Provider & Policy</Label>
                <Input
                  id="insurance"
                  name="insurance"
                  value={formData.insurance}
                  onChange={handleInputChange}
                  placeholder="Insurance provider - Policy #policy number"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => navigate("/patient-dashboard")}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex items-center gap-2"
              disabled={updatePatientMutation.isPending}
            >
              {updatePatientMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;