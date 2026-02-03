import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Stethoscope, Mail, Lock, User, Phone, Building, AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { Department, StaffPosition } from "@/types/api.types";

const StaffAuth = () => {
  const navigate = useNavigate();
  const { login, registerStaff, isLoading, error, clearError } = useAuth();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Registration form state
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    staffId: "",
    firstName: "",
    lastName: "",
    department: "" as Department | "",
    position: "" as StaffPosition | "",
    phone: "",
    specialization: "",
    licenseNumber: "",
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

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!loginData.email || !loginData.password) {
      setFormError("Please fill in all fields");
      return;
    }

    try {
      await login(loginData);
      navigate("/staff-portal");
    } catch (err) {
      // Error is handled by the context
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!registerData.email || !registerData.password || !registerData.staffId ||
        !registerData.firstName || !registerData.lastName || !registerData.department ||
        !registerData.position || !registerData.phone) {
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
      await registerStaff({
        email: registerData.email,
        password: registerData.password,
        staffId: registerData.staffId,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        department: registerData.department as Department,
        position: registerData.position as StaffPosition,
        phone: registerData.phone,
        specialization: registerData.specialization || undefined,
        licenseNumber: registerData.licenseNumber || undefined,
      });
      navigate("/staff-portal");
    } catch (err) {
      // Error is handled by the context
    }
  };

  // Add these mapping objects after your imports
const DEPARTMENT_DISPLAY: Record<Department, string> = {
  [Department.GENERAL_MEDICINE]: "General Medicine",
  [Department.EMERGENCY]: "Emergency",
  [Department.PEDIATRICS]: "Pediatrics",
  [Department.MENTAL_HEALTH]: "Mental Health",
  [Department.DENTAL]: "Dental",
  [Department.PHARMACY]: "Pharmacy",
  [Department.LABORATORY]: "Laboratory",
};

const POSITION_DISPLAY: Record<StaffPosition, string> = {
  [StaffPosition.DOCTOR]: "Doctor",
  [StaffPosition.NURSE]: "Nurse",
  [StaffPosition.PHARMACIST]: "Pharmacist",
  [StaffPosition.LAB_TECHNICIAN]: "Lab Technician",
  [StaffPosition.ADMINISTRATOR]: "Administrator",
  [StaffPosition.RECEPTIONIST]: "Receptionist",
};

  const displayError = formError || error;

  // Department options
  const departments: Department[] = Object.values(Department);

  // Position options
  const positions: StaffPosition[] = Object.values(StaffPosition);  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4 py-8">
      <Card className="w-full max-w-lg shadow-elegant">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-primary">
            <Stethoscope className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Staff Portal</CardTitle>
            <CardDescription>
              DKUT Medical Staff Authentication
            </CardDescription>
          </div>
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
                  <Label htmlFor="login-email">Staff Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="Enter your staff email"
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
                      Signing In...
                    </>
                  ) : (
                    "Sign In to Staff Portal"
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
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="First name"
                        className="pl-10"
                        value={registerData.firstName}
                        onChange={handleRegisterChange}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Last name"
                        className="pl-10"
                        value={registerData.lastName}
                        onChange={handleRegisterChange}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="staffId">Staff ID *</Label>
                  <Input
                    id="staffId"
                    name="staffId"
                    placeholder="e.g., STAFF/2024/001"
                    value={registerData.staffId}
                    onChange={handleRegisterChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="staffEmail">Staff Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="staffEmail"
                      name="email"
                      type="email"
                      placeholder="Enter your work email"
                      className="pl-10"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department *</Label>
                    <Select
                      value={registerData.department}
                      onValueChange={(value) => handleSelectChange("department", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {DEPARTMENT_DISPLAY[dept]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Position *</Label>
                    <Select
                      value={registerData.position}
                      onValueChange={(value) => handleSelectChange("position", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {POSITION_DISPLAY[pos]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      placeholder="Enter your phone number"
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
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      placeholder="e.g., Cardiology"
                      value={registerData.specialization}
                      onChange={handleRegisterChange}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      placeholder="Medical license"
                      value={registerData.licenseNumber}
                      onChange={handleRegisterChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      name="password"
                      type="password"
                      placeholder="Create a password"
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

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:opacity-90" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Staff Account"
                  )}
                </Button>
              </form>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Account may require admin approval before access is granted.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Are you a patient?{" "}
              <Link to="/auth" className="text-primary hover:underline">
                Patient Portal
              </Link>
            </p>
            <p className="text-xs text-muted-foreground">
              Need help? Contact IT support at{" "}
              <a href="mailto:it-support@dkutmedical.com" className="text-primary hover:underline">
                it-support@dkutmedical.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffAuth;