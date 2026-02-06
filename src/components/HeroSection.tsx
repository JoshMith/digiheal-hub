import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileText, Users, ArrowRight, Shield, Activity, Clock, Pill } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/african-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="African healthcare professional consulting with university student patient"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/80 to-primary/95"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Activity className="h-4 w-4" />
              Smart Healthcare Management
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Transform Healthcare at
              <span className="block text-accent drop-shadow-lg">
                DKUT Medical Center
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Experience modern healthcare with our digital platform. 
              Smart scheduling, prescription management, and comprehensive medical records — all in one place.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
            <Link to="/auth">
              <Button size="lg" className="bg-accent hover:bg-accent-hover text-accent-foreground shadow-glow">
                <Users className="mr-2 h-5 w-5" />
                Patient Portal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/book-appointment">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/40 text-white hover:bg-white/20 backdrop-blur-sm">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            <Card className="bg-card/90 backdrop-blur-sm border-border/50 shadow-medium hover:shadow-strong transition-smooth">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Smart Scheduling</h3>
                <p className="text-muted-foreground text-sm">
                  Book appointments with real-time availability, queue management, and automated reminders.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/90 backdrop-blur-sm border-border/50 shadow-medium hover:shadow-strong transition-smooth">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-health rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Pill className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Prescription Tracking</h3>
                <p className="text-muted-foreground text-sm">
                  Manage your medications, track prescriptions, and request refills digitally.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/90 backdrop-blur-sm border-border/50 shadow-medium hover:shadow-strong transition-smooth">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-4 border">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Secure Records</h3>
                <p className="text-muted-foreground text-sm">
                  HIPAA-compliant digital health records with complete privacy and security protection.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-16 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent drop-shadow-md">95%</div>
              <div className="text-sm text-white/90">Patient Satisfaction</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent drop-shadow-md">60%</div>
              <div className="text-sm text-white/90">Reduced Wait Time</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent drop-shadow-md">24/7</div>
              <div className="text-sm text-white/90">Portal Access</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
