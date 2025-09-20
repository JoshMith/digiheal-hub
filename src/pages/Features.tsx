import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, Brain, Calendar, FileText, Bell, BarChart3, 
  Shield, MessageSquare, Users, Clock, CheckCircle, Star,
  Smartphone, Monitor, Heart, Database, Lock, Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  const patientFeatures = [
    {
      icon: Brain,
      title: "AI Health Assessment",
      description: "Get personalized health insights with our advanced AI diagnostic system",
      features: ["Symptom analysis", "Risk assessment", "Treatment recommendations", "24/7 availability"],
      badge: "AI Powered"
    },
    {
      icon: Calendar,
      title: "Smart Appointments",
      description: "Book and manage appointments with intelligent scheduling",
      features: ["Real-time availability", "Automatic reminders", "Easy rescheduling", "Queue management"],
      badge: "Smart"
    },
    {
      icon: FileText,
      title: "Digital Health Records",
      description: "Secure, comprehensive digital health record management",
      features: ["Complete medical history", "Test results", "Prescription tracking", "Easy sharing"],
      badge: "Secure"
    },
    {
      icon: Bell,
      title: "Health Notifications",
      description: "Stay informed with personalized health alerts and reminders",
      features: ["Medication reminders", "Appointment alerts", "Health tips", "Emergency notifications"],
      badge: "Proactive"
    }
  ];

  const staffFeatures = [
    {
      icon: Users,
      title: "Patient Queue Management",
      description: "Efficiently manage patient flow and reduce waiting times",
      features: ["Real-time queue status", "Priority management", "Automated check-in", "Wait time optimization"],
      badge: "Efficient"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights into patient care and clinic operations",
      features: ["Patient analytics", "Performance metrics", "Revenue tracking", "Predictive insights"],
      badge: "Insights"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security for patient data protection",
      features: ["HIPAA compliant", "End-to-end encryption", "Access controls", "Audit trails"],
      badge: "Compliant"
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description: "Streamlined communication between staff and patients",
      features: ["Secure messaging", "Video consultations", "Group discussions", "File sharing"],
      badge: "Connected"
    }
  ];

  const technicalFeatures = [
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Access from any device, anywhere"
    },
    {
      icon: Monitor,
      title: "Real-time Updates",
      description: "Live data synchronization across all devices"
    },
    {
      icon: Heart,
      title: "Patient-Centric",
      description: "Designed with patient experience in mind"
    },
    {
      icon: Database,
      title: "Scalable Architecture",
      description: "Grows with your healthcare needs"
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data security is our top priority"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed and performance"
    }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Platform Features</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the comprehensive features that make DKUT Medical the leading digital health platform
          </p>
        </div>

        {/* Patient Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">For Patients</h2>
            <p className="text-lg text-muted-foreground">
              Empowering patients with intelligent healthcare tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {patientFeatures.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {feature.badge}
                  </Badge>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Staff Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">For Medical Staff</h2>
            <p className="text-lg text-muted-foreground">
              Advanced tools for healthcare professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {staffFeatures.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                    {feature.badge}
                  </Badge>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-secondary/20">
                      <feature.icon className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-secondary-foreground" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technical Features */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Technical Excellence</h2>
            <p className="text-lg text-muted-foreground">
              Built with cutting-edge technology for reliability and performance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {technicalFeatures.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-md transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="text-center py-12">
            <Star className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">Ready to Experience the Future of Healthcare?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of patients and healthcare providers who trust DKUT Medical for their digital health needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/health-assessment">
                <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                  Start Health Assessment
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Features;