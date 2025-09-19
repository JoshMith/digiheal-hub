import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, AlertTriangle, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const HealthAssessment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    symptoms: "",
    duration: "",
    severity: "",
    conditions: [] as string[],
    medications: "",
  });
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const symptoms = [
    "Fever", "Headache", "Cough", "Nausea", "Fatigue", "Chest Pain", 
    "Shortness of Breath", "Dizziness", "Abdominal Pain", "Joint Pain"
  ];

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      conditions: checked 
        ? [...prev.conditions, symptom]
        : prev.conditions.filter(s => s !== symptom)
    }));
  };

  const generateAssessment = () => {
    setLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const severityScore = formData.severity === "severe" ? 8 : 
                           formData.severity === "moderate" ? 5 : 2;
      const symptomCount = formData.conditions.length;
      const riskScore = severityScore + symptomCount;

      let urgency = "low";
      let recommendation = "Monitor symptoms and consider scheduling a routine appointment";
      let actions = ["Rest and stay hydrated", "Take over-the-counter pain relief if needed", "Monitor symptoms"];

      if (riskScore >= 8) {
        urgency = "high";
        recommendation = "Seek immediate medical attention";
        actions = ["Visit emergency room immediately", "Do not delay medical care", "Bring this assessment with you"];
      } else if (riskScore >= 5) {
        urgency = "moderate";
        recommendation = "Schedule an appointment within 24-48 hours";
        actions = ["Book an appointment soon", "Monitor symptoms closely", "Seek immediate care if symptoms worsen"];
      }

      setAssessment({
        urgency,
        riskScore,
        recommendation,
        actions,
        confidence: Math.max(75, 95 - symptomCount * 2)
      });
      setLoading(false);
    }, 2000);
  };

  const renderStep1 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-accent" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({...prev, age: e.target.value}))}
            />
          </div>
          <div>
            <Label>Gender</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => setFormData(prev => ({...prev, gender: value}))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div>
          <Label htmlFor="symptoms">Describe your symptoms</Label>
          <Textarea
            id="symptoms"
            placeholder="Please describe what you're experiencing in detail..."
            value={formData.symptoms}
            onChange={(e) => setFormData(prev => ({...prev, symptoms: e.target.value}))}
            rows={4}
          />
        </div>

        <Button 
          onClick={() => setCurrentStep(2)}
          disabled={!formData.age || !formData.gender || !formData.symptoms}
          className="w-full"
        >
          Continue to Symptom Selection
        </Button>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-accent" />
          Symptom Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Select all symptoms you're experiencing:</Label>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {symptoms.map((symptom) => (
              <div key={symptom} className="flex items-center space-x-2">
                <Checkbox
                  id={symptom}
                  checked={formData.conditions.includes(symptom)}
                  onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                />
                <Label htmlFor={symptom}>{symptom}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>How long have you been experiencing these symptoms?</Label>
          <RadioGroup
            value={formData.duration}
            onValueChange={(value) => setFormData(prev => ({...prev, duration: value}))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hours" id="hours" />
              <Label htmlFor="hours">Less than 24 hours</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="days" id="days" />
              <Label htmlFor="days">1-7 days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weeks" id="weeks" />
              <Label htmlFor="weeks">More than a week</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Rate the severity of your symptoms:</Label>
          <RadioGroup
            value={formData.severity}
            onValueChange={(value) => setFormData(prev => ({...prev, severity: value}))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mild" id="mild" />
              <Label htmlFor="mild">Mild - Noticeable but not interfering with daily activities</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="moderate" />
              <Label htmlFor="moderate">Moderate - Interfering with some activities</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="severe" id="severe" />
              <Label htmlFor="severe">Severe - Significantly impacting daily life</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setCurrentStep(1)}>
            Back
          </Button>
          <Button 
            onClick={generateAssessment}
            disabled={formData.conditions.length === 0 || !formData.duration || !formData.severity}
            className="flex-1"
          >
            Generate AI Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderAssessment = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-accent" />
          AI Health Assessment Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`p-4 rounded-lg border-l-4 ${
          assessment.urgency === 'high' ? 'border-red-500 bg-red-50' :
          assessment.urgency === 'moderate' ? 'border-yellow-500 bg-yellow-50' :
          'border-green-500 bg-green-50'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {assessment.urgency === 'high' ? <AlertTriangle className="h-5 w-5 text-red-600" /> :
             assessment.urgency === 'moderate' ? <Clock className="h-5 w-5 text-yellow-600" /> :
             <CheckCircle className="h-5 w-5 text-green-600" />}
            <h3 className="font-semibold text-lg capitalize">
              {assessment.urgency} Priority
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Risk Score: {assessment.riskScore}/10 | Confidence: {assessment.confidence}%
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Recommendation:</h4>
          <p className="text-muted-foreground mb-4">{assessment.recommendation}</p>
          
          <h4 className="font-semibold mb-3">Suggested Actions:</h4>
          <ul className="space-y-2">
            {assessment.actions.map((action: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => {setCurrentStep(1); setAssessment(null);}}
          >
            Start New Assessment
          </Button>
          <Button className="flex-1" onClick={() => navigate('/book-appointment')}>
            Book Appointment
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center p-3 bg-muted/30 rounded">
          <strong>Disclaimer:</strong> This AI assessment is for informational purposes only and should not replace professional medical advice. 
          Always consult with qualified healthcare providers for accurate diagnosis and treatment.
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8 max-w-2xl mx-auto">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Health Assessment</h1>
            <p className="text-muted-foreground">Get personalized health recommendations</p>
          </div>
        </div>

        {loading ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Analyzing your symptoms...</h3>
              <p className="text-muted-foreground">Our AI is processing your health data to provide personalized recommendations</p>
            </CardContent>
          </Card>
        ) : assessment ? (
          renderAssessment()
        ) : currentStep === 1 ? (
          renderStep1()
        ) : (
          renderStep2()
        )}
      </div>
    </div>
  );
};

export default HealthAssessment;