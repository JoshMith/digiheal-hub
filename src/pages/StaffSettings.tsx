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
import { ArrowLeft, Save, Shield, Bell, User, Building, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/authContext";
import { useStaff, useUpdateStaff } from "@/hooks/use-staff";
import { notificationApi } from "@/api";
import type { Staff, Department, StaffPosition, NotificationType } from "@/types/api.types";

const StaffSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { data: staffData, isLoading: isLoadingStaff } = useStaff(user?.id || '');
  const updateStaffMutation = useUpdateStaff();
  
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
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

  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load staff data into form
  useEffect(() => {
    if (staffData) {
      setProfileData({
        firstName: staffData.firstName || "",
        lastName: staffData.lastName || "",
        email: staffData.email || "",
        phone: staffData.phone || "",
        department: staffData.department || "",
        position: staffData.position || "",
        licenseNumber: staffData.licenseNumber || "",
        specialization: staffData.specialization || ""
      });
    }
  }, [staffData]);

  // Load notification preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) return;
      setIsLoadingPreferences(true);
      try {
        const prefs = await notificationApi.getPreferences();
        if (prefs) {
          setSystemSettings(prev => ({
            ...prev,
            emailNotifications: prefs.APPOINTMENT_REMINDER ?? true,
            smsNotifications: prefs.APPOINTMENT_CANCELLED ?? false,
            appointmentReminders: prefs.APPOINTMENT_REMINDER ?? true,
            emergencyAlerts: prefs.QUEUE_UPDATE ?? true,
          }));
        }
      } catch (error) {
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

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);

    try {
      // Update staff profile
      const updateData: Partial<Staff> = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        department: profileData.department as Department,
        position: profileData.position as StaffPosition,
        licenseNumber: profileData.licenseNumber,
        specialization: profileData.specialization,
      };

      await updateStaffMutation.mutateAsync({ staffId: user.id, data: updateData });

      // Update notification preferences
      const notifPrefs: Partial<Record<NotificationType, boolean>> = {
        APPOINTMENT_REMINDER: systemSettings.appointmentReminders,
        APPOINTMENT_CANCELLED: systemSettings.smsNotifications,
        QUEUE_UPDATE: systemSettings.emergencyAlerts,
      };
      await notificationApi.updatePreferences(notifPrefs);

      toast({
        title: "Settings Updated",
        description: "Your settings have been successfully saved.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingStaff) {
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
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
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
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select 
                      value={profileData.department} 
                      onValueChange={(v) => handleSelectChange('department', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GENERAL_MEDICINE">General Medicine</SelectItem>
                        <SelectItem value="CARDIOLOGY">Cardiology</SelectItem>
                        <SelectItem value="PEDIATRICS">Pediatrics</SelectItem>
                        <SelectItem value="SURGERY">Surgery</SelectItem>
                        <SelectItem value="EMERGENCY">Emergency</SelectItem>
                        <SelectItem value="MENTAL_HEALTH">Mental Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Select 
                      value={profileData.position}
                      onValueChange={(v) => handleSelectChange('position', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SENIOR_DOCTOR">Senior Doctor</SelectItem>
                        <SelectItem value="JUNIOR_DOCTOR">Junior Doctor</SelectItem>
                        <SelectItem value="CONSULTANT">Consultant</SelectItem>
                        <SelectItem value="NURSE">Nurse</SelectItem>
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      value={profileData.specialization}
                      onChange={handleProfileChange}
                    />
                  </div>
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
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={systemSettings.emailNotifications}
                        onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        checked={systemSettings.smsNotifications}
                        onCheckedChange={(checked) => handleSwitchChange('smsNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Appointment Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get reminders for upcoming appointments</p>
                      </div>
                      <Switch
                        checked={systemSettings.appointmentReminders}
                        onCheckedChange={(checked) => handleSwitchChange('appointmentReminders', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Emergency Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive urgent emergency notifications</p>
                      </div>
                      <Switch
                        checked={systemSettings.emergencyAlerts}
                        onCheckedChange={(checked) => handleSwitchChange('emergencyAlerts', checked)}
                      />
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
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button variant="outline">
                  Update Password
                </Button>
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>System-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={() => navigate("/staff-portal")}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="flex items-center gap-2"
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StaffSettings;