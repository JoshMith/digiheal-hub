import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  Calendar, 
  Clock, 
  Settings,
  Search,
  Plus,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  Bell,
  RefreshCw,
  UserCog,
  Building2,
  Activity,
  BarChart3,
  Database,
  Lock,
  Mail,
  Key,
  Server,
  FileText,
  MoreVertical,
  UserPlus,
  UserMinus,
  Crown
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Mock admin data
  const adminData = {
    name: "Admin User",
    role: "System Administrator",
    avatar: "/placeholder.svg",
    email: "admin@dkut.ac.ke"
  };

  // System stats
  const systemStats = {
    totalUsers: 1247,
    totalStaff: 45,
    totalPatients: 1202,
    activeUsers: 89,
    newUsersToday: 12,
    systemUptime: "99.9%"
  };

  // User list
  const users = [
    { id: 1, name: "John Doe", email: "john.doe@dkut.ac.ke", role: "PATIENT", status: "active", lastLogin: "2 hours ago" },
    { id: 2, name: "Dr. Sarah Johnson", email: "sarah.johnson@dkut.ac.ke", role: "STAFF", status: "active", lastLogin: "30 min ago" },
    { id: 3, name: "Jane Smith", email: "jane.smith@dkut.ac.ke", role: "PATIENT", status: "active", lastLogin: "1 day ago" },
    { id: 4, name: "Dr. Michael Brown", email: "michael.brown@dkut.ac.ke", role: "STAFF", status: "inactive", lastLogin: "1 week ago" },
    { id: 5, name: "Admin User", email: "admin@dkut.ac.ke", role: "ADMIN", status: "active", lastLogin: "Just now" },
    { id: 6, name: "Alice Wanjiku", email: "alice.wanjiku@dkut.ac.ke", role: "PATIENT", status: "pending", lastLogin: "Never" },
  ];

  // Department stats
  const departments = [
    { name: "General Medicine", staff: 12, patients: 450, avgWait: "15 min" },
    { name: "Emergency", staff: 8, patients: 120, avgWait: "5 min" },
    { name: "Dental", staff: 5, patients: 180, avgWait: "20 min" },
    { name: "Mental Health", staff: 4, patients: 95, avgWait: "25 min" },
    { name: "Pharmacy", staff: 6, patients: 350, avgWait: "10 min" },
  ];

  // System logs
  const systemLogs = [
    { id: 1, action: "User login", user: "Dr. Sarah Johnson", time: "2 min ago", type: "info" },
    { id: 2, action: "Password changed", user: "John Doe", time: "15 min ago", type: "security" },
    { id: 3, action: "New user registered", user: "Alice Wanjiku", time: "1 hour ago", type: "info" },
    { id: 4, action: "Failed login attempt", user: "unknown@email.com", time: "2 hours ago", type: "warning" },
    { id: 5, action: "Role changed to STAFF", user: "Dr. Michael Brown", time: "3 hours ago", type: "admin" },
    { id: 6, action: "Database backup completed", user: "System", time: "6 hours ago", type: "system" },
  ];

  // Settings
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    autoBackup: true,
    twoFactorAuth: false
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN": return <Badge className="bg-primary"><Crown className="h-3 w-3 mr-1" /> Admin</Badge>;
      case "STAFF": return <Badge variant="outline" className="border-accent text-accent"><ShieldCheck className="h-3 w-3 mr-1" /> Staff</Badge>;
      case "PATIENT": return <Badge variant="secondary">Patient</Badge>;
      default: return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge variant="outline" className="border-accent text-accent">Active</Badge>;
      case "inactive": return <Badge variant="outline" className="border-muted-foreground text-muted-foreground">Inactive</Badge>;
      case "pending": return <Badge variant="outline" className="border-warning text-warning">Pending</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case "security": return <Lock className="h-4 w-4 text-warning" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "admin": return <Shield className="h-4 w-4 text-primary" />;
      case "system": return <Server className="h-4 w-4 text-accent" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-5">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary mb-1">Admin Portal</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  System Administration & Management
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="shadow-soft">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" className="shadow-soft">
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </Button>
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-soft">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <TrendingUp className="h-4 w-4 text-accent" />
                </div>
                <p className="text-2xl font-bold text-primary">{systemStats.totalUsers}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                </div>
                <p className="text-2xl font-bold text-primary">{systemStats.totalStaff}</p>
                <p className="text-xs text-muted-foreground">Staff Members</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="h-5 w-5 text-warning" />
                </div>
                <p className="text-2xl font-bold text-primary">{systemStats.totalPatients}</p>
                <p className="text-xs text-muted-foreground">Patients</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-5 w-5 text-accent" />
                </div>
                <p className="text-2xl font-bold text-primary">{systemStats.activeUsers}</p>
                <p className="text-xs text-muted-foreground">Active Now</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  <span className="text-xs text-accent">+{systemStats.newUsersToday}</span>
                </div>
                <p className="text-2xl font-bold text-primary">{systemStats.newUsersToday}</p>
                <p className="text-xs text-muted-foreground">New Today</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <Server className="h-5 w-5 text-accent" />
                  <CheckCircle className="h-4 w-4 text-accent" />
                </div>
                <p className="text-2xl font-bold text-accent">{systemStats.systemUptime}</p>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 h-12">
                <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="departments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Building2 className="h-4 w-4 mr-2" />
                  Departments
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        User Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <span className="text-sm">Patients</span>
                          </div>
                          <span className="font-semibold">{systemStats.totalPatients}</span>
                        </div>
                        <Progress value={(systemStats.totalPatients / systemStats.totalUsers) * 100} className="h-2" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-accent" />
                            <span className="text-sm">Staff</span>
                          </div>
                          <span className="font-semibold">{systemStats.totalStaff}</span>
                        </div>
                        <Progress value={(systemStats.totalStaff / systemStats.totalUsers) * 100} className="h-2" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-warning" />
                            <span className="text-sm">Admins</span>
                          </div>
                          <span className="font-semibold">3</span>
                        </div>
                        <Progress value={(3 / systemStats.totalUsers) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        System Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Server className="h-5 w-5 text-accent" />
                          <span>Server Status</span>
                        </div>
                        <Badge className="bg-accent">Healthy</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-accent" />
                          <span>Database</span>
                        </div>
                        <Badge className="bg-accent">Connected</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <span>Last Backup</span>
                        </div>
                        <span className="text-sm text-muted-foreground">6 hours ago</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity Table */}
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      System Logs
                    </CardTitle>
                    <CardDescription>Recent system activity and events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {systemLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            {getLogIcon(log.type)}
                            <div>
                              <p className="font-medium">{log.action}</p>
                              <p className="text-sm text-muted-foreground">{log.user}</p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">{log.time}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All Logs
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          User Management
                        </CardTitle>
                        <CardDescription>Manage all system users and their roles</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                          <Input 
                            placeholder="Search users..." 
                            className="pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="patient">Patient</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add User
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 rounded-xl border hover:shadow-soft transition-all">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-gradient-secondary text-primary font-semibold">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{user.name}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              {getRoleBadge(user.role)}
                              <p className="text-xs text-muted-foreground mt-1">Last login: {user.lastLogin}</p>
                            </div>
                            {getStatusBadge(user.status)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Key className="h-4 w-4 mr-2" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <UserMinus className="h-4 w-4 mr-2" />
                                  Deactivate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Departments Tab */}
              <TabsContent value="departments" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-primary" />
                          Department Overview
                        </CardTitle>
                        <CardDescription>Manage departments and staff allocation</CardDescription>
                      </div>
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Department
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {departments.map((dept, index) => (
                        <div key={index} className="p-5 rounded-xl border hover:shadow-soft transition-all">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{dept.name}</h3>
                              <p className="text-sm text-muted-foreground">Avg wait: {dept.avgWait}</p>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-2xl font-bold text-primary">{dept.staff}</p>
                              <p className="text-xs text-muted-foreground">Staff Members</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-2xl font-bold text-primary">{dept.patients}</p>
                              <p className="text-xs text-muted-foreground">Patients</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        System Settings
                      </CardTitle>
                      <CardDescription>Configure system behavior and features</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="maintenance">Maintenance Mode</Label>
                          <p className="text-sm text-muted-foreground">Disable access for non-admin users</p>
                        </div>
                        <Switch 
                          id="maintenance" 
                          checked={systemSettings.maintenanceMode}
                          onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Send email alerts for important events</p>
                        </div>
                        <Switch 
                          id="notifications" 
                          checked={systemSettings.emailNotifications}
                          onCheckedChange={(checked) => setSystemSettings({...systemSettings, emailNotifications: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="backup">Auto Backup</Label>
                          <p className="text-sm text-muted-foreground">Automatically backup data daily</p>
                        </div>
                        <Switch 
                          id="backup" 
                          checked={systemSettings.autoBackup}
                          onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoBackup: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="2fa">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                        </div>
                        <Switch 
                          id="2fa" 
                          checked={systemSettings.twoFactorAuth}
                          onCheckedChange={(checked) => setSystemSettings({...systemSettings, twoFactorAuth: checked})}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-primary" />
                        Security
                      </CardTitle>
                      <CardDescription>Security and access control settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Key className="h-4 w-4 mr-2" />
                        Manage API Keys
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Access Control Rules
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Audit Logs
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-destructive">
                        <Database className="h-4 w-4 mr-2" />
                        Reset Database
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Admin Profile */}
            <Card className="shadow-medium">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4 border-4 border-primary/20">
                    <AvatarImage src={adminData.avatar} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl">
                      {adminData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{adminData.name}</h3>
                  <p className="text-sm text-muted-foreground">{adminData.role}</p>
                  <Badge className="mt-2 bg-primary">
                    <Crown className="h-3 w-3 mr-1" />
                    Administrator
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-medium">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border border-warning/30 bg-warning/5">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Low inventory alert</p>
                          <p className="text-xs text-muted-foreground">3 items below threshold</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                      <div className="flex items-start gap-2">
                        <Lock className="h-4 w-4 text-destructive mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Failed login attempts</p>
                          <p className="text-xs text-muted-foreground">5 attempts in last hour</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-start gap-2">
                        <UserPlus className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Pending approvals</p>
                          <p className="text-xs text-muted-foreground">2 new registrations</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-medium">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New User
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="mr-2 h-4 w-4" />
                  Backup Now
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/analytics')}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
