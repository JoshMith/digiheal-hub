import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Heart, 
  Brain, 
  Eye, 
  Bone, 
  Baby,
  Users,
  Clock,
  Shield,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: <Stethoscope className="h-8 w-8 text-primary" />,
      title: "General Medicine",
      description: "Comprehensive primary care for adults and families",
      features: ["Health checkups", "Chronic disease management", "Preventive care"],
      price: "From $80"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Cardiology",
      description: "Expert heart and cardiovascular care",
      features: ["ECG testing", "Heart disease treatment", "Cardiac rehabilitation"],
      price: "From $150"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "Neurology",
      description: "Specialized care for neurological conditions",
      features: ["Headache treatment", "Neurological exams", "EEG services"],
      price: "From $200"
    },
    {
      icon: <Eye className="h-8 w-8 text-blue-500" />,
      title: "Ophthalmology",
      description: "Complete eye care and vision services",
      features: ["Eye exams", "Vision correction", "Eye surgery"],
      price: "From $100"
    },
    {
      icon: <Bone className="h-8 w-8 text-orange-500" />,
      title: "Orthopedics",
      description: "Bone, joint, and musculoskeletal care",
      features: ["Fracture treatment", "Joint replacement", "Sports medicine"],
      price: "From $120"
    },
    {
      icon: <Baby className="h-8 w-8 text-pink-500" />,
      title: "Pediatrics",
      description: "Specialized healthcare for children",
      features: ["Well-child visits", "Immunizations", "Growth monitoring"],
      price: "From $60"
    }
  ];

  const emergencyServices = [
    "24/7 Emergency Care",
    "Trauma Services", 
    "Critical Care",
    "Emergency Surgery"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-subtle overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="secondary" className="mb-4">
            Medical Services
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Comprehensive Healthcare Services
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From routine checkups to specialized care, we provide exceptional medical services 
            with state-of-the-art technology and compassionate care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-appointment">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                Book Appointment
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg">
                Patient Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Medical Specialties
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Expert care across multiple specialties with experienced physicians and modern facilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-subtle">
                      {service.icon}
                    </div>
                    <Badge variant="outline">{service.price}</Badge>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/book-appointment">
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Book Appointment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="destructive" className="mb-4">
                Emergency Care
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                24/7 Emergency Medical Services
              </h2>
              <p className="text-muted-foreground mb-6">
                Our emergency department is fully equipped and staffed around the clock 
                to handle any medical emergency with rapid response times and expert care.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {emergencyServices.map((service, index) => (
                  <div key={index} className="flex items-center">
                    <Shield className="h-5 w-5 text-red-500 mr-3" />
                    <span className="text-sm font-medium">{service}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" variant="destructive">
                <Clock className="mr-2 h-5 w-5" />
                Emergency Contact
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-foreground mb-2">&lt;15</div>
                <div className="text-sm text-muted-foreground">Minutes Response Time</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Always Available</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-foreground mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </Card>
              <Card className="text-center p-6">
                <div className="flex justify-center mb-2">
                  <Star className="h-6 w-6 text-yellow-500 fill-current" />
                </div>
                <div className="text-sm text-muted-foreground">Top Rated Care</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Users className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Ready to Experience Quality Healthcare?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of satisfied patients who trust DKUT Medical for their healthcare needs. 
              Schedule your appointment today and take the first step towards better health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book-appointment">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                  Schedule Appointment
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg">
                  Patient Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
