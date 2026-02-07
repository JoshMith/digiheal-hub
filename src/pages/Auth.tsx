import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Stethoscope, Mail, Lock, User, Phone, AlertCircle, Loader2, MapPin, Globe, Heart, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { Gender } from "@/types/api.types";

const Auth = () => {
  const navigate = useNavigate();
  const { login, registerPatient, isLoading, error, clearError } = useAuth();
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Registration form state - all backend fields
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "" as Gender | "",
    phone: "",
    nationality: "",
    address: "",
    bloodGroup: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    emergencyContactEmail: "",
    insuranceProvider: "",
    policyNumber: "",
    allergies: "",
    chronicConditions: "",
    currentMedications: "",
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    clearError();
    setFormError(null);
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRegisterData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    clearError();
    setFormError(null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Helper to split comma-separated string into trimmed array
  const toArray = (value: string): string[] =>
    value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!loginData.email || !loginData.password) {
      setFormError("Please fill in all fields");
      return;
    }

    try {
      await login(loginData);
      navigate("/patient-dashboard");
    } catch (err) {
      // Error is handled by the context
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!registerData.email || !registerData.password || !registerData.studentId ||
        !registerData.firstName || !registerData.lastName || !registerData.dateOfBirth ||
        !registerData.gender || !registerData.phone) {
      setFormError("Please fill in all required fields");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (registerData.password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }

    try {
      await registerPatient({
        email: registerData.email,
        password: registerData.password,
        studentId: registerData.studentId,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        dateOfBirth: registerData.dateOfBirth,
        gender: registerData.gender as Gender,
        phone: registerData.phone,
        nationality: registerData.nationality || undefined,
        address: registerData.address || undefined,
        bloodGroup: registerData.bloodGroup || undefined,
        emergencyContactName: registerData.emergencyContactName || undefined,
        emergencyContactRelationship: registerData.emergencyContactRelationship || undefined,
        emergencyContactPhone: registerData.emergencyContactPhone || undefined,
        emergencyContactEmail: registerData.emergencyContactEmail || undefined,
        insuranceProvider: registerData.insuranceProvider || undefined,
        policyNumber: registerData.policyNumber || undefined,
        allergies: toArray(registerData.allergies).length > 0 ? toArray(registerData.allergies) : undefined,
        chronicConditions: toArray(registerData.chronicConditions).length > 0 ? toArray(registerData.chronicConditions) : undefined,
        currentMedications: toArray(registerData.currentMedications).length > 0 ? toArray(registerData.currentMedications) : undefined,
      });
      navigate("/patient-dashboard");
    } catch (err) {
      // Error is handled by the context
    }
  };

  const displayError = formError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-primary mx-auto mb-4">
            <Stethoscope className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">DKUT Medical</h1>
          <p className="text-muted-foreground">Patient Portal</p>
        </div>

        {/* Auth Forms */}
        <Card className="shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Access your health records and manage appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {displayError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="your.email@dkut.ac.ke"
                        className="pl-10"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
                
                <div className="text-center">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    Forgot your password?
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignUp} className="space-y-5">
                  {/* ---- Personal Information ---- */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                      <User className="h-4 w-4 text-primary" />
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                            value={registerData.firstName}
                            onChange={handleRegisterChange}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Doe"
                            value={registerData.lastName}
                            onChange={handleRegisterChange}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID *</Label>
                        <Input
                          id="studentId"
                          name="studentId"
                          placeholder="DKUT/2024/001"
                          value={registerData.studentId}
                          onChange={handleRegisterChange}
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupEmail">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signupEmail"
                            name="email"
                            type="email"
                            placeholder="your.email@dkut.ac.ke"
                            className="pl-10"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+254 712 345 678"
                            className="pl-10"
                            value={registerData.phone}
                            onChange={handleRegisterChange}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                          <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={registerData.dateOfBirth}
                            onChange={handleRegisterChange}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Gender *</Label>
                          <Select
                            value={registerData.gender}
                            onValueChange={(value) => handleSelectChange("gender", value)}
                            disabled={isLoading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                              <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nationality">Nationality</Label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="nationality"
                              name="nationality"
                              placeholder="e.g., Kenyan"
                              className="pl-10"
                              value={registerData.nationality}
                              onChange={handleRegisterChange}
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Blood Group</Label>
                          <Select
                            value={registerData.bloodGroup}
                            onValueChange={(value) => handleSelectChange("bloodGroup", value)}
                            disabled={isLoading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
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
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="address"
                            name="address"
                            placeholder="e.g., Nyeri, Kenya"
                            className="pl-10"
                            value={registerData.address}
                            onChange={handleRegisterChange}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* ---- Medical Information ---- */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                      <Heart className="h-4 w-4 text-primary" />
                      Medical Information
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="allergies">Allergies</Label>
                        <Textarea
                          id="allergies"
                          name="allergies"
                          placeholder="e.g., Penicillin, Peanuts (comma-separated)"
                          value={registerData.allergies}
                          onChange={handleRegisterChange}
                          disabled={isLoading}
                          rows={2}
                        />
                        <p className="text-xs text-muted-foreground">Separate multiple entries with commas</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                        <Textarea
                          id="chronicConditions"
                          name="chronicConditions"
                          placeholder="e.g., Asthma, Diabetes (comma-separated)"
                          value={registerData.chronicConditions}
                          onChange={handleRegisterChange}
                          disabled={isLoading}
                          rows={2}
                        />
                        <p className="text-xs text-muted-foreground">Separate multiple entries with commas</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currentMedications">Current Medications</Label>
                        <Textarea
                          id="currentMedications"
                          name="currentMedications"
                          placeholder="e.g., Metformin 500mg, Salbutamol inhaler (comma-separated)"
                          value={registerData.currentMedications}
                          onChange={handleRegisterChange}
                          disabled={isLoading}
                          rows={2}
                        />
                        <p className="text-xs text-muted-foreground">Separate multiple entries with commas</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* ---- Emergency Contact ---- */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                      <Phone className="h-4 w-4 text-primary" />
                      Emergency Contact
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContactName">Contact Name</Label>
                          <Input
                            id="emergencyContactName"
                            name="emergencyContactName"
                            placeholder="Jane Doe"
                            value={registerData.emergencyContactName}
                            onChange={handleRegisterChange}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                          <Input
                            id="emergencyContactRelationship"
                            name="emergencyContactRelationship"
                            placeholder="e.g., Parent, Sibling"
                            value={registerData.emergencyContactRelationship}
                            onChange={handleRegisterChange}
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                          <Input
                            id="emergencyContactPhone"
                            name="emergencyContactPhone"
                            type="tel"
                            placeholder="+254 700 000 000"
                            value={registerData.emergencyContactPhone}
                            onChange={handleRegisterChange}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContactEmail">Contact Email</Label>
                          <Input
                            id="emergencyContactEmail"
                            name="emergencyContactEmail"
                            type="email"
                            placeholder="contact@email.com"
                            value={registerData.emergencyContactEmail}
                            onChange={handleRegisterChange}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* ---- Insurance Information ---- */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                      <Shield className="h-4 w-4 text-primary" />
                      Insurance Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                          <Input
                            id="insuranceProvider"
                            name="insuranceProvider"
                            placeholder="e.g., NHIF, AAR"
                            value={registerData.insuranceProvider}
                            onChange={handleRegisterChange}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="policyNumber">Policy Number</Label>
                          <Input
                            id="policyNumber"
                            name="policyNumber"
                            placeholder="Policy / member number"
                            value={registerData.policyNumber}
                            onChange={handleRegisterChange}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* ---- Account Security ---- */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                      <Lock className="h-4 w-4 text-primary" />
                      Account Security
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signupPassword">Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signupPassword"
                            name="password"
                            type="password"
                            placeholder="Create a strong password"
                            className="pl-10"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          At least 8 characters with uppercase, lowercase, and number
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            className="pl-10"
                            value={registerData.confirmPassword}
                            onChange={handleRegisterChange}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Are you a medical staff?{" "}
                <Link to="/staff-auth" className="text-primary hover:underline">
                  Staff Portal
                </Link>
              </p>
              <p className="text-sm text-muted-foreground">
                Need help?{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  Contact support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
