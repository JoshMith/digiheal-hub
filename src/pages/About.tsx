import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Heart, 
  Users, 
  Award,
  Clock,
  Shield,
  Star,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Compassionate Care",
      description: "We treat every patient with empathy, respect, and genuine concern for their wellbeing."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Excellence & Safety",
      description: "We maintain the highest standards of medical care with state-of-the-art facilities and protocols."
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Patient-Centered",
      description: "Every decision we make prioritizes the comfort, health, and satisfaction of our patients."
    },
    {
      icon: <Award className="h-8 w-8 text-purple-500" />,
      title: "Innovation",
      description: "We embrace cutting-edge technology and medical advances to provide the best possible outcomes."
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      specialty: "Internal Medicine",
      experience: "15+ years"
    },
    {
      name: "Dr. Michael Chen",
      role: "Head of Cardiology",
      specialty: "Cardiovascular Medicine", 
      experience: "12+ years"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Director of Emergency Medicine",
      specialty: "Emergency Care",
      experience: "10+ years"
    },
    {
      name: "Dr. James Thompson",
      role: "Chief of Surgery",
      specialty: "General Surgery",
      experience: "18+ years"
    }
  ];

  const achievements = [
    { number: "50,000+", label: "Patients Served" },
    { number: "25+", label: "Medical Specialists" },
    { number: "98%", label: "Patient Satisfaction" },
    { number: "15+", label: "Years of Excellence" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-subtle overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="secondary" className="mb-4">
            About DKUT Medical
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Committed to Your Health & Wellbeing
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            For over 15 years, DKUT Medical Center has been a trusted healthcare partner, 
            providing exceptional medical services with compassion, innovation, and excellence 
            at the heart of everything we do.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-appointment">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                Schedule Appointment
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="lg">
                Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                At DKUT Medical Center, our mission is to provide accessible, high-quality healthcare 
                that improves the lives of our patients and strengthens our community. We believe 
                that excellent medical care should be combined with genuine compassion and respect 
                for every individual we serve.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Founded in 2008, we have grown from a small clinic to a comprehensive medical center, 
                but our core values remain unchanged: putting patients first, embracing innovation, 
                and maintaining the highest standards of medical excellence.
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">15+</div>
                  <div className="text-sm text-muted-foreground">Years Serving</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Lives Touched</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-elegant transition-all">
                  <div className="text-3xl font-bold text-primary mb-2">{achievement.number}</div>
                  <div className="text-sm text-muted-foreground">{achievement.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These values guide every decision we make and every interaction we have with our patients and community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-lg bg-gradient-subtle">
                      {value.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Leadership Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our experienced medical professionals are dedicated to providing the highest level of care 
              with expertise spanning multiple specialties.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>
                    <div className="font-medium text-primary">{member.role}</div>
                    <div className="text-sm mt-1">{member.specialty}</div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="outline" className="text-xs">
                    {member.experience}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-foreground mb-6">Visit Our Medical Center</h2>
              <p className="text-muted-foreground mb-8">
                Conveniently located in the heart of the city with ample parking and easy access 
                via public transportation. Our modern facility is designed with patient comfort and 
                accessibility in mind.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 text-center">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-sm text-muted-foreground">
                    123 Medical Center Drive<br />
                    Healthcare District<br />
                    City, State 12345
                  </p>
                </Card>
                
                <Card className="p-6 text-center">
                  <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-sm text-muted-foreground">
                    Main: (555) 123-4567<br />
                    Emergency: (555) 911-HELP<br />
                    Appointments: (555) 123-BOOK
                  </p>
                </Card>
                
                <Card className="p-6 text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Mon-Fri: 7:00 AM - 8:00 PM<br />
                    Saturday: 8:00 AM - 6:00 PM<br />
                    Sunday: 9:00 AM - 5:00 PM
                  </p>
                </Card>
              </div>
            </div>
            
            <div>
              <Card className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Get Started Today</h3>
                <p className="text-muted-foreground mb-6">
                  Ready to experience exceptional healthcare? Schedule your appointment or take our 
                  health assessment to get personalized recommendations.
                </p>
                <div className="space-y-3">
                  <Link to="/book-appointment">
                    <Button className="w-full bg-gradient-primary hover:opacity-90">
                      Book Appointment
                    </Button>
                  </Link>
                  <Link to="/health-assessment">
                    <Button variant="outline" className="w-full">
                      Health Assessment
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="ghost" className="w-full">
                      Patient Portal
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;