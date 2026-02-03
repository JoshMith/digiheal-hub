import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { CalendarIcon, Clock, User, Stethoscope, FileText, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/authContext";
import { useCreateAppointment, useAvailableSlots } from "@/hooks/use-appointments";
import { Department, AppointmentType, CreateAppointmentRequest, PriorityLevel } from "@/types/api.types";

const BookAppointment = () => {
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState("");
  const [department, setDepartment] = useState<Department | "">("");
  const [appointmentType, setAppointmentType] = useState<AppointmentType | "">("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    studentId: "",
    symptoms: "",
    notes: ""
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const createAppointmentMutation = useCreateAppointment();

  // Fetch available slots when date and department are selected
  const { data: availableSlots, isLoading: isLoadingSlots } = useAvailableSlots(
    date && department ? {
      date: format(date, 'yyyy-MM-dd'),
      department: department as Department,
    } : { date: '', department: 'GENERAL_MEDICINE' as Department }
  );

  const departments: { value: Department; label: string }[] = [
    { value: Department.GENERAL_MEDICINE, label: "General Medicine" },
    { value: Department.EMERGENCY, label: "Emergency" },
    { value: Department.PEDIATRICS, label: "Pediatrics" },
    { value: Department.MENTAL_HEALTH, label: "Mental Health" },
    { value: Department.DENTAL, label: "Dental" },
    { value: Department.PHARMACY, label: "Pharmacy" },
    { value: Department.LABORATORY, label: "Laboratory" }
  ];


  const appointmentTypes: { value: AppointmentType; label: string }[] = [
    { value: AppointmentType.WALK_IN, label: "Walk-in" },
    { value: AppointmentType.SCHEDULED, label: "Scheduled" },
    { value: AppointmentType.FOLLOW_UP, label: "Follow-up" },
    { value: AppointmentType.EMERGENCY, label: "Emergency" },
    { value: AppointmentType.ROUTINE_CHECKUP, label: "Routine Check-up" }
  ];


  // Get time slots from API or default list
  // Get time slots from API or default list
  const timeSlots = availableSlots?.availableSlots || [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !timeSlot || !department || !appointmentType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required appointment details.",
        variant: "destructive",
      });
      return;
    }

    // Parse time slot to create appointment time
    const [time, meridiem] = timeSlot.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const adjustedHours = meridiem === 'PM' && hours !== 12 ? hours + 12 :
      meridiem === 'AM' && hours === 12 ? 0 : hours;

    const appointmentDateTime = new Date(date);
    appointmentDateTime.setHours(adjustedHours, minutes, 0, 0);

    const appointmentData: CreateAppointmentRequest = {
      patientId: user?.id || '',
      department: department as Department,
      type: appointmentType as AppointmentType,
      appointmentDate: format(date, 'yyyy-MM-dd'),
      appointmentTime: format(appointmentDateTime, 'HH:mm:ss'),
      reason: formData.symptoms,
      notes: formData.notes,
      priority: appointmentType === AppointmentType.EMERGENCY ? PriorityLevel.HIGH : PriorityLevel.NORMAL,
    };

    try {
      await createAppointmentMutation.mutateAsync(appointmentData);
      setIsSubmitted(true);
      toast({
        title: "Appointment Booked Successfully!",
        description: "You will receive a confirmation email shortly.",
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-subtle pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">Appointment Confirmed!</h1>
            <p className="text-muted-foreground mb-8">
              Your appointment has been successfully booked. You will receive a confirmation email with all the details shortly.
            </p>
            <div className="p-4 bg-muted/50 rounded-lg mb-8">
              <p className="text-sm text-muted-foreground">
                <strong>Date:</strong> {date ? format(date, 'PPP') : '--'}<br />
                <strong>Time:</strong> {timeSlot}<br />
                <strong>Department:</strong> {departments.find(d => d.value === department)?.label}
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Button onClick={() => {
                setIsSubmitted(false);
                setDate(undefined);
                setTimeSlot("");
                setDepartment("");
                setAppointmentType("");
                setFormData({ firstName: "", lastName: "", email: "", phone: "", studentId: "", symptoms: "", notes: "" });
              }}>
                Book Another Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-primary mb-4">Book Your Appointment</h1>
            <p className="text-muted-foreground text-lg">
              Schedule your visit with DKUT Medical Center's healthcare professionals
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patient Information */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@dkut.ac.ke"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+254 700 000 000"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentId">Student/Staff ID</Label>
                    <Input
                      id="studentId"
                      placeholder="DKUT/2024/001"
                      required
                      value={formData.studentId}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Appointment Details */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    Appointment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Department</Label>
                    <Select value={department} onValueChange={(v) => setDepartment(v as Department)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.value} value={dept.value}>
                            {dept.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Appointment Type</Label>
                    <Select value={appointmentType} onValueChange={(v) => setAppointmentType(v as AppointmentType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select appointment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {appointmentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Preferred Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Preferred Time</Label>
                    {isLoadingSlots && date && department ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select value={timeSlot} onValueChange={setTimeSlot}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time: string) => (
                            <SelectItem key={time} value={time}>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {time}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Information */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="symptoms">Symptoms or Reason for Visit</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Please describe your symptoms or reason for the appointment..."
                    className="min-h-[100px]"
                    required
                    value={formData.symptoms}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information you'd like to share..."
                    className="min-h-[80px]"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                type="submit"
                size="lg"
                className="bg-accent hover:bg-accent-hover text-accent-foreground shadow-glow px-8"
                disabled={createAppointmentMutation.isPending}
              >
                {createAppointmentMutation.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CalendarIcon className="mr-2 h-5 w-5" />
                )}
                Book Appointment
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                You will receive a confirmation email once your appointment is booked
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;