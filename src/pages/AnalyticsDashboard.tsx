import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  Activity,
  Target,
  ArrowLeft,
  Download,
  RefreshCw,
  Brain
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from "recharts";
import {
  useDashboardMetrics,
  usePatientFlowData,
  useWaitTimeData,
  useDepartmentLoad,
  useStaffPerformance,
  usePredictionAccuracy,
  useTodayStats,
} from "@/hooks/use-analytics";
import type { Department } from "@/types/api.types";

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("week");

  // Calculate date range params
  const getDateRangeParams = () => {
    const endDate = new Date().toISOString();
    const startDate = new Date();
    switch (dateRange) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "quarter":
        startDate.setMonth(startDate.getMonth() - 3);
        break;
    }
    return { startDate: startDate.toISOString(), endDate };
  };

  const dateRangeParams = getDateRangeParams();

  // API hooks
  const { data: dashboardMetrics, isLoading: isLoadingMetrics, refetch: refetchMetrics } = useDashboardMetrics(dateRangeParams);
  const { data: patientFlowData, isLoading: isLoadingFlow, refetch: refetchFlow } = usePatientFlowData({
    ...dateRangeParams,
    granularity: 'hourly'
  });
  const { data: waitTimeData, isLoading: isLoadingWaitTime, refetch: refetchWaitTime } = useWaitTimeData({
    ...dateRangeParams,
    granularity: 'daily'
  });
  const { data: departmentLoad, isLoading: isLoadingDept, refetch: refetchDept } = useDepartmentLoad(dateRangeParams);
  const { data: staffPerformance, isLoading: isLoadingStaff, refetch: refetchStaff } = useStaffPerformance(dateRangeParams);
  const { data: predictionAccuracy, isLoading: isLoadingPrediction, refetch: refetchPrediction } = usePredictionAccuracy(dateRangeParams);
  const { data: todayStats, isLoading: isLoadingToday, refetch: refetchToday } = useTodayStats();

  const handleRefresh = () => {
    refetchMetrics();
    refetchFlow();
    refetchWaitTime();
    refetchDept();
    refetchStaff();
    refetchPrediction();
    refetchToday();
  };

  // Format patient flow data for chart
  const formattedFlowData = patientFlowData?.map((item: { hour?: string; time?: string; count?: number; patients?: number }) => ({
    time: item.hour || item.time || '',
    patients: item.count || item.patients || 0,
  })) || [];

  // Format department data for chart
  const formattedDeptData = departmentLoad?.map((item: { department?: Department; name?: string; currentLoad?: number; patients?: number; avgWaitTime?: number; avgWait?: number }) => ({
    name: item.department?.replace(/_/g, ' ') || item.name || '',
    patients: item.currentLoad || item.patients || 0,
    avgWait: item.avgWaitTime || item.avgWait || 0,
  })) || [];

  // Format wait times data for chart
  const formattedWaitData = waitTimeData?.map((item: { date?: string; actualWaitTime?: number; avgWait?: number; predictedWaitTime?: number; predicted?: number }) => ({
    date: item.date ? new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }) : '',
    avgWait: item.actualWaitTime || item.avgWait || 0,
    predicted: item.predictedWaitTime || item.predicted || 0,
  })) || [];

  // Format staff performance data for table
  const formattedStaffData = staffPerformance?.map((item: { staffName?: string; name?: string; patientsServed?: number; patients?: number; avgConsultationTime?: number; avgTime?: number; rating?: number }) => ({
    name: item.staffName || item.name || '',
    patients: item.patientsServed || item.patients || 0,
    avgTime: item.avgConsultationTime || item.avgTime || 0,
    rating: item.rating || 0,
  })) || [];

  // Format prediction accuracy data for chart
  const formattedPredictionData = predictionAccuracy?.map((item: { week?: string; period?: string; accuracy?: number }) => ({
    week: item.week || item.period || '',
    accuracy: item.accuracy || 0,
  })) || [];

  // Appointment type data (from dashboard metrics or defaults)
  const appointmentTypeData = [
  { name: "Walk-in", value: 0, color: "hsl(var(--primary))" },
  { name: "Scheduled", value: 0, color: "hsl(var(--accent))" },
  { name: "Follow-up", value: 0, color: "hsl(var(--warning))" },
  { name: "Emergency", value: 0, color: "hsl(var(--destructive))" },
];
// Show message: "Appointment type breakdown not available"

  // Summary stats from API or fallbacks
  const summaryStats = {
    totalPatients: dashboardMetrics?.totalPatientsToday || 0,
    avgWaitTime: dashboardMetrics?.avgWaitTime || 0,
    completionRate: dashboardMetrics?.completionRate || 0,
    noShowRate: dashboardMetrics?.noShowRate || 0,
  };

  const isLoading = isLoadingMetrics || isLoadingToday;

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <Link to="/staff-portal" className="text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive insights and performance metrics</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-7 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-primary">{summaryStats.totalPatients}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Total Patients</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-health rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-7 w-12" />
                  ) : (
                    <p className="text-2xl font-bold text-primary">{todayStats.data?.todayPatients || 0}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
              </div>
            </CardContent>
          </Card> */}

          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-7 w-14" />
                  ) : (
                    <p className="text-2xl font-bold text-primary">{Math.round(summaryStats.avgWaitTime)}m</p>
                  )}
                  <p className="text-xs text-muted-foreground">Avg Wait</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-7 w-14" />
                  ) : (
                    <p className="text-2xl font-bold text-primary">{summaryStats.completionRate.toFixed(1)}%</p>
                  )}
                  <p className="text-xs text-muted-foreground">Completion</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-7 w-14" />
                  ) : (
                    <p className="text-2xl font-bold text-primary">{summaryStats.noShowRate.toFixed(1)}%</p>
                  )}
                  <p className="text-xs text-muted-foreground">No-Show</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-health rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-7 w-14" />
                  ) : (
                    <p className="text-2xl font-bold text-primary">{Math.round(Number(predictionAccuracy))}%</p>
                  )}
                  <p className="text-xs text-muted-foreground">ML Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="staff">Staff Performance</TabsTrigger>
            <TabsTrigger value="predictions">ML Predictions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patient Flow */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Patient Flow Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {isLoadingFlow ? (
                      <div className="flex items-center justify-center h-full">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : formattedFlowData.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={formattedFlowData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="time" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="patients"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary) / 0.2)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Appointment Types */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Appointment Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={appointmentTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {appointmentTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Wait Times Trend */}
              <Card className="shadow-medium lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Wait Times Trend (Actual vs Predicted)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {isLoadingWaitTime ? (
                      <div className="flex items-center justify-center h-full">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : formattedWaitData.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formattedWaitData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="date" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="avgWait"
                            name="Actual Wait Time"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--primary))' }}
                          />
                          <Line
                            type="monotone"
                            dataKey="predicted"
                            name="ML Predicted"
                            stroke="hsl(var(--accent))"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ fill: 'hsl(var(--accent))' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Department Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  {isLoadingDept ? (
                    <div className="flex items-center justify-center h-full">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : formattedDeptData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No department data available
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={formattedDeptData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" className="text-xs" />
                        <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="patients" name="Patients" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
                  {formattedDeptData.map((dept: { name: string; avgWait: number }) => (
                    <div key={dept.name} className="p-4 bg-muted/50 rounded-lg">
                      <p className="font-semibold">{dept.name}</p>
                      <p className="text-sm text-muted-foreground">Avg Wait: {Math.round(dept.avgWait)} min</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Performance Tab */}
          <TabsContent value="staff" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Staff Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStaff ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : formattedStaffData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No staff performance data available
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Staff Member</th>
                          <th className="text-left py-3 px-4">Patients Served</th>
                          <th className="text-left py-3 px-4">Avg Time (min)</th>
                          <th className="text-left py-3 px-4">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formattedStaffData.map((staff: { name: string; patients: number; avgTime: number; rating: number }, index: number) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium">{staff.name}</td>
                            <td className="py-3 px-4">{staff.patients}</td>
                            <td className="py-3 px-4">{Math.round(staff.avgTime)}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <span className="mr-2">{staff.rating?.toFixed(1) || '--'}</span>
                                {staff.rating > 0 && (
                                  <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <span
                                        key={i}
                                        className={`text-xs ${i < Math.round(staff.rating) ? 'text-warning' : 'text-muted'}`}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ML Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  ML Prediction Accuracy Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  {isLoadingPrediction ? (
                    <div className="flex items-center justify-center h-full">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : formattedPredictionData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No prediction data available
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={formattedPredictionData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="week" className="text-xs" />
                        <YAxis domain={[0, 100]} className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number) => [`${value}%`, 'Accuracy']}
                        />
                        <Line
                          type="monotone"
                          dataKey="accuracy"
                          stroke="hsl(var(--accent))"
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Prediction insights */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">ML Model Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    Our machine learning model continuously learns from patient flow patterns to improve wait time predictions.
                    Current accuracy: <span className="font-semibold text-primary">{Math.round(Number(predictionAccuracy))}%</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;