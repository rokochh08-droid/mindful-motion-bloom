import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Layout } from "@/components/layout/Layout";
import { 
  Activity, 
  Brain, 
  Calendar, 
  Plus, 
  Sparkles, 
  TrendingUp,
  Heart,
  Target,
  Trophy
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoalsSection } from "@/components/dashboard/GoalsSection";
import { StreakTracker } from "@/components/dashboard/StreakTracker";
import { MotivationalCard } from "@/components/dashboard/MotivationalCard";

interface DashboardStats {
  streakDays: number;
  weeklyWorkouts: number;
  moodAverage: number;
  energyLevel: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    streakDays: 0,
    weeklyWorkouts: 0,
    moodAverage: 0,
    energyLevel: 0
  });

  useEffect(() => {
    // Load user stats from localStorage or API
    const savedStats = localStorage.getItem('userStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    } else {
      // Sample data for demo
      setStats({
        streakDays: 5,
        weeklyWorkouts: 3,
        moodAverage: 7.2,
        energyLevel: 8.1
      });
    }
  }, []);

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return "😊";
    if (mood >= 6) return "🙂";
    if (mood >= 4) return "😐";
    return "😔";
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Good morning! 👋</h1>
            <p className="text-muted-foreground">Ready to continue your journey?</p>
          </div>
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
            <Heart className="w-6 h-6 text-primary-foreground animate-pulse" />
          </div>
        </div>

        {/* Streak Tracker */}
        <StreakTracker />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => navigate('/workout')}
            className="h-16 bg-gradient-primary hover:shadow-glow transition-smooth group"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Start Workout
          </Button>
          <Button 
            onClick={() => navigate('/coach')}
            variant="outline"
            className="h-16 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary hover:shadow-soft transition-smooth group"
          >
            <Brain className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            AI Coach
          </Button>
        </div>

        {/* Goals Section */}
        <GoalsSection />


        {/* Mood & Energy */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Sparkles className="w-5 h-5 mr-2 text-accent" />
              How You're Feeling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Mood Average</span>
                <span className="text-sm font-medium">
                  {getMoodEmoji(stats.moodAverage)} {stats.moodAverage}/10
                </span>
              </div>
              <Progress value={stats.moodAverage * 10} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Energy Level</span>
                <span className="text-sm font-medium">⚡ {stats.energyLevel}/10</span>
              </div>
              <Progress value={stats.energyLevel * 10} className="h-2" />
            </div>
          </CardContent>
        </Card>



        {/* AI Coach Insight - Smaller & Less Prominent */}
        <Card className="shadow-card bg-muted/30 border-muted">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                <Brain className="w-3 h-3 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  Your consistency is great! Consider adding mobility work.
                </p>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => navigate('/coach')}
                className="text-xs text-primary hover:text-primary-dark h-6 px-2"
              >
                AI Coach
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}