// ============================================
// DKUT Medical Center - Patient Detail Page
// Fully integrated with backend APIs
// ============================================

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  usePatient, 
  usePatientVitalSigns, 
  usePatientAppointments,
  usePatientPrescriptions,
  usePatientStats,
  usePatientHistory,
  useAddVitalSigns,
  useStartInteraction
} from '@/hooks';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Calendar,
  Pill,
  Activity,
  FileText,
  ArrowLeft,
  Plus,
  Clock,
  Heart,
  Thermometer,
  Weight,
  Ruler
} from 'lucide-react';
import {
  getFullName,
  calculateAge,
  formatDate,
  formatDateTime,
  formatBloodPressure,
  formatTemperature,
  formatHeartRate,
  formatOxygenSaturation,
  formatWeight,
  formatHeight,
  calculateBMI,
  getRelativeTime
} from '@/utils/dataTransformations';
import {
  getDepartmentDisplay,
  getAppointmentStatusDisplay,
  getAppointmentStatusColor,
  getAppointmentTypeDisplay,
  getPrescriptionStatusDisplay,
  getPrescriptionStatusColor,
  getPriorityLevelDisplay,
  getPriorityLevelColor,
  getGenderDisplay
} from '@/utils/enumMappings';
import type { CreateVitalSignsRequest } from '@/types/api.types';

