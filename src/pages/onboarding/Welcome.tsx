import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Brain, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-calm flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Logo/Icon */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-6 animate-pulse-glow">
            <Heart className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">FitMind</h1>
          <p className="text-muted-foreground text-lg">Your supportive fitness companion</p>
        </div>

        {/* Mission Statement */}
        <Card className="shadow-card border-0">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe fitness is about more than numbers. It's about building confidence, 
              celebrating progress, and supporting each other through every step of the journey.
            </p>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-card rounded-lg shadow-soft">
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">AI Coach</h3>
              <p className="text-sm text-muted-foreground">Personalized support that adapts to you</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-card rounded-lg shadow-soft">
            <div className="w-10 h-10 bg-success-light rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Mood Tracking</h3>
              <p className="text-sm text-muted-foreground">Understand your emotional fitness journey</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-card rounded-lg shadow-soft">
            <div className="w-10 h-10 bg-accent-light rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Supportive Community</h3>
              <p className="text-sm text-muted-foreground">Connect with others who understand</p>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/onboarding/goals')}
            className="w-full bg-gradient-primary hover:shadow-glow transition-smooth text-lg py-6"
          >
            Begin Your Journey
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Join thousands who've found their supportive fitness community
          </p>
        </div>
      </div>
    </div>
  );
}