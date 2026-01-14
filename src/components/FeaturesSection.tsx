import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  FileText, 
  Users, 
  Shield, 
  Bell, 
  BarChart3, 
  Smartphone,
  Heart,
  Clock,
  MessageSquare,
  CheckCircle,
  Pill,
  Timer
} from "lucide-react";

const FeaturesSection = () => {
  const navigate = useNavigate();
  const patientFeatures = [
    {
      icon: Calendar,
      title: "Smart Appointments",
      description: "Book, reschedule, and manage appointments effortlessly with real-time availability and automated reminders.",
      highlights: ["Real-time booking", "SMS reminders", "Easy rescheduling", "Queue management"]
    },
    {
      icon: Pill,
      title: "Prescription Management",
      description: "Track your medications, view prescription history, and request refills all in one place.",
      highlights: ["Active prescriptions", "Refill requests", "Medication history", "Digital records"]
    },
    {
      icon: FileText,
      title: "Digital Health Records",
      description: "Access your complete medical history, prescriptions, and lab results securely from anywhere.",
      highlights: ["Complete history", "Lab results", "Visit summaries", "Secure access"]
    },
    {
      icon: Bell,
      title: "Health Notifications",
      description: "Stay informed with timely health updates, appointment reminders, and prescription alerts.",
      highlights: ["Appointment alerts", "Prescription reminders", "Visit notifications", "System updates"]
    }
  ];

  const staffFeatures = [
    {
      icon: Users,
      title: "Patient Queue Management",
      description: "Efficiently manage patient flow with priority-based queuing and real-time patient information.",
      highlights: ["Priority queuing", "Patient summaries", "Real-time updates", "Emergency handling"]
    },
    {
      icon: Timer,
      title: "Time Tracking & Analytics",
      description: "Track interaction times with patients to optimize workflow and predict wait times using ML.",
      highlights: ["Phase tracking", "Duration analytics", "Wait time prediction", "Performance insights"]
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Gain insights into patient trends, appointment patterns, and operational efficiency.",
      highlights: ["Patient flow", "Department stats", "Staff performance", "Predictive insights"]
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "HIPAA-compliant system with end-to-end encryption and role-based access control.",
      highlights: ["HIPAA compliant", "Data encryption", "Access control", "Audit trails"]
    }
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Heart className="h-4 w-4" />
            Comprehensive Healthcare Solutions
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need for
            <span className="block text-primary">Modern Healthcare</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform serves both patients and healthcare providers with smart tools 
            designed to improve health outcomes and operational efficiency.
          </p>
        </div>

        {/* Patient Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">For Patients & Students</h3>
            <p className="text-lg text-muted-foreground">Empowering you to take control of your health journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {patientFeatures.map((feature, index) => (
              <Card key={index} className="shadow-medium hover:shadow-strong transition-smooth border-border/50">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {feature.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Staff Features */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">For Medical Staff</h3>
            <p className="text-lg text-muted-foreground">Advanced tools for efficient healthcare delivery</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {staffFeatures.map((feature, index) => (
              <Card key={index} className="shadow-medium hover:shadow-strong transition-smooth border-border/50">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-health rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {feature.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="bg-gradient-hero shadow-strong max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Ready to Experience Modern Healthcare?
              </h3>
              <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Join thousands of students and staff who have already transformed their healthcare experience 
                with our digital platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent-hover text-accent-foreground" onClick={() => navigate('/auth')}>
                  <Smartphone className="mr-2 h-5 w-5" />
                  Patient Portal
                </Button>
                <Button size="lg" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => navigate('/staff-auth')}>
                  <Clock className="mr-2 h-5 w-5" />
                  Staff Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
