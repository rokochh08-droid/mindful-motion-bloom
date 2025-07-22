import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Goals() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    primaryGoal: "",
    fitnessLevel: "",
    workoutFrequency: "",
    challenges: "",
    motivation: ""
  });

  const primaryGoals = [
    "Build strength and muscle",
    "Improve cardiovascular health",
    "Lose weight/get leaner",
    "Increase flexibility/mobility",
    "Build healthy habits",
    "Improve mental health",
    "Train for specific sport/event",
    "General wellness and energy"
  ];

  const fitnessLevels = [
    "Complete beginner",
    "Some experience (few months)",
    "Intermediate (1-2 years)",
    "Advanced (3+ years)",
    "Returning after break"
  ];

  const workoutFrequencies = [
    "1-2 times per week",
    "3-4 times per week", 
    "5-6 times per week",
    "Daily",
    "Varies by week"
  ];

  const handleNext = () => {
    // Store data in localStorage for now
    localStorage.setItem('userGoals', JSON.stringify(formData));
    navigate('/onboarding/personality');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/welcome')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '33%' }}></div>
            </div>
          </div>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Let's Set Your Goals</CardTitle>
            <p className="text-muted-foreground text-center">
              Help us understand what success looks like for you
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Goal */}
            <div className="space-y-2">
              <Label htmlFor="primaryGoal">What's your main fitness goal?</Label>
              <Select value={formData.primaryGoal} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, primaryGoal: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary goal" />
                </SelectTrigger>
                <SelectContent>
                  {primaryGoals.map((goal) => (
                    <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fitness Level */}
            <div className="space-y-2">
              <Label htmlFor="fitnessLevel">Current fitness level</Label>
              <Select value={formData.fitnessLevel} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, fitnessLevel: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select your current level" />
                </SelectTrigger>
                <SelectContent>
                  {fitnessLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Workout Frequency */}
            <div className="space-y-2">
              <Label htmlFor="workoutFrequency">How often do you want to work out?</Label>
              <Select value={formData.workoutFrequency} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, workoutFrequency: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {workoutFrequencies.map((freq) => (
                    <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Challenges */}
            <div className="space-y-2">
              <Label htmlFor="challenges">What challenges have you faced with fitness before?</Label>
              <Textarea 
                id="challenges"
                placeholder="e.g., lack of motivation, time constraints, feeling intimidated..."
                value={formData.challenges}
                onChange={(e) => setFormData(prev => ({ ...prev, challenges: e.target.value }))}
                className="resize-none"
                rows={3}
              />
            </div>

            {/* Motivation */}
            <div className="space-y-2">
              <Label htmlFor="motivation">What motivates you most?</Label>
              <Textarea 
                id="motivation"
                placeholder="e.g., feeling strong, having energy for family, achieving personal goals..."
                value={formData.motivation}
                onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                className="resize-none"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleNext}
          disabled={!formData.primaryGoal || !formData.fitnessLevel}
          className="w-full bg-gradient-primary hover:shadow-glow transition-smooth"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}