export default function PatientDetail() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVitalsDialogOpen, setIsVitalsDialogOpen] = useState(false);
  const [vitalsData, setVitalsData] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    oxygenSaturation: '',
    respiratoryRate: ''
  });

  // Fetch patient data
  const { data: patient, isLoading: isLoadingPatient, error: patientError } = usePatient(patientId!);
  
  // Fetch vital signs
  const { data: vitalSigns, isLoading: isLoadingVitals } = usePatientVitalSigns(patientId!, {
    limit: 10
  });
  
  // Fetch appointments
  const { data: appointments, isLoading: isLoadingAppointments } = usePatientAppointments(patientId!, {
    limit: 10
  });
  
  // Fetch prescriptions
  const { data: prescriptions, isLoading: isLoadingPrescriptions } = usePatientPrescriptions(patientId!, {
    limit: 10
  });
  
  // Fetch patient stats
  const { data: stats } = usePatientStats(patientId!);
  
  // Fetch medical history
  const { data: history } = usePatientHistory(patientId!);

  // Mutations
  const addVitalsMutation = useAddVitalSigns();
  const startInteractionMutation = useStartInteraction();

  // Handle loading state
  if (isLoadingPatient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading patient details...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (patientError || !patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Patient</CardTitle>
            <CardDescription>
              {patientError?.message || 'Patient not found'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/staff/patients')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Patients
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle vital signs submission
  const handleVitalsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const vitalsPayload: Omit<CreateVitalSignsRequest, 'patientId'> = {
      bloodPressureSystolic: vitalsData.bloodPressureSystolic ? Number(vitalsData.bloodPressureSystolic) : undefined,
      bloodPressureDiastolic: vitalsData.bloodPressureDiastolic ? Number(vitalsData.bloodPressureDiastolic) : undefined,
      heartRate: vitalsData.heartRate ? Number(vitalsData.heartRate) : undefined,
      temperature: vitalsData.temperature ? Number(vitalsData.temperature) : undefined,
      weight: vitalsData.weight ? Number(vitalsData.weight) : undefined,
      height: vitalsData.height ? Number(vitalsData.height) : undefined,
      oxygenSaturation: vitalsData.oxygenSaturation ? Number(vitalsData.oxygenSaturation) : undefined,
      respiratoryRate: vitalsData.respiratoryRate ? Number(vitalsData.respiratoryRate) : undefined,
    };

    try {
      await addVitalsMutation.mutateAsync({
        patientId: patientId!,
        data: vitalsPayload
      });
      
      toast({
        title: 'Success',
        description: 'Vital signs recorded successfully'
      });
      
      setIsVitalsDialogOpen(false);
      setVitalsData({
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        heartRate: '',
        temperature: '',
        weight: '',
        height: '',
        oxygenSaturation: '',
        respiratoryRate: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to record vital signs',
        variant: 'destructive'
      });
    }
  };

  // Handle start interaction
  const handleStartInteraction = async (appointmentId: string) => {
    try {
      await startInteractionMutation.mutateAsync({
        appointmentId
      });
      
      toast({
        title: 'Success',
        description: 'Interaction started successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start interaction',
        variant: 'destructive'
      });
    }
  };

  const latestVitals = vitalSigns?.[0];
  const bmi = latestVitals ? calculateBMI(latestVitals.weight, latestVitals.height) : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/staff-portal')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{getFullName(patient.firstName, patient.lastName)}</h1>
            <p className="text-muted-foreground">
              {patient.studentId} • {calculateAge(patient.dateOfBirth)} years old • {getGenderDisplay(patient.gender)}
            </p>
          </div>
        </div>
        
        <Dialog open={isVitalsDialogOpen} onOpenChange={setIsVitalsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Vitals
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Record Vital Signs</DialogTitle>
              <DialogDescription>
                Enter the patient's current vital signs
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleVitalsSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systolic">Blood Pressure (Systolic)</Label>
                  <Input
                    id="systolic"
                    type="number"
                    placeholder="120"
                    value={vitalsData.bloodPressureSystolic}
                    onChange={(e) => setVitalsData({ ...vitalsData, bloodPressureSystolic: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diastolic">Blood Pressure (Diastolic)</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    placeholder="80"
                    value={vitalsData.bloodPressureDiastolic}
                    onChange={(e) => setVitalsData({ ...vitalsData, bloodPressureDiastolic: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    placeholder="72"
                    value={vitalsData.heartRate}
                    onChange={(e) => setVitalsData({ ...vitalsData, heartRate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    value={vitalsData.temperature}
                    onChange={(e) => setVitalsData({ ...vitalsData, temperature: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="70"
                    value={vitalsData.weight}
                    onChange={(e) => setVitalsData({ ...vitalsData, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={vitalsData.height}
                    onChange={(e) => setVitalsData({ ...vitalsData, height: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oxygen">Oxygen Saturation (%)</Label>
                  <Input
                    id="oxygen"
                    type="number"
                    placeholder="98"
                    value={vitalsData.oxygenSaturation}
                    onChange={(e) => setVitalsData({ ...vitalsData, oxygenSaturation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="respiratory">Respiratory Rate (/min)</Label>
                  <Input
                    id="respiratory"
                    type="number"
                    placeholder="16"
                    value={vitalsData.respiratoryRate}
                    onChange={(e) => setVitalsData({ ...vitalsData, respiratoryRate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsVitalsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addVitalsMutation.isPending}>
                  {addVitalsMutation.isPending ? 'Saving...' : 'Save Vitals'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Patient Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Demographics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{patient.user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{patient.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{formatDate(patient.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Blood Group</p>
              <p className="font-medium">{patient.bloodGroup || 'Unknown'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Latest Vitals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Latest Vitals
            </CardTitle>
            <CardDescription>
              {latestVitals ? getRelativeTime(latestVitals.recordedAt) : 'No vitals recorded'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {latestVitals ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Blood Pressure</span>
                  </div>
                  <span className="font-medium">
                    {formatBloodPressure(latestVitals.bloodPressureSystolic, latestVitals.bloodPressureDiastolic)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Heart Rate</span>
                  </div>
                  <span className="font-medium">{formatHeartRate(latestVitals.heartRate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Temperature</span>
                  </div>
                  <span className="font-medium">{formatTemperature(latestVitals.temperature)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Weight</span>
                  </div>
                  <span className="font-medium">{formatWeight(latestVitals.weight)}</span>
                </div>
                {bmi && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">BMI</span>
                    <span className="font-medium">{bmi}</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No vital signs recorded yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Appointments</span>
              <Badge variant="secondary">{stats?.totalAppointments || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Completed</span>
              <Badge variant="secondary">{stats?.completedAppointments || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Upcoming</span>
              <Badge variant="secondary">{stats?.upcomingAppointments || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Prescriptions</span>
              <Badge variant="secondary">{stats?.activePrescriptions || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Visit</span>
              <span className="text-sm text-muted-foreground">
                {stats?.lastVisit ? getRelativeTime(stats.lastVisit) : 'Never'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medical Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Allergies</CardTitle>
          </CardHeader>
          <CardContent>
            {patient.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive">
                    {allergy}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No known allergies</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chronic Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            {patient.chronicConditions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient.chronicConditions.map((condition, index) => (
                  <Badge key={index} variant="outline">
                    {condition}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No chronic conditions</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appointments">
            <Calendar className="mr-2 h-4 w-4" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="vitals">
            <Activity className="mr-2 h-4 w-4" />
            Vital Signs
          </TabsTrigger>
          <TabsTrigger value="prescriptions">
            <Pill className="mr-2 h-4 w-4" />
            Prescriptions
          </TabsTrigger>
          <TabsTrigger value="history">
            <FileText className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
              <CardDescription>Recent and upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAppointments ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : appointments && appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getAppointmentStatusColor(appointment.status)}>
                            {getAppointmentStatusDisplay(appointment.status)}
                          </Badge>
                          <Badge variant="outline">
                            {getDepartmentDisplay(appointment.department)}
                          </Badge>
                          <Badge className={getPriorityLevelColor(appointment.priority)}>
                            {getPriorityLevelDisplay(appointment.priority)}
                          </Badge>
                        </div>
                        <p className="font-medium">{getAppointmentTypeDisplay(appointment.type)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(appointment.appointmentDate)} at {appointment.appointmentTime}
                        </p>
                        {appointment.reason && (
                          <p className="text-sm">{appointment.reason}</p>
                        )}
                        {appointment.staff && (
                          <p className="text-sm text-muted-foreground">
                            Dr. {getFullName(appointment.staff.firstName, appointment.staff.lastName)}
                          </p>
                        )}
                      </div>
                      {appointment.status === 'CHECKED_IN' && (
                        <Button
                          size="sm"
                          onClick={() => handleStartInteraction(appointment.id)}
                          disabled={startInteractionMutation.isPending}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Start
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No appointments found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vitals Tab */}
        <TabsContent value="vitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs History</CardTitle>
              <CardDescription>Recent vital signs readings</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingVitals ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : vitalSigns && vitalSigns.length > 0 ? (
                <div className="space-y-4">
                  {vitalSigns.map((vital) => (
                    <div
                      key={vital.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{formatDateTime(vital.recordedAt)}</p>
                        <Badge variant="outline">{getRelativeTime(vital.recordedAt)}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">BP</p>
                          <p className="font-medium">
                            {formatBloodPressure(vital.bloodPressureSystolic, vital.bloodPressureDiastolic)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">HR</p>
                          <p className="font-medium">{formatHeartRate(vital.heartRate)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Temp</p>
                          <p className="font-medium">{formatTemperature(vital.temperature)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">SpO2</p>
                          <p className="font-medium">{formatOxygenSaturation(vital.oxygenSaturation)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Weight</p>
                          <p className="font-medium">{formatWeight(vital.weight)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Height</p>
                          <p className="font-medium">{formatHeight(vital.height)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">RR</p>
                          <p className="font-medium">
                            {vital.respiratoryRate ? `${vital.respiratoryRate} /min` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">BMI</p>
                          <p className="font-medium">
                            {calculateBMI(vital.weight, vital.height) || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No vital signs recorded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prescription History</CardTitle>
              <CardDescription>Current and past prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPrescriptions ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : prescriptions && prescriptions.length > 0 ? (
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-lg">{prescription.medicationName}</p>
                          <p className="text-sm text-muted-foreground">
                            Prescribed {formatDate(prescription.prescribedAt)}
                          </p>
                        </div>
                        <Badge className={getPrescriptionStatusColor(prescription.status)}>
                          {getPrescriptionStatusDisplay(prescription.status)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Dosage</p>
                          <p className="font-medium">{prescription.dosage}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Frequency</p>
                          <p className="font-medium">{prescription.frequency}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Duration</p>
                          <p className="font-medium">{prescription.duration}</p>
                        </div>
                        {prescription.quantity && (
                          <div>
                            <p className="text-muted-foreground">Quantity</p>
                            <p className="font-medium">{prescription.quantity}</p>
                          </div>
                        )}
                      </div>
                      {prescription.instructions && (
                        <div>
                          <p className="text-sm text-muted-foreground">Instructions</p>
                          <p className="text-sm">{prescription.instructions}</p>
                        </div>
                      )}
                      {prescription.staff && (
                        <p className="text-sm text-muted-foreground">
                          Prescribed by Dr. {getFullName(prescription.staff.firstName, prescription.staff.lastName)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No prescriptions found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>Complete medical record</CardDescription>
            </CardHeader>
            <CardContent>
              {history ? (
                <div className="space-y-6">
                  {/* Appointments Summary */}
                  {history.appointments && history.appointments.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Appointments ({history.appointments.length})</h3>
                      <p className="text-sm text-muted-foreground">
                        {history.appointments.filter(a => a.status === 'COMPLETED').length} completed,{' '}
                        {history.appointments.filter(a => a.status === 'CANCELLED').length} cancelled
                      </p>
                    </div>
                  )}

                  {/* Prescriptions Summary */}
                  {history.prescriptions && history.prescriptions.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Prescriptions ({history.prescriptions.length})</h3>
                      <p className="text-sm text-muted-foreground">
                        {history.prescriptions.filter(p => p.status === 'ACTIVE').length} active,{' '}
                        {history.prescriptions.filter(p => p.status === 'COMPLETED').length} completed
                      </p>
                    </div>
                  )}

                  {/* Vital Signs Summary */}
                  {history.vitalSigns && history.vitalSigns.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Vital Signs ({history.vitalSigns.length} readings)</h3>
                      <p className="text-sm text-muted-foreground">
                        Last recorded {getRelativeTime(history.vitalSigns[0].recordedAt)}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Loading medical history...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}