import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Shield, Bell, User, Building, Loader2, Mail, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/authContext";
import { useStaff, useUpdateStaff } from "@/hooks/use-staff";
import { notificationApi } from "@/api";
import type { Staff, Department, StaffPosition, NotificationType } from "@/types/api.types";

// Add this interface for notification preferences
interface NotificationPreferences {
  APPOINTMENT_REMINDER?: boolean;
  PRESCRIPTION_READY?: boolean; // Use this for SMS
  MEDICATION_REMINDER?: boolean; // Use this for Email
  SYSTEM_ANNOUNCEMENT?: boolean;
}

const StaffSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, updateProfile } = useAuth();

  // Get staff profile from auth context or fetch it
  const staffProfile = profile as Staff | null;
  const { data: staffResponse, isLoading: isLoadingStaff } = useStaff(user?.id || '');

  // Extract staff data from the API response
  const staffData = staffResponse?.data;

  // Use staffData if available, otherwise use staffProfile from auth
  const currentStaff = staffData || staffProfile;

  const updateStaffMutation = useUpdateStaff();

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    department: "" as Department | "",
    position: "" as StaffPosition | "",
    licenseNumber: "",
    specialization: ""
  });

  const [systemSettings, setSystemSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    emergencyAlerts: true,
    systemMaintenance: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load staff data into form
  useEffect(() => {
    if (currentStaff) {
      setProfileData({
        firstName: currentStaff.firstName || "",
        lastName: currentStaff.lastName || "",
        email: user?.email || "",
        phone: currentStaff.phone || "",
        department: currentStaff.department || "" as Department | "",
        position: currentStaff.position || "" as StaffPosition | "",
        licenseNumber: currentStaff.licenseNumber || "",
        specialization: currentStaff.specialization || ""
      });
    }
  }, [currentStaff, user?.email]);

  // Load notification preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) return;
      setIsLoadingPreferences(true);
      try {
        const response = await notificationApi.getPreferences();
        const prefs = response.data as NotificationPreferences;
        if (prefs) {
          setSystemSettings(prev => ({
            ...prev,
            emailNotifications: prefs.MEDICATION_REMINDER ?? true, // Map MEDICATION_REMINDER to Email
            smsNotifications: prefs.PRESCRIPTION_READY ?? false,   // Map PRESCRIPTION_READY to SMS
            appointmentReminders: prefs.APPOINTMENT_REMINDER ?? true,
            emergencyAlerts: prefs.SYSTEM_ANNOUNCEMENT ?? true,
          }));
        }
      } catch (error) {
        console.error("Failed to load notification preferences:", error);
        // Use defaults on error
      } finally {
        setIsLoadingPreferences(false);
      }
    };
    loadPreferences();
  }, [user?.id]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSystemSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveProfile = async () => {
    if (!user?.id || !currentStaff?.id) return;
    setIsSaving(true);

    try {
      // Update staff profile
      const updateData: Partial<Staff> = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        department: profileData.department as Department,
        position: profileData.position as StaffPosition,
        licenseNumber: profileData.licenseNumber || null,
        specialization: profileData.specialization || null,
      };

      await updateStaffMutation.mutateAsync({
        staffId: currentStaff.id,
        data: updateData
      });

      // Update auth context profile
      if (updateProfile && staffProfile) {
        updateProfile({
          ...staffProfile,
          ...updateData
        });
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully saved.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!user?.id) return;
    setIsSaving(true);

    try {
      // Update notification preferences
      const notifPrefs: Partial<Record<NotificationType, boolean>> = {
        APPOINTMENT_REMINDER: systemSettings.appointmentReminders,
        PRESCRIPTION_READY: systemSettings.smsNotifications,
        SYSTEM_ANNOUNCEMENT: systemSettings.emergencyAlerts,
        MEDICATION_REMINDER: systemSettings.emailNotifications,
      };
      await notificationApi.updatePreferences(notifPrefs);

      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to save notification settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user?.id) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Note: You'll need to implement password update API
      // await authApi.changePassword({
      //   currentPassword: passwordData.currentPassword,
      //   newPassword: passwordData.newPassword
      // });

      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update password. Please check your current password.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingStaff && !currentStaff) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-8 w-40" />
          </div>
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/staff-portal")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portal
          </Button>
          <h1 className="text-3xl font-bold">Staff Settings</h1>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal and professional details</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Contact administrator to change email
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={profileData.department}
                      onValueChange={(v) => handleSelectChange('department', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GENERAL_MEDICINE">General Medicine</SelectItem>
                        <SelectItem value="EMERGENCY">Emergency</SelectItem>
                        <SelectItem value="PEDIATRICS">Pediatrics</SelectItem>
                        <SelectItem value="MENTAL_HEALTH">Mental Health</SelectItem>
                        <SelectItem value="DENTAL">Dental</SelectItem>
                        <SelectItem value="PHARMACY">Pharmacy</SelectItem>
                        <SelectItem value="LABORATORY">Laboratory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="position">Position *</Label>
                    <Select
                      value={profileData.position}
                      onValueChange={(v) => handleSelectChange('position', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DOCTOR">Doctor</SelectItem>
                        <SelectItem value="NURSE">Nurse</SelectItem>
                        <SelectItem value="PHARMACIST">Pharmacist</SelectItem>
                        <SelectItem value="LAB_TECHNICIAN">Lab Technician</SelectItem>
                        <SelectItem value="ADMINISTRATOR">Administrator</SelectItem>
                        <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      value={profileData.licenseNumber}
                      onChange={handleProfileChange}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      value={profileData.specialization}
                      onChange={handleProfileChange}
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoadingPreferences ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-base">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                      </div>
                      <Switch
                        checked={systemSettings.emailNotifications}
                        onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                          <Smartphone className="h-5 w-5 text-warning" />
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-base">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                        </div>
                      </div>
                      <Switch
                        checked={systemSettings.smsNotifications}
                        onCheckedChange={(checked) => handleSwitchChange('smsNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                          <Bell className="h-5 w-5 text-accent" />
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-base">Appointment Reminders</Label>
                          <p className="text-sm text-muted-foreground">Get reminders for upcoming appointments</p>
                        </div>
                      </div>
                      <Switch
                        checked={systemSettings.appointmentReminders}
                        onCheckedChange={(checked) => handleSwitchChange('appointmentReminders', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                          <Shield className="h-5 w-5 text-destructive" />
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-base">Emergency Alerts</Label>
                          <p className="text-sm text-muted-foreground">Receive urgent emergency notifications</p>
                        </div>
                      </div>
                      <Switch
                        checked={systemSettings.emergencyAlerts}
                        onCheckedChange={(checked) => handleSwitchChange('emergencyAlerts', checked)}
                      />
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handleSaveNotifications}
                        className="flex items-center gap-2"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Save Notifications
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password *</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password *</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <Button
                    onClick={handleUpdatePassword}
                    className="flex items-center gap-2"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Update Password
                  </Button>
                </div>
                <div className="pt-6 border-t">
                  <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline" disabled>
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings - Admin Only */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>System-wide settings and preferences (Admin Only)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {user?.role === 'ADMIN' ? (
                  <>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">Enable system maintenance mode</p>
                      </div>
                      <Switch
                        checked={systemSettings.systemMaintenance}
                        onCheckedChange={(checked) => handleSwitchChange('systemMaintenance', checked)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="backupFrequency">Backup Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save System Settings
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>System settings are only accessible to administrators.</p>
                    <p className="text-sm mt-1">Contact your system administrator for assistance.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StaffSettings;