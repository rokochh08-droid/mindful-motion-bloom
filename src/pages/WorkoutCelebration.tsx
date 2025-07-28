import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Star, 
  Clock, 
  Zap, 
  Heart, 
  Target,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface WorkoutData {
  name: string;
  duration: number;
  exercises: any[];
  moodAfter: number;
  energyAfter: number;
  difficulty: number;
}

export default function WorkoutCelebration() {
  const navigate = useNavigate();
  const location = useLocation();
  const workoutData: WorkoutData = location.state?.workoutData;
  
  const [showContent, setShowContent] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // Animate content in
    setTimeout(() => setShowContent(true), 500);
    setTimeout(() => setShowStats(true), 1200);
  }, []);

  if (!workoutData) {
    // Redirect to dashboard if no workout data
    navigate('/');
    return null;
  }

  const motivationalMessages = [
    "You absolutely crushed it today! 💪",
    "What an incredible session! 🔥",
    "You showed up and dominated! ⚡",
    "That was pure dedication in action! 🎯",
    "Your future self is thanking you! 🙏",
    "Champion mindset on full display! 🏆"
  ];

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  const handleContinue = () => {
    navigate('/progress', { 
      state: { 
        celebrateWorkout: true,
        completedWorkout: workoutData
      } 
    });
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/20 via-primary/10 to-accent/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-success/30 to-primary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-gradient-to-br from-accent/20 to-success/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <Sparkles 
            key={i}
            className={`absolute text-accent/40 animate-bounce`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg w-full space-y-8">
          {/* Main Celebration Card - Picture in Picture Style */}
          <div className={`transform transition-all duration-1000 ${showContent ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
            <Card className="bg-white/95 backdrop-blur-xl border-success/20 shadow-2xl rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-success via-primary to-accent p-1">
                <div className="bg-white rounded-[calc(1.5rem-4px)] p-8">
                  <div className="text-center space-y-6">
                    {/* Trophy Icon */}
                    <div className="relative">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent to-success rounded-full flex items-center justify-center shadow-lg">
                        <Trophy className="w-10 h-10 text-white animate-bounce" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Main Message */}
                    <div className="space-y-3">
                      <h1 className="text-3xl font-bold text-foreground">
                        Workout Complete!
                      </h1>
                      <p className="text-lg text-success font-medium">
                        {randomMessage}
                      </p>
                      <p className="text-muted-foreground">
                        You completed <span className="font-semibold text-primary">{workoutData.name}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Cards - Picture in Picture Overlay Style */}
          <div className={`grid grid-cols-2 gap-4 transform transition-all duration-1000 delay-700 ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {/* Duration */}
            <Card className="bg-white/90 backdrop-blur-lg border-primary/20 shadow-xl rounded-2xl p-4">
              <CardContent className="p-0 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{workoutData.duration}m</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </CardContent>
            </Card>

            {/* Exercises */}
            <Card className="bg-white/90 backdrop-blur-lg border-accent/20 shadow-xl rounded-2xl p-4">
              <CardContent className="p-0 text-center">
                <Target className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{workoutData.exercises.length}</div>
                <div className="text-sm text-muted-foreground">Exercises</div>
              </CardContent>
            </Card>

            {/* Energy */}
            <Card className="bg-white/90 backdrop-blur-lg border-warning/20 shadow-xl rounded-2xl p-4">
              <CardContent className="p-0 text-center">
                <Zap className="w-8 h-8 text-warning mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{workoutData.energyAfter}/10</div>
                <div className="text-sm text-muted-foreground">Energy</div>
              </CardContent>
            </Card>

            {/* Mood */}
            <Card className="bg-white/90 backdrop-blur-lg border-success/20 shadow-xl rounded-2xl p-4">
              <CardContent className="p-0 text-center">
                <Heart className="w-8 h-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{workoutData.moodAfter}/10</div>
                <div className="text-sm text-muted-foreground">Mood</div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className={`space-y-4 transform transition-all duration-1000 delay-1000 ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Button
              onClick={handleContinue}
              className="w-full h-14 text-lg bg-gradient-to-r from-success to-primary text-white hover:from-success/90 hover:to-primary/90 rounded-2xl shadow-lg"
            >
              See Your Progress
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              className="w-full h-12 text-muted-foreground hover:text-foreground rounded-2xl"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}