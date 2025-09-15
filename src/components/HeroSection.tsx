import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Calendar, FileText, Users, ArrowRight, Shield, Activity } from "lucide-react";
import heroImage from "@/assets/medical-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern medical center with digital health technology"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Activity className="h-4 w-4" />
              AI-Powered Healthcare Management
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Transform Healthcare at
              <span className="block bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
                DKUT Medical Center
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the future of healthcare with our intelligent digital platform. 
              AI-powered health assessments, seamless appointments, and comprehensive medical records.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
            <Button size="lg" className="bg-accent hover:bg-accent-hover text-accent-foreground shadow-glow">
              <Brain className="mr-2 h-5 w-5" />
              Start Health Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
              <Calendar className="mr-2 h-5 w-5" />
              Book Appointment
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            <Card className="bg-card/90 backdrop-blur-sm border-border/50 shadow-medium hover:shadow-strong transition-smooth">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">AI Health Assessment</h3>
                <p className="text-muted-foreground text-sm">
                  Intelligent symptom analysis and personalized health recommendations powered by advanced AI.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/90 backdrop-blur-sm border-border/50 shadow-medium hover:shadow-strong transition-smooth">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-health rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Smart Scheduling</h3>
                <p className="text-muted-foreground text-sm">
                  Seamless appointment booking with real-time availability and automated reminders.
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
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-16 text-primary-foreground/90">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">95%</div>
              <div className="text-sm">Patient Satisfaction</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-primary-foreground/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">60%</div>
              <div className="text-sm">Reduced Wait Time</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-primary-foreground/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">24/7</div>
              <div className="text-sm">Health Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;